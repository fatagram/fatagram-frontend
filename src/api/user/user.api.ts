import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { User } from "@/types/entities/user.type";

const PREFIX = buildApiPath("/user");

export class UserService {
  async getUsers(query: CursorQuery<string>): Promise<Result<CursorResult<User, string>>> {
    return await apiGet(`${PREFIX}`, query);
  }
}

export const userService = new UserService();
