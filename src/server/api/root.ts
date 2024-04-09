import { postRouter } from "zicarus/server/api/routers/post";
import { profileRouter } from 'zicarus/server/api/routers/profile'
import { createTRPCRouter } from "zicarus/server/api/trpc";
import { stripeRouter } from "./routers/stripe";
import { vendorRouter } from "./routers/vendor";
import { bookingsRouter } from "./routers/bookings";
// import { conversationsRouter } from './routers/conversations';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  profile: profileRouter,
  stripe: stripeRouter,
  vendor: vendorRouter,
  booking: bookingsRouter
  // conversations: conversationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
