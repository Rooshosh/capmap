import { router } from '../trpc';

export const appRouter = router({
  // We'll add our routes here later
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter; 