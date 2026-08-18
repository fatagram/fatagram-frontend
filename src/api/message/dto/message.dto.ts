import { MediaType, MessageType } from "@/types/entities/message.type";

export interface MessageMediaDto {
  id?: string;
  url: string;
  type: MediaType;
  metadata?: any;
  messageSequence?: number;
  createdAt?: string | Date;
}

export interface MessageMediaAroundAnchorDto {
  left: MessageMediaDto[];
  right: MessageMediaDto[];
}

export interface MessageDto {
  conversationId?: string;
  receiverId?: string;
  correlationId?: string;
  clientTempId?: string;
  content: string;
  metadata?: any;
  media?: MessageMediaDto[];
  type: MessageType;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  correlationId?: string;
  clientTempId?: string;
  isGroup: boolean;
  senderId?: string;
  senderFullName?: string;
  senderNickname?: string;
  senderAvatarUrl?: string;
  sequenceNumber: number;
  content: string;
  type: MessageType;
  metadata?: any;
  media?: MessageMediaDto[];
  createdAt: Date;
  shouldIncreaseUnreadCount: boolean;
}
