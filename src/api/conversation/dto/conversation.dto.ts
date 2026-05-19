import { MessageResponseDto } from "@/api/message/dto/message.dto";

export interface ConversationDto {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  lastMessage?: MessageResponseDto;
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
}

export interface UpdateConversationDto {
  name?: string | null;
  avatarUrl?: string | null;
}

export interface SeenDto {
  conversationId: string;
  messageSeq: number;
  userId: string;
  seenAt: string;
  shouldDecreaseUnreadCount: boolean;
}

export interface ParticipantsSeenDto {
  conversationId: string;
  participantsSeenInfo: {
    [userId: string]: {
      sequenceNumber: number;
      seenAt: string;
    };
  };
}

export interface TypingDto {
  userId: string;
  conversationId: string;
}
