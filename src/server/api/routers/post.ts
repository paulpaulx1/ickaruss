import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "zicarus/server/api/trpc";
import { posts } from "zicarus/server/db/schema";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      try {
        // simulate a slow db call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        await ctx.db.insert(posts).values({
          name: input.name,
          createdById: ctx.session.user.id,
        });
      } catch (error) {
        console.error("Error occurred while creating post:", error);
        throw new Error("Failed to create post. Please try again.");
      }
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    try {
      return await ctx.db.query.posts.findFirst({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      });
    } catch (error) {
      console.error("Error occurred while fetching latest post:", error);
      throw new Error("Failed to fetch latest post. Please try again.");
    }
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});