import Dexie, { type Table } from "dexie";
import { Conversation } from "@/types/entities/conversation.type";
import { Message } from "@/types/entities/message.type";

export class Database extends Dexie {
  conversations!: Table<Conversation>;
  messages!: Table<Message>;

  constructor() {
    super("FaweDB");

    this.version(2).stores({
      conversations: "id, lastActiveAt",
      messages: "id, [conversationId+sequenceNumber], conversationId, sequenceNumber",
      metadata: "key",
    });
  }
}

export const db = new Database();
