import { FriendsDto } from "./dto/friend.dto";
import { CursorResult, Result } from "../common/result";
import { apiClient } from "../common/axios-interceptor";
import { ApiResponse, CursorResponse } from "../common/api-response";
import { handleApiError } from "../common/handle-api-error";
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
    console.log("GetNumberOfFriends called with targetId:", targetId);
    const res = await apiGet<number>(`${PREFIX}/count/${targetId}`);
    if (res.success) {
      return { success: true, data: (res.data ?? 0) as number };
    }
    return res;
  }

  async GetFriendRequests(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<FriendRequest, string>>> {
    try {
      const res = await apiClient.get(`${PREFIX}/requests`, {
        params: query,
      });
      // Delay for testing
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const resp = res.data as CursorResponse<string, FriendRequest>;
      return {
        success: true,
        data: {
          data: resp.data ?? [],
          nextCursor: resp.nextCursor,
          hasNext: resp.hasNext,
        },
      };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async GetFriends(
    userId: string,
    page: number,
    pageSize: number,
    keyword?: string,
  ): Promise<Result<FriendsDto>> {
    try {
      const params = new URLSearchParams();

      if (keyword) params.append("keyword", keyword);
      params.append("page", page.toString());
      params.append("pageSize", pageSize.toString());

      const res = await apiClient.get(`${PREFIX}/friends/${userId}`, {
        params,
      });

      const response = res.data as ApiResponse<FriendsDto>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }
}

export const friendshipService = new FriendshipService();
