import { conversationService } from "@/api/conversation/conversation.api";
import { Conversation } from "@/types/entities/conversation.type";
import { db } from "@/utils/database";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { CONVERSATION_KEYS } from "../hooks/use-conversation";
import { Message } from "@/types/entities/message.type";

interface ConversationState {
  conversations: Conversation[];
  totalUnreadCount: number;
  lastMessageSequenceMap: Record<string, number>;
  userSeenMap: Record<string, number>;
  setConversations: (conversations: Conversation[]) => void;
  appendConversations: (conversations: Conversation[]) => void;
  upsertConversations: (conversations: Conversation[]) => void;
  updateConversation: (id: string, conversation: Partial<Conversation>) => void;
  pushConversationToTop: (id: string, updatedData?: Partial<Conversation>) => void;
  setTotalUnreadCount: (count: number) => void;
  updateTotalUnreadCount?: (action: "increment" | "decrement" | "reset") => void;
  updateLastMessageSequence: (conversationId: string, sequenceNumber: number) => void;
  updateUserSeenSequence: (conversationId: string, sequenceNumber: number) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  totalUnreadCount: 0,
  lastMessageSequenceMap: {},
  userSeenMap: {},
  setConversations: (conversations) =>
    set(() => {
      const newLastMessageMap: Record<string, number> = {};
      const newUserSeenMap: Record<string, number> = {};

      conversations.forEach((conv) => {
        if (conv.lastMessage && conv.lastMessage.sequenceNumber) {
          newLastMessageMap[conv.id] = conv.lastMessage.sequenceNumber;
        }
        if (conv.myLastSeenMessageSeq) {
          newUserSeenMap[conv.id] = conv.myLastSeenMessageSeq;
        }
      });
      return {
        conversations,
        lastMessageSequenceMap: newLastMessageMap,
        userSeenMap: newUserSeenMap,
      };
    }),
  appendConversations: (conversations) =>
    set((state) => {
      const existingIds = new Set(state.conversations.map((conv) => conv.id));
      const newConversations = conversations.filter((conv) => !existingIds.has(conv.id));
      const appendLastMessageMap = { ...state.lastMessageSequenceMap };
      const appendUserSeenMap = { ...state.userSeenMap };
      newConversations.forEach((conv) => {
        if (conv.lastMessage && conv.lastMessage.sequenceNumber) {
          appendLastMessageMap[conv.id] = conv.lastMessage.sequenceNumber;
        }
        if (conv.myLastSeenMessageSeq) {
          appendUserSeenMap[conv.id] = conv.myLastSeenMessageSeq;
        }
      });
      return {
        conversations: [...state.conversations, ...newConversations],
        lastMessageSequenceMap: appendLastMessageMap,
        userSeenMap: appendUserSeenMap,
      };
    }),
  upsertConversations: (conversations) =>
    set((state) => {
      const newConvSet = new Set(conversations.map((conv) => conv.id));
      const filteredExisting = state.conversations.filter((conv) => !newConvSet.has(conv.id));

      const newLastMessageMap = { ...state.lastMessageSequenceMap };
      const newSeenMap = { ...state.userSeenMap };

      conversations.forEach((conv) => {
        if (conv.lastMessage && conv.lastMessage.sequenceNumber) {
          newLastMessageMap[conv.id] = conv.lastMessage.sequenceNumber;
        }
        if (conv.myLastSeenMessageSeq) {
          newSeenMap[conv.id] = conv.myLastSeenMessageSeq;
        }
      });

      return {
        conversations: [...conversations, ...filteredExisting],
        lastMessageSequenceMap: newLastMessageMap,
        userSeenMap: newSeenMap,
      };
    }),
  updateConversation: (id, conversation) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...conversation } : conv,
      ),
    })),
  updateLastMessageSequence: (conversationId, sequenceNumber) =>
    set((state) => ({
      lastMessageSequenceMap: {
        ...state.lastMessageSequenceMap,
        [conversationId]: sequenceNumber,
      },
    })),
  pushConversationToTop: (id, updatedData) =>
    set((state) => {
      const index = state.conversations.findIndex((conv) => conv.id === id);

      let targetConv: Conversation;

      if (index === -1) {
        targetConv = updatedData as Conversation;
      } else {
        targetConv = { ...state.conversations[index], ...updatedData };
      }

      const remaining = state.conversations.filter((c) => c.id !== id);

      const newLastMessageSequenceMap = { ...state.lastMessageSequenceMap };
      if (targetConv.lastMessage && targetConv.lastMessage.sequenceNumber) {
        newLastMessageSequenceMap[targetConv.id] = targetConv.lastMessage.sequenceNumber;
      }

      return {
        conversations: [targetConv, ...remaining],
        lastMessageSequenceMap: newLastMessageSequenceMap,
      };
    }),
  setTotalUnreadCount: (count) =>
    set(() => {
      if (count < 0) count = 0;
      return { totalUnreadCount: count };
    }),
  updateTotalUnreadCount: (action) =>
    set((state) => {
      let newCount = state.totalUnreadCount;
      if (action === "increment") newCount += 1;
      else if (action === "decrement") newCount -= 1;
      else if (action === "reset") newCount = 0;

      if (newCount < 0) newCount = 0;

      return { totalUnreadCount: newCount };
    }),
  updateUserSeenSequence: (conversationId, sequenceNumber) =>
    set((state) => ({
      userSeenMap: {
        ...state.userSeenMap,
        [conversationId]: sequenceNumber,
      },
    })),
}));

export class ConversationManager {
  private static instance: ConversationManager;
  private queryClient: QueryClient | null = null;

  public setQueryClient(client: QueryClient) {
    this.queryClient = client;
  }

  private constructor() {
    if (ConversationManager.instance) {
      return ConversationManager.instance;
    }
    ConversationManager.instance = this;
  }

  public static getInstance() {
    if (!ConversationManager.instance) {
      ConversationManager.instance = new ConversationManager();
    }
    return ConversationManager.instance;
  }

  public async hydrate() {
    try {
      const list = await db.conversations.orderBy("lastActiveAt").reverse().toArray();
      useConversationStore.getState().setConversations(list);

      const meta = await db.table("metadata").get("totalUnreadCount");
      if (meta) {
        useConversationStore.getState().setTotalUnreadCount(meta.value);
      }
    } catch (error) {
      console.error("Failed to hydrate conversations:", error);
    }
  }

  public async getConversations(): Promise<Conversation[]> {
    try {
      const convs = useConversationStore.getState().conversations;
      console.log("Getting conversations from manager, current count:", convs.length);
      if (convs.length === 0) {
        await this.hydrate();
        console.log(
          "After hydration, conversations count:",
          useConversationStore.getState().conversations.length,
        );
      }
      return useConversationStore.getState().conversations;
    } catch (error) {
      console.error("Failed to get conversations from DB:", error);
      return [];
    }
  }

  public async appendConversations(convs: Conversation[], isFirstPage: boolean) {
    try {
      await db.conversations.bulkPut(convs);

      if (isFirstPage) {
        await this.hydrate();
      } else {
        useConversationStore.getState().appendConversations(convs);
      }
    } catch (error) {
      console.error("Sync API data failed:", error);
    }
  }

  public async upsertConversations(convs: Conversation[]) {
    try {
      useConversationStore.getState().upsertConversations(convs);
      await db.conversations.bulkPut(convs);
    } catch (error) {
      console.error("Upsert conversations failed:", error);
    }
  }

  public async updateConversation(id: string, updatedData: Partial<Conversation>) {
    try {
      console.log("Updating conversation in manager:", id, updatedData);
      useConversationStore.getState().updateConversation(id, updatedData);
      const conv = await db.conversations.get(id);
      if (!conv) return;

      const updatedConv = { ...conv, ...updatedData };
      await db.conversations.put(updatedConv);
    } catch (error) {
      console.error("Update conversation failed:", error);
    }
  }

  // Receive a new message, update the conversation's last message and unread count
  public async addNewMessage(
    convId: string,
    userId: string,
    newMsg: Message,
    shouldUpdateUnreadCount: boolean = true,
  ) {
    try {
      let conv = await db.conversations.get(convId);
      const isMine = newMsg.senderId === userId;

      if (!conv) {
        const result = await conversationService.getConversation(convId);
        if (!result.success || !result.data) return;
        conv = result.data;
      }

      conv.lastMessage = newMsg;
      conv.lastActiveAt = new Date().toISOString();

      if (isMine) {
        this.markAsSeen(convId, newMsg.sequenceNumber!);
      } else {
        conv.unreadMessageCount = (conv.unreadMessageCount || 0) + 1;
      }

      if (!isMine && shouldUpdateUnreadCount) {
        await this.updateUnreadCount("increment");
      }

      await db.conversations.put(conv);
      useConversationStore.getState().pushConversationToTop(convId, conv);

      this.queryClient?.setQueryData(CONVERSATION_KEYS.detail(convId), conv);
    } catch (error) {
      console.error("Failed to handle new message in conversation manager:", error);
    }
  }

  public async markAsSeen(convId: string, messageSeq: number) {
    try {
      const conv = await db.conversations.get(convId);
      if (!conv) return;

      conv.myLastSeenMessageSeq = messageSeq;
      conv.unreadMessageCount = (conv.lastMessage?.sequenceNumber || 0) - messageSeq || 0;
      await db.conversations.put(conv);

      useConversationStore.getState().updateUserSeenSequence(convId, messageSeq);
    } catch (error) {
      console.error("Failed to mark conversation as seen:", error);
    }
  }

  public async clearAll() {
    await db.conversations.clear();
    useConversationStore.getState().setConversations([]);
  }

  // --- UNREAD COUNT MANAGEMENT ---
  public async setUnreadCount(count: number) {
    await db.table("metadata").put({ key: "totalUnreadCount", value: count });
    useConversationStore.getState().setTotalUnreadCount(count);
  }

  public async updateUnreadCount(action: "increment" | "decrement" | "reset") {
    const { updateTotalUnreadCount } = useConversationStore.getState();
    if (updateTotalUnreadCount) {
      updateTotalUnreadCount(action);
      const newCount = useConversationStore.getState().totalUnreadCount;
      await db.table("metadata").put({ key: "totalUnreadCount", value: newCount });
    }
  }

  public async getCursor(): Promise<string | undefined> {
    const oldestConv = await db.conversations.orderBy("lastActiveAt").first();
    return oldestConv ? oldestConv.lastActiveAt : undefined;
  }
}

export const convManager = ConversationManager.getInstance();
