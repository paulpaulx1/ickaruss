import { createTRPCRouter, protectedProcedure } from "zicarus/server/api/trpc";
import { z } from "zod";
import { env } from "../../../env";
import { db } from "../../db/index";
import Stripe from "stripe";
import { v4 as uuidv4 } from "uuid";
import { users, vendors } from "zicarus/server/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const stripeRouter = createTRPCRouter({
  createVendorAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    const [existingVendor] = await db
      .select()
      .from(vendors)
      .where(eq(vendors.userId, userId));

    if (existingVendor?.stripeAccountId) {
      throw new Error("Vendor already has a Stripe account.");
    }

    const email = ctx.session.user.email ?? "defaultemail@example.com";

    const account = await stripe.accounts.create({
      type: "express",
      email: email,
      metadata: {
        userId: userId,
      },
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${env.REDIRECT_URL_BASE}/profile/${ctx.session.user.id}`,
      return_url: `${env.REDIRECT_URL_BASE}/profile/${ctx.session.user.id}`,
      type: "account_onboarding",
    });

    return { onboardingUrl: accountLink.url };
  }),

  upgradeVendorSubscription: protectedProcedure
    .input(z.object({ priceId: z.string(), userId: z.string() })) // Assuming you have the session ID and user ID
    .mutation(async ({ input }) => {
      // Retrieve the checkout session to confirm payment success
      const { userId } = input;
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: input.priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${env.REDIRECT_URL_BASE}/profile/${userId}`,
        cancel_url: `${env.REDIRECT_URL_BASE}/profile/${userId}`,
        client_reference_id: input.userId,
      });

      // Update the vendor's subscription status
      const result = await db
        .update(vendors)
        .set({ isSubscribed: true })
        .where(eq(vendors.userId, input.userId))
        .execute();

      if (!result) {
        throw new Error("Failed to update vendor subscription status.");
      }

      return {
        url: session.url,
        success: true,
        message: "Vendor subscription upgraded successfully.",
      };
    }),

  payForProductWithPriceID: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        stripeAccountId: z.string(),
        bookingId: z.number(),
        // successUrl: z.string().url(),
        // cancelUrl: z.string().url(),
        quantity: z.number().min(1).optional(), // Optional, default to 1 if not provided
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure the user is authenticated
      const userId = ctx.session.user.id;
      if (!userId) {
        throw new Error("User is not authenticated.");
      }

      // Optional: You might want to verify the price ID or product related to it
      // This can include checking if the product is still available, not archived, etc.

      // Create a checkout session

      try {
        console.log("price ID", input.priceId);
        const session = await stripe.checkout.sessions.create(
          {
            payment_method_types: ["card"],
            line_items: [
              {
                price: input.priceId,
                quantity: input.quantity ?? 1, 
              },
            ],
            mode: "payment", // Use 'subscription' for recurring payments
            success_url: env.REDIRECT_URL_BASE,
            cancel_url: env.REDIRECT_URL_BASE,
            client_reference_id: userId,
            metadata: {
              bookingId: input.bookingId, // Include bookingId in metadata for webhook processing
              stripeAccountId: input.stripeAccountId,
              priceId: input.priceId,
            },
          },
          // Associate the checkout session with our user
          { stripeAccount: input.stripeAccountId },
        );

        return { sessionId: session.id, url: session.url };
      } catch (error) {
        console.error("Failed to create Stripe checkout session:", error);
        throw new Error("Failed to initiate payment process.");
      }
    }),
});
