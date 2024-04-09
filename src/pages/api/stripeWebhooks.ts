import Stripe from "stripe";
import { env } from "../../env";
import { db } from "zicarus/server/db";
import { eq } from "drizzle-orm";
import {
  vendors,
  transactions,
  users,
  bookings,
} from "zicarus/server/db/schema";
import type { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { useSession } from "next-auth/react";
import { v4 as uuidv4 } from "uuid";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const buf = await buffer(req);
    const sig = req.headers["stripe-signature"];

    try {
      if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
        throw new Error("Missing necessary verification information.");
      }
      const event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        env.STRIPE_WEBHOOK_SECRET,
      );

      console.log("Event type: ", event.type, "STRIPE WEBHOOK FIRING");

      switch (event.type) {

        case "account.updated":
          const account = event.data.object;
          const userId = account.metadata?.userId;

          if (account.details_submitted) {
            // The account setup is completed
            if (!userId) {
              console.log("User ID not found in metadata.");
              break;
            }

            // Find the existing vendor in your database
            const [existingVendor] = await db
              .select()
              .from(vendors)
              .where(eq(vendors.userId, userId));

            if (!existingVendor) {
              // Create a new vendor account in your database
              const newVendorId = uuidv4();
              await db
                .insert(vendors)
                .values({
                  id: newVendorId,
                  userId: userId,
                  businessName: "Default Business Name",
                  businessDescription: "Default Business Description",
                  stripeAccountId: account.id,
                  accountCreated: true,
                })
                .execute();

              await db
                .update(users)
                .set({ isVendor: true })
                .where(eq(users.id, userId));
            } else {
              await db
                .update(vendors)
                .set({ stripeAccountId: account.id })
                .where(eq(vendors.userId, userId));
              await db
                .update(users)
                .set({ isVendor: true })
                .where(eq(users.id, userId));

              console.log(`User ${userId} marked as vendor.`);
            }
          } else {
            console.log(
              `Vendor ${userId} already has a linked Stripe account.`,
            );
          }

          break;

        case "checkout.session.completed":

          console.log("Checkout session completed");

          const session = event.data.object;
          
          const user_id = session?.client_reference_id ?? "";
          

          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id,
            { limit: 1 },
            {stripeAccount: session.metadata?.stripeAccountId}
          );

          const upgradePriceId = "price_1OoZ0pHLAzF5yr08DAALdT2n";
          const isUpgrade = lineItems.data.some(
            (lineItem) => lineItem?.price?.id === upgradePriceId,
          );

          console.log("is upgrade", isUpgrade);

          if (!user_id) {
            throw new Error("Session does not have a valid user ID");
          }

          if (isUpgrade) {
            const [vendor] = await db
              .select()
              .from(vendors)
              .where(eq(vendors.userId, user_id));

            await db
              .insert(transactions)
              .values({
                userId: user_id,
                vendorId: vendor?.id,
                amount: session.amount_total,
                currency: session.currency,
                transactionType: "vendor_upgrade",
                status: "succeeded",
                stripeCheckoutSessionId: session.id,
              })
              .execute();

            await db
              .update(vendors)
              .set({
                isSubscribed: true,
              })
              .where(eq(vendors.userId, user_id));

            console.log(`Vendor upgrade logged for user ID: ${user_id}`);
          }

          const isBooking = session.metadata?.bookingId;
          if (isBooking) {
            const priceId = session.metadata?.priceId ?? "";

            const price = await stripe.prices.retrieve(priceId, {
              stripeAccount:
                session.metadata
                  ?.stripeAccountId ?? "",
            });
            if (price.metadata?.paymentType === "deposit") {
              await db
                .update(bookings)
                .set({ status: "confirmed", depositPaid: true })
                .where(
                  eq(bookings.id, Number(session.metadata?.bookingId) ?? -1),
                );
            } else if (price.metadata?.paymentType === "finalPayment") {
              await db
                .update(bookings)
                .set({ finalPaymentPaid: true })
                .where(
                  eq(bookings.id, Number(session.metadata?.bookingId) ?? -1),
                );
            }
          }
          break;

        // Handle other event types...
      }

      res.json({ received: true });
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Webhook Error: ${err.message}`); // Now it's safe to access 'message'.
        return res.status(400).send(`Webhook Error: ${err.message}`);
      } else {
        console.error("An unknown error occurred");
        return res.status(400).send("An unknown error occurred");
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
