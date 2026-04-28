export enum MessageType {
  Text = "Text",
  Media = "Media",
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

export enum MessageRenderType {
  Text = "Text",
  Image = "Image",
  Video = "Video",
  Audio = "Audio",
  File = "File",
  System = "System",
  StackImage = "StackImage",
  Gif = "Gif",
}

export enum MediaType {
  Image = "Image",
  Video = "Video",
  File = "File",
  Audio = "Audio",
  Gif = "Gif",
  Sticker = "Sticker",
}

export interface MessageMedia {
  id?: string;
  url: string;
  type: MediaType;
  metadata?: any;
}

export interface MessageMediaAroundAnchor {
  left: MessageMedia[];
  right: MessageMedia[];
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
  media?: MessageMedia[];
  createdAt: Date;
  status?: "success" | "pending" | "failed";
}
