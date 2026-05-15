import { CursorResult, Result } from "@/api/common/result";
import { buildApiPath, apiGet } from "../common/api-helpers";
import { CursorQuery } from "@/types/query";
import { User } from "@/types/entities/user.type";
import { SearchUserDto } from "./dto/search-user.dto";

const PREFIX = buildApiPath("/user");

export class UserService {
  async getUsers(query: CursorQuery<string>): Promise<Result<CursorResult<User, string>>> {
    return await apiGet(`${PREFIX}`, query);
  }

  async searchUsers(
    query: CursorQuery<string> & { keyword?: string },
  ): Promise<Result<CursorResult<SearchUserDto, string>>> {
    return await apiGet(`${PREFIX}/search`, query);
  }
}

export const userService = new UserService();
