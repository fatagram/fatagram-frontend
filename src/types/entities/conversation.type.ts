import { Message } from "./message.type";

export interface Conversation {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  lastMessage?: Message;
  unreadMessageCount: number;
  lastActiveAt: string;
  isGroup: boolean;
  topParticipantNames?: string[];
  participantCount?: number;
  otherLastSeenMessageSeq?: number;
  myLastSeenMessageSeq?: number;
}
