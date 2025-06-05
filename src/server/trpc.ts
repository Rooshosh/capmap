import { initTRPC } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '@/auth';

/**
 * Context type definition
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
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
const t = initTRPC.context<Context>().create();

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;

/**
 * Protected procedure that requires authentication
 */
export const protectedProcedure = t.procedure.use(
  middleware(async ({ ctx, next }) => {
    if (!ctx.session?.user) {
      throw new Error('Not authenticated');
    }
    return next({
      ctx: {
        ...ctx,
        session: ctx.session,
      },
    });
  })
); 