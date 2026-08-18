import { conversationService } from "@/api/conversation/conversation.api";
import { Conversation } from "@/types/entities/conversation.type";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { CONVERSATION_KEYS } from "../hooks/use-conversation";
import { Message, MessageType } from "@/types/entities/message.type";

interface ConversationState {
  conversations: Conversation[];
  totalUnreadCount: number;
  lastMessageSequenceMap: Record<string, number>;
  userSeenMap: Record<string, number>;
  setConversations: (conversations: Conversation[]) => void;
  appendConversations: (conversations: Conversation[]) => void;
  upsertConversations: (conversations: Conversation[]) => void;
  updateConversation: (id: string, conversation: Partial<Conversation>) => void;
  togglePinConversation: (id: string, isPinned: boolean) => void;
  pushConversationToTop: (id: string, updatedData?: Partial<Conversation>) => void;
  setTotalUnreadCount: (count: number) => void;
  updateTotalUnreadCount?: (action: "increment" | "decrement" | "reset") => void;
  updateLastMessageSequence: (conversationId: string, sequenceNumber: number) => void;
  updateUserSeenSequence: (conversationId: string, sequenceNumber: number) => void;
}

export const sortConversations = (conversations: Conversation[]): Conversation[] => {
  return [...conversations].sort((a, b) => {
    const aPinned = Boolean(a.isPinned || a.pinnedAt);
    const bPinned = Boolean(b.isPinned || b.pinnedAt);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    if (aPinned && bPinned && a.pinnedAt && b.pinnedAt) {
      const pinTimeA = new Date(a.pinnedAt).getTime();
      const pinTimeB = new Date(b.pinnedAt).getTime();
      if (pinTimeA !== pinTimeB) return pinTimeB - pinTimeA;
    }

    const timeA = new Date(a.lastActiveAt || a.lastMessage?.createdAt || 0).getTime();
    const timeB = new Date(b.lastActiveAt || b.lastMessage?.createdAt || 0).getTime();
    return timeB - timeA;
  });
};

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
        conversations: sortConversations(conversations),
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
        conversations: sortConversations([...state.conversations, ...newConversations]),
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
        conversations: sortConversations([...conversations, ...filteredExisting]),
        lastMessageSequenceMap: newLastMessageMap,
        userSeenMap: newSeenMap,
      };
    }),
  updateConversation: (id, conversation) =>
    set((state) => ({
      conversations: sortConversations(
        state.conversations.map((conv) =>
          conv.id === id ? { ...conv, ...conversation } : conv,
        ),
      ),
    })),
  togglePinConversation: (id, isPinned) =>
    set((state) => ({
      conversations: sortConversations(
        state.conversations.map((conv) =>
          conv.id === id
            ? { ...conv, isPinned, pinnedAt: isPinned ? new Date().toISOString() : null }
            : conv,
        ),
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
        conversations: sortConversations([targetConv, ...remaining]),
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
    // In-memory mode: no-op
  }

  public async getConversations(): Promise<Conversation[]> {
    return useConversationStore.getState().conversations;
  }

  public getConversation(id: string) {
    return useConversationStore.getState().conversations.find((conv) => conv.id === id);
  }

  public async appendConversations(convs: Conversation[], isFirstPage: boolean = false) {
    if (isFirstPage) {
      useConversationStore.getState().upsertConversations(convs);
    } else {
      useConversationStore.getState().appendConversations(convs);
    }
  }

  public async upsertConversations(convs: Conversation[]) {
    useConversationStore.getState().upsertConversations(convs);
  }

  public async updateConversation(id: string, updatedData: Partial<Conversation>) {
    useConversationStore.getState().updateConversation(id, updatedData);
  }

  public togglePin(id: string, isPinned: boolean) {
    useConversationStore.getState().togglePinConversation(id, isPinned);
  }

  public async addNewMessage(
    convId: string,
    userId: string,
    newMsg: Message,
    isFocusing: boolean = false,
  ) {
    try {
      let conv = this.getConversation(convId);
      const isMine = newMsg.senderId === userId;
      let wasUnread = false;

      if (conv) {
        wasUnread = (conv.unreadMessageCount || 0) > 0;
      }

      if (!conv) {
        const result = await conversationService.getConversation(convId);
        if (!result.success || !result.data) return;
        conv = result.data;
        wasUnread = false;
      }

      conv = { ...conv };
      conv.lastMessage = newMsg;
      conv.lastActiveAt = new Date().toISOString();

      if (newMsg.type === MessageType.ChangeGroupAvatar) {
        conv.avatarUrl = newMsg.metadata?.avatarUrl || conv.avatarUrl;
      }

      if (newMsg.type === MessageType.RenameGroup) {
        conv.name = newMsg.metadata?.newName || conv.name;
      }

      if (newMsg.type === MessageType.ChangeTheme) {
        conv.theme = newMsg.metadata?.theme || null;
      }

      if (newMsg.type === MessageType.ChangeBackgroundUrl) {
        conv.backgroundUrl = newMsg.metadata?.backgroundUrl || null;
      }

      if (isMine || isFocusing) {
        conv.myLastSeenMessageSeq = newMsg.sequenceNumber!;
        conv.unreadMessageCount = 0;
        useConversationStore.getState().updateUserSeenSequence(convId, newMsg.sequenceNumber!);
        if (wasUnread) {
          await this.updateUnreadCount("decrement");
        }
      } else {
        conv.unreadMessageCount = (conv.unreadMessageCount || 0) + 1;
        if (!wasUnread) {
          await this.updateUnreadCount("increment");
        }
      }

      useConversationStore.getState().pushConversationToTop(convId, conv);

      this.queryClient?.setQueryData(CONVERSATION_KEYS.detail(convId), conv);
    } catch (error) {
      console.error("Failed to handle new message in conversation manager:", error);
    }
  }

  public async markAsSeen(convId: string, messageSeq: number) {
    try {
      const conv = this.getConversation(convId);
      if (!conv) return;

      const wasUnread = (conv.unreadMessageCount || 0) > 0;

      const updatedConv = {
        ...conv,
        myLastSeenMessageSeq: messageSeq,
        unreadMessageCount: Math.max((conv.lastMessage?.sequenceNumber || 0) - messageSeq, 0),
      };

      const isNowRead = updatedConv.unreadMessageCount === 0;

      useConversationStore.getState().updateConversation(convId, updatedConv);
      useConversationStore.getState().updateUserSeenSequence(convId, messageSeq);

      if (wasUnread && isNowRead) {
        await this.updateUnreadCount("decrement");
      }
    } catch (error) {
      console.error("Failed to mark conversation as seen:", error);
    }
  }

  public async markAsRead(convId: string, messageSeq: number) {
    return this.markAsSeen(convId, messageSeq);
  }

  public async clearAll() {
    useConversationStore.getState().setConversations([]);
  }

  // --- UNREAD COUNT MANAGEMENT ---
  public async setUnreadCount(count: number) {
    useConversationStore.getState().setTotalUnreadCount(count);
  }

  public async updateUnreadCount(action: "increment" | "decrement" | "reset") {
    const { updateTotalUnreadCount } = useConversationStore.getState();
    if (updateTotalUnreadCount) {
      updateTotalUnreadCount(action);
    }
  }

  public async getCursor(): Promise<string | undefined> {
    const convs = useConversationStore.getState().conversations;
    const oldestConv = convs[convs.length - 1];
    return oldestConv ? oldestConv.lastActiveAt : undefined;
  }
}

export const convManager = ConversationManager.getInstance();
