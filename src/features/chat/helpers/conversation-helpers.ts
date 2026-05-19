import { MessageType } from "@/types/entities/message.type";

export function isSystemMessage(messageType: MessageType) {
  return [
    MessageType.System,
    MessageType.LeaveGroup,
    MessageType.JoinGroup,
    MessageType.CreateGroup,
    MessageType.DeleteGroup,
    MessageType.RenameGroup,
    MessageType.ChangeGroupAvatar,
    MessageType.RemoveParticipant,
    MessageType.AddParticipant,
    MessageType.ChangeTheme,
    MessageType.ChangeBackgroundUrl,
  ].includes(messageType);
}
