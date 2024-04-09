import { createTRPCRouter, protectedProcedure } from "zicarus/server/api/trpc";
import { z } from "zod";
import { env } from "zicarus/env";
import Stripe from "stripe";
import {
  users,
  vendors,
  notifications,
  services,
  bookings,
} from "zicarus/server/db/schema";
import { eq } from "drizzle-orm";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export const bookingsRouter = createTRPCRouter({
  requestBooking: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        vendorId: z.string().min(1),
        businessName: z.string().min(1),
        serviceId: z.number(),
        startTime: z.string().min(1),
        endTime: z.string().min(1),
        date: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = ctx.db;
        const {
          userId,
          vendorId,
          serviceId,
          startTime,
          endTime,
          date,
          businessName,
        } = input;
        const user = await db.select().from(users).where(eq(users.id, userId));
        const [vendor] = await db
          .select()
          .from(vendors)
          .where(eq(vendors.id, vendorId));

        const [service] = await db
          .select()
          .from(services)
          .where(eq(services.id, serviceId));

        if (!user || !vendor || !service) {
          throw new Error("User, vendor, or service not found");
        }

        await db.insert(bookings).values({
          userId,
          vendorId,
          serviceId,
          startTime,
          endTime,
          date,
        });

        await db.insert(notifications).values({
          type: "booking_request",
          userId: vendor.userId,
        });
        const { serviceName } = service;
        return { businessName, serviceName };
      } catch (error) {
        console.error("Error requesting booking:", error);
        throw new Error("Failed to request booking");
      }
    }),

  confirmBooking: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = ctx.db;
        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, input.bookingId));
        if (!booking) {
          throw new Error("Booking not found");
        }
        await db
          .update(bookings)
          .set({ status: "confirmed" })
          .where(eq(bookings.id, input.bookingId));
        await db.insert(notifications).values({
          type: "booking_confirmed",
          userId: booking.userId,
        });
      } catch (error) {
        console.error("Error confirming booking:", error);
        throw new Error("Failed to confirm booking");
      }
    }),

  cancelBooking: protectedProcedure
    .input(
      z.object({
        bookingId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = ctx.db;
        const [booking] = await db
          .select()
          .from(bookings)
          .where(eq(bookings.id, input.bookingId));
        if (!booking) {
          throw new Error("Booking not found");
        }
        await db
          .update(bookings)
          .set({ status: "cancelled" })
          .where(eq(bookings.id, input.bookingId));
        await db.insert(notifications).values({
          type: "booking_cancelled",
          userId: booking.userId,
        });
      } catch (error) {
        console.error("Error cancelling booking:", error);
        throw new Error("Failed to cancel booking");
      }
    }),

  getBookingsByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = ctx.db;
        const bookingsList = await db
          .select({
            bookingId: bookings.id,
            startTime: bookings.startTime,
            endTime: bookings.endTime,
            date: bookings.date,
            status: bookings.status,
            depositPaid: bookings.depositPaid,
            finalPaymentPaid: bookings.finalPaymentPaid,
            service: {
              id: services.id,
              name: services.serviceName,
              depositPriceId: services.depositPriceId,
              finalPaymentPriceId: services.finalPaymentPriceId,
            },
            vendor: {
              id: vendors.id,
              businessName: vendors.businessName,
              stripeAccountId: vendors.stripeAccountId,
            },
          })
          .from(bookings)
          .where(eq(bookings.userId, input.userId))
          .fullJoin(services, eq(services.id, bookings.serviceId))
          .fullJoin(vendors, eq(vendors.id, services.vendorId));

          return bookingsList;

      } catch (error) {
        console.error("Error fetching bookings by user ID:", error);
        throw new Error("Failed to fetch bookings by user ID");
      }
    }),
});
