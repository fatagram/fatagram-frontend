import { MessageResponseDto } from "@/api/message/dto/message.dto";

export interface ConversationDto {
  id: string;
  name?: string | null;
  avatarUrl?: string | null;
  lastMessage?: MessageResponseDto;
  unreadMessageCount: number;
  lastActiveAt: string;
  isGroup: boolean;
  topParticipantNames?: string[];
  participantCount?: number;
  otherLastSeenMessageId?: string;
  myLastSeenMessageId?: string;
}

export interface SeenDto {
  conversationId: string;
  messageId: string;
  userId: string;
  seenAt: string;
}

export interface ParticipantsSeenDto {
  conversationId: string;
  participantsSeenInfo: {
    [userId: string]: {
      messageId: string;
      seenAt: string;
    };
  };
}
