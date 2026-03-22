import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { ConversationDto } from "./dto/conversation.dto";

const PREFIX = buildApiPath("/conversation");

export class ConversationService {
  public async getConversations(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<ConversationDto, string>>> {
    const res = await apiGet(`${PREFIX}`, query);
    console.log("Fetched conversations data:", res);
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
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<any, string>>> {
    return await apiGet(`${PREFIX}/${conversationId}/messages`, query);
  }
}

export const conversationService = new ConversationService();
