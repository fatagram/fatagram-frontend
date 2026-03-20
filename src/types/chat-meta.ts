export type ChatMeta =
  | { type: "conversation"; conversationId: string }
  | { type: "temp"; targetId: string };
