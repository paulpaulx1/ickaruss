import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "zicarus/server/api/trpc";
import { z } from "zod";
import { unavailabilities, services, vendors } from "zicarus/server/db/schema";
import { and, eq } from "drizzle-orm";
import Stripe from "stripe";
import { env } from "../../../env";
import { DateTime } from "luxon";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const vendorRouter = createTRPCRouter({
  getVendorByID: publicProcedure
    .input(
      z.object({
        vendorId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const [vendor] = await ctx.db
          .select()
          .from(vendors)
          .where(eq(vendors.id, input.vendorId));

        if (!vendor) {
          throw new Error("Vendor not found");
        }

        return vendor;
      } catch (error) {
        console.error("Error fetching vendor by ID:", error);
        throw new Error("Failed to fetch vendor by ID");
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        vendorId: z.string().min(1),
        businessName: z.string().min(1),
        businessDescription: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.vendorId) {
          throw new Error("Vendor ID is required");
        }
        await ctx.db
          .update(vendors)
          .set({
            businessName: input.businessName,
            businessDescription: input.businessDescription,
          })
          .where(eq(vendors.id, input.vendorId));
        const [updatedVendor] = await ctx.db
          .select()
          .from(vendors)
          .where(eq(vendors.id, input.vendorId));
        if (!updatedVendor) {
          throw new Error("Vendor not found after update");
        }
        return updatedVendor;
      } catch (error) {
        console.error("Error updating vendor profile:", error);
        throw new Error("Failed to update vendor profile");
      }
    }),

  getAllVendors: publicProcedure.query(async ({ ctx }) => {
    try {
      const allVendors = await ctx.db.select().from(vendors);
      return allVendors;
    } catch (error) {
      console.error("Error fetching all vendors:", error);
      throw new Error("Failed to fetch all vendors");
    }
  }),

  updateImage: protectedProcedure
  .input(z.object({
    image: z.string().min(1),
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      if (!ctx.session.user.id) {
        throw new Error("User is not authenticated");
      }
      await ctx.db
        .update(vendors)
        .set({ image: input.image })
        .where(eq(vendors.userId, ctx.session.user.id));

      const [updatedVendor] = await ctx.db
        .select()
        .from(vendors)
        .where(eq(vendors.userId, ctx.session.user.id));

      if (!updatedVendor) {
        throw new Error("Vendor not found after update");
      }
      
      return updatedVendor;
    } catch (error) {
      console.error("Error updating vendor image:", error);
      throw new Error("Failed to update vendor image");
    }
  }),

  getVendorByUserID: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const [vendor] = await ctx.db
          .select()
          .from(vendors)
          .where(eq(vendors.userId, input.userId));

        if (!vendor) {
          throw new Error("Vendor not found for the given user ID");
        }

        return vendor;
      } catch (error) {
        console.error("Error fetching vendor by user ID:", error);
        throw new Error("Failed to fetch vendor by user ID");
      }
    }),
  createService: protectedProcedure
    .input(
      z.object({
        vendorId: z.string().min(1),
        serviceName: z.string(),
        serviceDescription: z.string(),
        price: z.number().nonnegative(),
        currency: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const [vendor] = await ctx.db
          .select()
          .from(vendors)
          .where(eq(vendors.id, input.vendorId)); // Assuming you're using vendorId to fetch

        if (!vendor) {
          throw new Error("Vendor not found");
        }

        if (!vendor.stripeAccountId) {
          throw new Error("Vendor's Stripe account ID not found");
        }

        const depositAmount = Math.round(input.price * 0.2 * 100); // Multiply by 100 to convert to cents, then round
        const finalPaymentAmount = Math.round(input.price * 100) - depositAmount;

        const stripeProduct = await stripe.products.create(
          {
            name: input.serviceName,
            description: input.serviceDescription,
          },
          {
            stripeAccount: vendor.stripeAccountId,
          },
        );

        const depositPrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: depositAmount, // Convert to cents
          currency: input.currency,
          metadata: { paymentType: 'deposit' }, 
        }, { stripeAccount: vendor.stripeAccountId });

        const finalPaymentPrice = await stripe.prices.create({
          product: stripeProduct.id,
          unit_amount: finalPaymentAmount, // Convert to cents
          currency: input.currency,
          metadata: { paymentType: 'finalPayment' }, 
        }, { stripeAccount: vendor.stripeAccountId });

        const service = {
          vendorId: vendor.id,
          serviceName: input.serviceName,
          serviceDescription: input.serviceDescription,
          price: input.price,
          currency: input.currency,
          stripeProductId: stripeProduct.id, 
          depositPrice: depositPrice.unit_amount,
          finalPaymentPrice: finalPaymentPrice.unit_amount,
          depositPriceId: depositPrice.id, 
          finalPaymentPriceId: finalPaymentPrice.id,
        };

        await ctx.db.insert(services).values(service);

        return { success: true, productId: stripeProduct.id, service };
      } catch (error) {
        console.error("Error creating service:", error);
        throw new Error("Failed to create service");
      }
    }),

  getTenServices: publicProcedure.query(async ({ ctx }) => {
    const servicesList = await ctx.db
      .select()
      .from(services)
      .where(eq(services.active, true))
      .limit(10);
    if (!servicesList) {
      throw new Error("No services found for this vendor");
    }

    return servicesList;
  }),
  getServicesByVendorId: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const servicesList = await ctx.db
        .select()
        .from(services)
        .where(
          and(eq(services.vendorId, input.vendorId), eq(services.active, true)),
        );

      if (!servicesList) {
        throw new Error("No services found for this vendor");
      }

      return servicesList;
    }),

  deleteService: protectedProcedure
    .input(z.object({ stripeProductId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [vendor] = await ctx.db
        .select()
        .from(vendors)
        .where(eq(vendors.userId, ctx.session.user.id));

      try {
        await ctx.db
          .update(services)
          .set({ active: false })
          .where(eq(services.stripeProductId, input.stripeProductId));

        await archiveProduct(
          input.stripeProductId,
          vendor?.stripeAccountId ? vendor.stripeAccountId : "",
        );

        return { success: true };
      } catch (error) {
        console.error("Error deleting service:", error);
        // Including a specific error code or type in the thrown error can be helpful
        throw new Error("Failed to delete service");
      }
    }),

  getUnavailabilitiesByVendorId: publicProcedure
    .input(
      z.object({
        vendorId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const unavailabilitiesList = await ctx.db
        .select()
        .from(unavailabilities)
        .where(eq(unavailabilities.vendorId, input.vendorId));

      if (!unavailabilitiesList) {
        throw new Error("No unavailabilities found for this vendor");
      }
      return unavailabilitiesList;
    }),

  addUnavailability: protectedProcedure
    .input(
      z.object({
        vendorId: z.string(),
        dayOfWeek: z.number().min(0).max(6),
        startTime: z.string(),
        date: z.string(),
        endTime: z.string(),
        timeZone: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const startDateTime = DateTime.fromISO(input.startTime, {
        zone: input.timeZone ?? "UTC",
      });
      const endDateTime = DateTime.fromISO(input.endTime, {
        zone: input.timeZone ?? "UTC",
      });
      if (!startDateTime.isValid || !endDateTime.isValid) {
        throw new Error(
          "Invalid start time or end time. Please provide valid ISO 8601 strings.",
        );
      }

      if (startDateTime >= endDateTime) {
        throw new Error("Start time must be before end time.");
      }

      const unavailability = {
        date: startDateTime.toISODate(),
        vendorId: input.vendorId,
        dayOfWeek: input.dayOfWeek,
        startTime: startDateTime.toISO(),
        endTime: endDateTime.toISO(),
        timeZone: input.timeZone ?? "UTC",
      };
      const newUnavailability = await ctx.db
        .insert(unavailabilities)
        .values(unavailability)
        .returning();

      if (!newUnavailability) {
        throw new Error("Failed to add unavailability");
      }
      console.log(newUnavailability, "newUnavailability");
      return { success: true, newUnavailability };
    }),

  deleteUnavailability: protectedProcedure
    .input(
      z.object({
        unavailabilityId: z.string(), // Assuming the availability ID is a string; adjust as needed
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const deleteResult = await ctx.db
          .delete(unavailabilities)
          .where(eq(unavailabilities.id, parseInt(input.unavailabilityId, 10)));

        if (deleteResult.length === 0) {
          throw new Error("Unvailability slot not found or already deleted");
        }

        return {
          success: true,
          message: "Unavailability deleted successfully",
        };
      } catch (error) {
        console.error("Error deleting unavailability:", error);
        throw new Error("Failed to delete unavailability");
      }
    }),
});

async function archiveProduct(
  stripeProductId: string,
  stripeAccountId: string,
) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  await stripe.products.update(
    stripeProductId,
    { active: false },
    { stripeAccount: stripeAccountId },
  );
}
