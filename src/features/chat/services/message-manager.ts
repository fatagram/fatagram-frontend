// import { Message } from "@/types/entities/message.type";
// import { db } from "@/utils/database";
// import Dexie from "dexie";

// export class MessageManager {
//   private static instance: MessageManager;

//   private constructor() {
//     if (MessageManager.instance) {
//       return MessageManager.instance;
//     }
//     MessageManager.instance = this;
//   }

//   public static getInstance(): MessageManager {
//     if (!MessageManager.instance) {
//       MessageManager.instance = new MessageManager();
//     }
//     return MessageManager.instance;
//   }

//   async setMessages(messages: Message[]) {
//     await db.messages.bulkPut(messages);
//   }

//   async getMessages(convId: string, limit: number = 20): Promise<Message[]> {
//     // Lấy `limit` tin mới nhất theo sequenceNumber, rồi reverse về oldest→newest
//     const msgs = await db.messages
//       .where("[conversationId+sequenceNumber]")
//       .between(
//         [convId, 0],
//         [convId, Dexie.maxKey],
//         true, // lowerOpen = false (include 0)
//         true, // upperOpen = false (include maxKey)
//       )
//       .reverse() // newest first để limit lấy đúng N tin mới nhất
//       .limit(limit)
//       .toArray();

//     return msgs.reverse(); // trả về oldest→newest để render đúng chiều
//   }

//   async sendMessage(message: Message) {
//     const tempId = crypto.randomUUID();
//     await db.messages.add({
//       ...message,
//       id: tempId,
//       clientTempId: tempId,
//       status: "pending",
//     });
//   }

//   async replaceMessage(newMessage: Message) {
//     await db.transaction("rw", db.messages, async () => {
//       const existing = await db.messages
//         .where("clientTempId")
//         .equals(newMessage.clientTempId || "")
//         .first();

//       if (existing) {
//         await db.messages.delete(existing.id);
//         await db.messages.put({ ...newMessage });
//       } else {
//         await db.messages.put({ ...newMessage, status: "success" });
//       }
//     });
//   }

//   async getTotalMessagesCount(convId: string): Promise<number> {
//     return await db.messages.where("conversationId").equals(convId).count();
//   }

//   async clearAll() {
//     await db.messages.clear();
//   }
// }

// export const messageManager = MessageManager.getInstance();
