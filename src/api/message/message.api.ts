import { Result } from "@/api/common/result";
import { buildApiPath, apiPost } from "../common/api-helpers";
import { MessageDto, MessageResponseDto } from "./dto/message.dto";

const PREFIX = buildApiPath("/message");

export class MessageService {
  public async sendMessage(request: MessageDto): Promise<Result<MessageResponseDto>> {
    return await apiPost(`${PREFIX}`, request);
  }
}

export const messageService = new MessageService();
