import { relations, sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
  time,
  date,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `zicuras_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postalCode", { length: 20 }),
  isVendor: boolean("isVendor").default(sql`false`),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  messages: many(messages, { relationName: "messages" }),
}));

export const vendors = createTable(
  "vendor",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    businessName: varchar("businessName", { length: 255 }),
    businessDescription: text("businessDescription"),
    accountCreated: boolean("accountCreated").default(sql`false`),
    stripeAccountId: varchar("stripeAccountId", { length: 255 }),
    isSubscribed: boolean("isSubscribed").default(sql`false`),
    image: varchar("image", { length: 255 }),
    video: varchar("video", { length: 255 }),
  },
  (vendor) => ({
    userIdIdx: index("vendor_userId_idx").on(vendor.userId),
  }),
);

export const vendorsRelations = relations(vendors, ({ one }) => ({
  user: one(users, { fields: [vendors.userId], references: [users.id] }),
}));

export const services = createTable(
  "service",
  {
    id: serial("id").primaryKey(),
    vendorId: varchar("vendorId", { length: 255 })
      .notNull()
      .references(() => vendors.id),
    serviceName: varchar("serviceName", { length: 255 }),
    serviceDescription: text("serviceDescription"),
    price: integer("price"), // Store in the smallest currency unit (e.g., cents)
    depositPrice: integer("depositPrice"),
    finalPaymentPrice: integer("finalPaymentPrice"),
    currency: varchar("currency", { length: 3 }),
    video: varchar("video", { length: 255 }),
    imageUrl: varchar("image", { length: 255 }),
    stripeProductId: varchar("stripeProductId", { length: 255 }),
    depositPriceId: varchar("depositPriceId", { length: 255 }),
    finalPaymentPriceId: varchar("finalPaymentPriceId", { length: 255 }),
    active: boolean("active").default(sql`true`),
  },
  (service) => ({
    vendorIdIdx: index("service_vendorId_idx").on(service.vendorId),
    // Add or modify indexes as needed
  }),
);

export const deposits = createTable(
  "deposit",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    serviceId: integer("serviceId")
      .notNull()
      .references(() => services.id),
    amount: integer("amount"), // Assuming storing in the smallest currency unit
    status: varchar("status", { length: 50 }), // e.g., "pending", "completed", "refunded"
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (deposit) => ({
    userIdIdx: index("deposit_userId_idx").on(deposit.userId),
    serviceIdIdx: index("deposit_serviceId_idx").on(deposit.serviceId),
  }),
);

export const payments = createTable(
  "payment",
  {
    id: serial("id").primaryKey(),
    bookingId: integer("bookingId")
      .notNull()
      .references(() => bookings.id), // Assuming you have a `bookings` table
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 50 }), // "deposit" or "final_payment"
    amount: integer("amount"),
    status: varchar("status", { length: 50 }), // e.g., "pending", "completed", "refunded"
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),

  },
  (payment) => ({
    bookingIdIdx: index("payment_bookingId_idx").on(payment.bookingId),
    userIdIdx: index("payment_userId_idx").on(payment.userId),
  }),
);

export const transactions = createTable(
  "transaction",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    vendorId: varchar("vendorId", { length: 255 }).references(() => vendors.id),
    amount: integer("amount"), // Store in the smallest currency unit (e.g., cents)
    currency: varchar("currency", { length: 3 }),
    transactionType: varchar("transactionType", { length: 50 }), // "purchase", "vendor_upgrade"
    status: varchar("status", { length: 50 }), // e.g., "succeeded", "pending", "failed"
    stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", {
      length: 255,
    }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (transaction) => ({
    userIdIdx: index("transaction_userId_idx").on(transaction.userId),
    vendorIdIdx: index("transaction_vendorId_idx").on(transaction.vendorId),
    stripeSessionIdIdx: index("transaction_stripeSessionId_idx").on(
      transaction.stripeCheckoutSessionId,
    ),
    transactionTypeIdx: index("transaction_transactionType_idx").on(
      transaction.transactionType,
    ),
  }),
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, { fields: [transactions.userId], references: [users.id] }),
  vendor: one(vendors, {
    fields: [transactions.vendorId],
    references: [vendors.id],
  }),
}));

export const bookings = createTable(
  "booking",
  {
    id: serial("id").primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    serviceId: integer("serviceId")
      .notNull()
      .references(() => services.id),
    vendorId: varchar("vendorId", { length: 255 })
      .notNull()
      .references(() => vendors.id),
    status: varchar("status", { length: 50 }).default("pending"),
    date: varchar("date", { length: 255 }), 
    startTime: varchar("startTime", { length: 255 }), 
    endTime: varchar("endTime", { length: 255 }),
    depositPaid: boolean("depositPaid").default(sql`false`),
    finalPaymentPaid: boolean("finalPaymentPaid").default(sql`false`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (booking) => ({
    userIdIdx: index("booking_userId_idx").on(booking.userId),
    serviceIdIdx: index("booking_serviceId_idx").on(booking.serviceId),
    vendorIdIdx: index("booking_vendorId_idx").on(booking.vendorId),
  }),
);

export const unavailabilities = createTable(
  "unavailability",
  {
    id: serial("id").primaryKey(),
    vendorId: varchar("vendorId", { length: 255 })
      .notNull()
      .references(() => vendors.id),
    date: varchar("date", { length: 255 }), 
    startTime: varchar("startTime", { length: 255 }), 
    endTime: varchar("endTime", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
    isRecurring: boolean("isRecurring").default(sql`false`),
    timeZone: varchar("timeZone", { length: 255 }),
    dayOfWeek: integer("dayOfWeek").notNull(),
  },
  (unavailability) => ({
    vendorIdIdx: index("unavailability_vendorId_idx").on(
      unavailability.vendorId,
    ),
    dateIdx: index("unavailability_date_idx").on(unavailability.date),
  }),
);

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);

export const conversations = createTable("conversation", {
  id: serial("id").primaryKey(),
  participantOneId: varchar("participant_one_id", { length: 255 }).notNull().references(() => users.id),
  participantTwoId: varchar("participant_two_id", { length: 255 }).notNull().references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  lastMessageId: integer("last_message_id"), 
});

export const messages = createTable("message", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id),
  senderId: varchar("sender_id", { length: 255 }).notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const notifications = createTable("notification", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), 
  content: text("content"),
  isRead: boolean("is_read").default(sql`false`),
  createdAt: timestamp("created_at", { withTimezone: true }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));