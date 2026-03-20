export interface MessageDto {
  conversationId?: string;
  receiverId?: string;
  content: string;
}

export interface MessageResponseDto {
  id: string;
  conversationId: string;
  isGroup: boolean;
  senderId: string;
  content: string;
  createdAt: Date;
}
