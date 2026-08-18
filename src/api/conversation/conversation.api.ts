import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet, apiPost, apiPatchFormData, apiPatch } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { ConversationDto, ParticipantsSeenDto } from "./dto/conversation.dto";
import { ParticipantDto } from "./dto/participant.dto";
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

  public async getParticipants(
    conversationId: string,
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<ParticipantDto, string>>> {
    return await apiGet(`${PREFIX}/${conversationId}/participants`, query);
  }

  public async searchConversations(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<ConversationDto, string>>> {
    const res = await apiGet(`${PREFIX}/search`, query);
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

  public async updateConversationAvatar(conversationId: string, file: File): Promise<Result<void>> {
    const formData = new FormData();
    formData.append("file", file);
    return await apiPatchFormData(`${PREFIX}/${conversationId}/avatar`, formData);
  }

  public async updateConversationName(conversationId: string, name: string): Promise<Result<void>> {
    return await apiPatch(`${PREFIX}/${conversationId}/name`, { name });
  }

  public async updateConversationTheme(
    conversationId: string,
    theme: string | null,
  ): Promise<Result<void>> {
    return await apiPatch(`${PREFIX}/${conversationId}/theme`, { theme });
  }

  public async updateConversationBackground(
    conversationId: string,
    backgroundUrl: string | null,
  ): Promise<Result<void>> {
    return await apiPatch(`${PREFIX}/${conversationId}/background`, { backgroundUrl });
  }

  public async togglePin(conversationId: string): Promise<Result<boolean>> {
    return await apiPost(`${PREFIX}/${conversationId}/toggle-pin`);
  }
}

export const conversationService = new ConversationService();
