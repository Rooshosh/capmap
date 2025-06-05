import { initTRPC, TRPCError } from '@trpc/server';
import { auth } from '@/auth';

/**
 * Context type definition
 */
export async function createContext() {
  const session = await auth();
  return {
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ next }) => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({
    ctx: { session },
  });
});

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(isAuthed); 