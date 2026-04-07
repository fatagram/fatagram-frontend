import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet, apiPost } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { ConversationDto, ParticipantsSeenDto } from "./dto/conversation.dto";
import { MessageResponseDto } from "../message/dto/message.dto";

const PREFIX = buildApiPath("/conversation");

export class ConversationService {
  public async getConversations(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<ConversationDto, string>>> {
    const res = await apiGet(`${PREFIX}`, query);
    return res;
  }

  public async getConversation(conversationId: string): Promise<Result<ConversationDto>> {
    return await apiGet(`${PREFIX}/${conversationId}`);
  }

  public async getConversationWith(targetUserId: string): Promise<Result<ConversationDto>> {
    return await apiGet(`${PREFIX}/with/${targetUserId}`);
  }

  public async getMessages(
    conversationId: string,
    query: CursorQuery<number>,
  ): Promise<Result<CursorResult<MessageResponseDto, number>>> {
    return await apiGet(`${PREFIX}/${conversationId}/messages`, query);
  }

  public async createGroupConversation(
    participantIds: string[],
    name?: string | null,
  ): Promise<Result<string>> {
    return await apiPost(`${PREFIX}`, { participantIds, name });
  }

  public async markAsSeen(conversationId: string, messageSeq: number): Promise<Result<void>> {
    return await apiPost(`${PREFIX}/${conversationId}/messages/markSeen/${messageSeq}`);
  }

  public async getParticipantsSeen(conversationId: string): Promise<Result<ParticipantsSeenDto>> {
    return await apiGet(`${PREFIX}/${conversationId}/participants/seen`);
  }

  public async getUnreadCount(): Promise<Result<number>> {
    return await apiGet(`${PREFIX}/unread-count`);
  }
}

export const conversationService = new ConversationService();
