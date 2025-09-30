export interface FriendDto {
  id: string;
  avatar: string | null;
  name: string;
  urlName: string | null;
  isFriend: boolean;
}

export interface FriendsDto {
  friends: FriendDto[];
  total: number;
}
