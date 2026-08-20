import { Message } from "./message.type";

export interface Conversation {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  lastMessage?: Message;
  lastMessageNumber?: number;
  unreadMessageCount: number;
  lastActiveAt: string;
  isGroup: boolean;
  topParticipantNames?: string[];
  participantCount?: number;
  otherLastSeenMessageSeq?: number;
  myLastSeenMessageSeq?: number;
  otherUserId?: string | null;
  theme?: string | null;
  backgroundUrl?: string | null;
  isPinned?: boolean;
  pinnedAt?: string | null;
}
