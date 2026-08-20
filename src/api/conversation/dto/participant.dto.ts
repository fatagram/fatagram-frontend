export enum ConversationRole {
  Owner = "Owner",
  Admin = "Admin",
  Member = "Member",
}

export interface ParticipantDto {
  userId: string;
  fullname: string;
  nickname?: string;
  avatarUrl?: string;
  role?: ConversationRole | number | string;
  createdAt: string;
}
