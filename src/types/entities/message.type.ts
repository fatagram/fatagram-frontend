export enum MessageType {
  Text = "Text",
  Image = "Image",
  File = "File",
  System = "System",
  LeaveGroup = "LeaveGroup",
  JoinGroup = "JoinGroup",
  CreateGroup = "CreateGroup",
  DeleteGroup = "DeleteGroup",
  RenameGroup = "RenameGroup",
  ChangeGroupAvatar = "ChangeGroupAvatar",
  RemoveParticipant = "RemoveParticipant",
  AddParticipant = "AddParticipant",
}

export interface Message {
  id: string;
  conversationId: string;
  correlationId?: string;
  clientTempId?: string;
  isGroup: boolean;
  senderId?: string;
  senderFullName?: string;
  senderAvatarUrl?: string;
  senderNickname?: string;
  sequenceNumber?: number;
  content: string;
  type: MessageType;
  metadata?: any;
  createdAt: Date;
  status?: "success" | "pending" | "failed";
}
