import { handleApiError, Result } from './../common';
import apiUrl from "@/config";
import { apiClient } from "../setupInterceptor";
import { ApiResponse } from "../common";
import { TimeUnit } from '@/utils/time_unit';
import { FriendsDto } from './dto/friend.dto';

const API_URL = `${apiUrl}/api/friendship`;

export class FriendshipService {
    async GetFriendshipStatus(targetId: string): Promise<Result<{status: string}>> {
        try {
            const res = await apiClient.get(`${API_URL}/status/${targetId}`);
            const response = res.data as ApiResponse<{status: string}>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    } 

    async SendAddFriendRequest(receiverId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.post(`${API_URL}/add/${receiverId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async CancelAddFriendRequest(senderId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`${API_URL}/cancel/${senderId}`);
            const response = res.data as ApiResponse<any>;

            // console.log(response);
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async AcceptAddFriendRequest(senderId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.post(`${API_URL}/accept/${senderId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async DeclineAddFriendRequest(requesterId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`${API_URL}/decline/${requesterId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async Unfriend(friendId: string): Promise<Result<any>> {
        try {
            const res = await apiClient.delete(`${API_URL}/unfriend/${friendId}`);
            const response = res.data as ApiResponse<any>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async GetNumberOfFriends(targetId: string): Promise<Result<{numberOfFriends: number}>> {
        try {
            const res = await apiClient.get(`${API_URL}/count/${targetId}`);
            const response = res.data as ApiResponse<{numberOfFriends: number}>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }

    async GetFriendRequests(page: number, pageSize: number)
        : Promise<Result<{friendRequests: {
            senderId: string,
            senderUrlName: string,
            senderAvatar: string,
            senderName: string,
            createdAt: {
                value: number,
                unit: TimeUnit
            },
        }[], total: number}>> {
        try {
            const res = await apiClient.get(`${API_URL}/requests`, {
                params: {
                    page,
                    pageSize
                }
            });
            const response = res.data as ApiResponse<{friendRequests: {
                senderId: string,
                senderUrlName: string,
                senderAvatar: string,
                senderName: string,
                createdAt: {
                    value: number,
                    unit: TimeUnit
                }
            }[], total: number}>;
            return { success: true, data: response.data };
        }
        catch (error: any)
        {
            return handleApiError(error);
        }
    }


    async GetFriends(userId: string, page: number, pageSize: number, keyword?: string): Promise<Result<FriendsDto>> {
        try {
            const params = new URLSearchParams();

            if (keyword) params.append("keyword", keyword);
            params.append("page", page.toString());
            params.append("pageSize", pageSize.toString());

            const res = await apiClient.get(`${API_URL}/friends/${userId}`, {
                params
            });

            const response = res.data as ApiResponse<FriendsDto>;
            return { success: true, data: response.data };
        } catch (error: any) {
            return handleApiError(error);
        }
    }
}

export const friendshipService = new FriendshipService();