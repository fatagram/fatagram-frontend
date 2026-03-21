import { FriendDto } from "./dto/friend.dto";
import { CursorResult, Result } from "../common/result";
import { FriendRequest } from "@/types/entities/friend-request.type";
import { CursorQuery } from "@/types/query";
import { apiGet, apiPost, apiDelete, buildApiPath } from "../common/api-helpers";

const PREFIX = buildApiPath("/friendship");

export class FriendshipService {
  async GetFriendshipStatus(targetId: string): Promise<Result<{ status: string }>> {
    return apiGet(`${PREFIX}/status/${targetId}`);
  }

  async SendAddFriendRequest(receiverId: string): Promise<Result<any>> {
    return apiPost(`${PREFIX}/add/${receiverId}`);
  }

  async CancelAddFriendRequest(senderId: string): Promise<Result<any>> {
    return apiDelete(`${PREFIX}/cancel/${senderId}`);
  }

  async AcceptAddFriendRequest(senderId: string): Promise<Result<any>> {
    return apiPost(`${PREFIX}/accept/${senderId}`);
  }

  async DeclineAddFriendRequest(requesterId: string): Promise<Result<any>> {
    return apiDelete(`${PREFIX}/decline/${requesterId}`);
  }

  async Unfriend(friendId: string): Promise<Result<any>> {
    return apiDelete(`${PREFIX}/unfriend/${friendId}`);
  }

  async GetNumberOfFriends(targetId: string): Promise<Result<number>> {
    return apiGet(`${PREFIX}/count/${targetId}`);
  }

  async GetFriendRequests(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<FriendRequest, string>>> {
    return await apiGet(`${PREFIX}/requests`, query);
  }

  async GetFriends(
    userId: string,
    query: CursorQuery<string> & { keyword?: string },
  ): Promise<Result<CursorResult<FriendDto, string>>> {
    return await apiGet(`${PREFIX}/friends/${userId}`, query);
  }
}

export const friendshipService = new FriendshipService();
