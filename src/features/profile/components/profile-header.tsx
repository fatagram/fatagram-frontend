import React, { useCallback } from "react";
import ProfileBackground from "./profile-background";
import ProfileAvatar from "./profile-avatar";
import AddFriendButton from "./friend-button";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import useLanguage from "@/utils/i18n";
import { Button, Text, Skeleton } from "@/components/atoms";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useGetNumberOfFriends } from "@/features/hooks/use-friend";
import { useAuth } from "@/contexts";
import { useGetConversationWith } from "@/features/hooks/use-conversation";
import { useChatStore } from "@/features/hooks/use-chat-store";

export type ProfileHeaderProps = {
  className?: string;
  onUserNotFound?: () => void;
};

/**
 * ProfileHeader component displays the user's profile header with avatar, background image, and action buttons.
 * It allows the user to change their avatar and background image if they are the owner of the profile.
 * @param {string} className - Additional CSS classes for styling.
 * @param {string} userId - The ID of the user whose profile is being displayed.
 * @param {boolean} isOwner - Indicates if the current authenticated user is the owner of the profile.
 * @param {function} onUserNotFound - Callback function to handle when a user is not found.
 */
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className }) => {
  // Auth info hook
  const t = useLanguage();
  const navigate = useNavigate();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();

  const { data, isLoading, isFetching } = useGetUserProfile(targetId);
  const userProfile = data?.infos;
  const { openChat, replaceChat } = useChatStore();

  const { data: numberOfFriends, isFetching: numberOfFriendsFetching } =
    useGetNumberOfFriends(targetId);

  const handleConversationSuccess = useCallback(
    (data: any) => {
      replaceChat(targetId, data.id);
    },
    [targetId, replaceChat],
  );

  const { data: conversationData, refetch: refetchConversation } = useGetConversationWith(
    targetId,
    {
      onSuccess: handleConversationSuccess,
    },
  );

  const handleMessageClick = async () => {
    if (!targetId) return;
    if (!conversationData) {
      openChat(targetId, { type: "temp", targetId: targetId });
      await refetchConversation();
    }
  };

  return (
    <div className={clsx("relative w-full flex flex-col items-center", className)}>
      <div className="relative w-full mt-2">
        <ProfileBackground />
      </div>

      <div className="-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3">
        <ProfileAvatar />
        <div className="flex flex-col gap-2 items-start flex-1 lg:mb-3 lg:ml-4">
          {isLoading || isFetching ? (
            <Skeleton sz="sm-3" className="w-56" />
          ) : (
            <Text sz="xl-1" weight="bold" className="text-center break-words w-full lg:w-auto">
              {userProfile?.fullName}
              {userProfile?.nickname && (
                <Text sz="lg-3" weight="light" className="lg:text-left text-center lg:ml-2">
                  ({userProfile?.nickname})
                </Text>
              )}
            </Text>
          )}

          <div className="flex flex-col items-center w-full lg:flex-row">
            {!numberOfFriendsFetching ? (
              <Text sz="md-2" weight="semibold" className="text-[var(--text-color)] opacity-70">
                {numberOfFriends && numberOfFriends > 0
                  ? numberOfFriends + " " + t("user:profileHeader.friendsCount")
                  : t("user:profileHeader.noFriendsCount")}
              </Text>
            ) : (
              <Skeleton sz="sm-3" className="w-36" />
            )}
            {!isLoading || isFetching ? (
              <div className="flex flex-wrap flex-row gap-2 mt-2 lg:ml-auto lg:mt-0">
                {isAuthenticated && (
                  <>
                    {isOwner ? (
                      <Button
                        sz="sm-1"
                        onClick={() => {
                          navigate(`/settings`);
                        }}
                      >
                        <i className="fa-solid fa-user-pen"></i>{" "}
                        {t("user:profileHeader.editButton")}
                      </Button>
                    ) : (
                      <AddFriendButton sz="sm-1" uid={targetId} />
                    )}
                  </>
                )}

                {!isOwner && isAuthenticated && (
                  <Button sz="sm-1" variant="secondary" onClick={handleMessageClick}>
                    <i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}
                  </Button>
                )}
                <Button sz="sm-1" variant="secondary">
                  <i className="fa-solid fa-circle-info"></i>
                </Button>
              </div>
            ) : (
              <Skeleton sz="md-1" className="w-[250px] lg:ml-auto mb-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
