
export interface FriendDto {
    id: string;
    avatar: string | null;
    name: string;
    urlName: string | null;
}

export interface FriendsDto {
    friends: FriendDto[];
    total: number;
}