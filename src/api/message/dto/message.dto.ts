export interface MessageDto {
  conversationId?: string;
  receiverId?: string;
  correlationId?: string;
  content: string;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  correlationId?: string;
  isGroup: boolean;
  senderId: string;
  content: string;
  createdAt: Date;
}
