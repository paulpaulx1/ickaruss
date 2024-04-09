// import { createTRPCRouter, protectedProcedure } from "zicarus/server/api/trpc";
// import { z } from "zod";
// import { db } from "../../db/index";
// import {
//   conversations,
//   messages,
//   notifications,
// } from "zicarus/server/db/schema";

// export const conversationsRouter = createTRPCRouter({
//   createConversation: protectedProcedure
//     .input(
//       z.object({
//         vendorId: z.string(),
//         userId: z.string(),
//         date: z.string(),
//         time: z.string(),
//         content: z.string(),
//       }),
//     )
//     .mutation(async ({ input, ctx }) => {
//       const { vendorId, userId, date, time, content } = input;

//       const [newConversation] = await db
//         .insert(conversations)
//         .values({}) 
//         .returning();

//       if (!newConversation) {
//         throw new Error("Failed to create conversation");
//       }

//       // Insert the initial message into the conversation
//       await db.insert(messages).values({
//         conversationId: newConversation.id,
//         senderId: userId,
//         content: content,
//       });

//       // Create a notification for the vendor about the new work request
//       await db.insert(notifications).values({
//         userId: vendorId,
//         type: "work_request",
//         content: `You have a new messagefrom user ${userId} on ${date} at ${time}: "${content}"`,
//       });

//       return {
//         success: true,
//         message: "Conversation and  created successfully",
//         conversationId: newConversation.id,
//       };
//     }),

//     createMessage: protectedProcedure
//     .input(
//       z.object({
//         conversationId: z.number(),
//         userId: z.string(),
//         content: z.string(),
//       }),
//     ).mutation(async ({ input, ctx }) => {
//         const { conversationId, userId, content } = input;

//         await db.insert(messages).values({
//             conversationId: conversationId,
//             senderId: userId,
//             content,
//         });

//         return {
//             success: true,
//             message: "Message created successfully",
//         };
//     }),

// });