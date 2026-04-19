import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet, apiPost } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { ConversationDto, ParticipantsSeenDto } from "./dto/conversation.dto";
import {
  MessageMediaAroundAnchorDto,
  MessageMediaDto,
  MessageResponseDto,
} from "../message/dto/message.dto";

const PREFIX = buildApiPath("/conversation");

export class ConversationService {
  public async getConversations(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<ConversationDto, string>>> {
    const res = await apiGet(`${PREFIX}`, query);
    return res;
  }

  public async getDeltaConversations(since: Date): Promise<Result<ConversationDto[]>> {
    return await apiGet(`${PREFIX}/delta`, { since });
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

  public async getDeltaMessages(
    conversationId: string,
    sinceSequenceNumber: number,
  ): Promise<Result<MessageResponseDto[]>> {
    return await apiGet(`${PREFIX}/${conversationId}/messages/delta`, { sinceSequenceNumber });
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

  public async getMediaAround(
    conversationId: string,
    mediaId: string,
    config: {
      limit?: number;
      before?: boolean;
    },
  ): Promise<Result<MessageMediaDto[]>> {
    const { limit = 20, before = true } = config;
    return await apiGet(`${PREFIX}/${conversationId}/media/around/${mediaId}`, {
      limit,
      before,
    });
  }

  public async getMediaAroundAnchor(
    conversationId: string,
    mediaId: string,
    count: number = 10,
  ): Promise<Result<MessageMediaAroundAnchorDto>> {
    return await apiGet(`${PREFIX}/${conversationId}/media/around-anchor/${mediaId}`, { count });
  }
}

export const conversationService = new ConversationService();
