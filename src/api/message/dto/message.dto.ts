export interface MessageDto {
  conversationId?: string;
  receiverId?: string;
  content: string;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}
