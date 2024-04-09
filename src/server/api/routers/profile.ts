import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "zicarus/server/api/trpc";
import { eq } from "drizzle-orm";
import { users, unavailabilities } from "zicarus/server/db/schema";
import { postcodeValidator } from 'postcode-validator';
import { TRPCError } from "@trpc/server";


export const profileRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        city: z.string().min(1),
        state: z.string().min(1),
        postalCode: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.session?.user?.id; 
        if (!userId) {
          throw new Error("User not authenticated");
        }
        
        if (!postcodeValidator(input.postalCode, 'US')) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Invalid postal code. Please enter a valid US postal code.',
          });
        }

        await ctx.db
          .update(users)
          .set({
            name: input.name,
            city: input.city,
            state: input.state,
            postalCode: input.postalCode,
          })
          .where(eq(users.id, userId));

        const [updatedUser] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (!updatedUser) {
          throw new Error("User not found after update");
        }

        return updatedUser;
      } catch (error) {
        console.error("Error updating user profile:", error);
        throw new Error("Failed to update user profile");
      }
    }),
  
  updateUserImage: protectedProcedure
  .input(
    z.object({imageUrl: z.string().url()}),

  ).mutation(async({ctx, input})=>{
    try {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User not authenticated");
      }

      await ctx.db
        .update(users)
        .set({
          image: input.imageUrl,
        })
        .where(eq(users.id, userId));

        const [updatedUser] = await ctx.db
          .select()
          .from(users)
          .where(eq(users.id, userId));

        if (!updatedUser) {
          throw new Error("User not found after update");
        }
        console.log('Updated user image successfully!');
        return updatedUser;

    } catch (error) {
      console.error("Error updating user image:", error);
        throw new Error("Failed to update user image");
    }
  }),
  
  getUserByID: publicProcedure
  .input(z.object({ userId: z.string()}))
  .query(async ({ ctx }) => {
    try {
      const userId = ctx.session?.user?.id;
      if (!userId) {
        throw new Error("User ID not found in session");
      }
      
      const [user] = await ctx.db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      // Handle errors gracefully
      console.log("Error fetching user by ID:", ctx.session, error);
      throw new Error("Failed to fetch user by ID");
    }
  }),

  getAvailabilityByVendorId: publicProcedure
  .input(z.object({
    vendorId: z.string(),
  }))
  .query(async ({ ctx, input }) => {
    const availabilityList = await ctx.db
      .select()
      .from(unavailabilities)
      .where(eq(unavailabilities.vendorId, input.vendorId));

    if (!availabilityList.length) {
      throw new Error("No availability found for this vendor");
    }

    return availabilityList;
  }),
  
});