import { TimeUnit } from "@/types/time-unit";
import { FriendsDto } from "./dto/friend.dto";
import { CursorResult, Result } from "../common/result";
import { apiClient } from "../common/axiosInterceptor";
import { ApiResponse, CursorResponse } from "../common/apiResponse";
import { handleApiError } from "../common/handleApiError";
import { FriendRequest } from "@/types/entities/friend-request.type";
import { CursorQuery } from "@/types/query";

const PREFIX = `/api/friendship`;

export class FriendshipService {
  async GetFriendshipStatus(targetId: string): Promise<Result<{ status: string }>> {
    try {
      const res = await apiClient.get(`${PREFIX}/status/${targetId}`);
      const response = res.data as ApiResponse<{ status: string }>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async SendAddFriendRequest(receiverId: string): Promise<Result<any>> {
    try {
      const res = await apiClient.post(`${PREFIX}/add/${receiverId}`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async CancelAddFriendRequest(senderId: string): Promise<Result<any>> {
    try {
      const res = await apiClient.delete(`${PREFIX}/cancel/${senderId}`);
      const response = res.data as ApiResponse<any>;

      // console.log(response);
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async AcceptAddFriendRequest(senderId: string): Promise<Result<any>> {
    try {
      const res = await apiClient.post(`${PREFIX}/accept/${senderId}`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async DeclineAddFriendRequest(requesterId: string): Promise<Result<any>> {
    try {
      const res = await apiClient.delete(`${PREFIX}/decline/${requesterId}`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async Unfriend(friendId: string): Promise<Result<any>> {
    try {
      const res = await apiClient.delete(`${PREFIX}/unfriend/${friendId}`);
      const response = res.data as ApiResponse<any>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async GetNumberOfFriends(targetId: string): Promise<Result<number>> {
    try {
      console.log("GetNumberOfFriends called with targetId:", targetId);
      const res = await apiClient.get(`${PREFIX}/count/${targetId}`);
      const response = res.data as ApiResponse<number>;
      return { success: true, data: response.data };
    } catch (error: any) {
      return handleApiError(error);
    }
  }

  async GetFriendRequests(
    query: CursorQuery<string>,
  ): Promise<Result<CursorResult<FriendRequest, string>>> {
    try {
      const res = await apiClient.get(`${PREFIX}/requests`, {
        params: query,
      });
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
