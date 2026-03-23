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
  senderId: string;
  content: string;
  createdAt: Date;
}

export interface Message extends MessageResponseDto {
  status?: "success" | "pending" | "failed";
}
