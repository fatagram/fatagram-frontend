import { MessageType } from "@/types/entities/message.type";

export interface MessageDto {
  conversationId?: string;
  receiverId?: string;
  correlationId?: string;
  clientTempId?: string;
  content: string;
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
  content: string;
  type: MessageType;
  metadata?: any;
  createdAt: Date;
}
