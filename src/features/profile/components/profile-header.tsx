import React, { useCallback, useEffect, useRef } from "react";
import { userProfileService } from "@/api/user/user-profile.api";
import { friendshipService } from "@/api/user/friendship.api";
import ProfileBackground from "./profile-background";
import ProfileAvatar from "./profile-avatar";
import AddFriendButton from "./friend-button";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useDialog } from "@/hooks/contexts/use-dialog";
import { useProfilePage } from "../hooks/use-profile-page";
import useLanguage from "@/utils/i18n";
import { Button, Text, Skeleton } from "@/components/atoms";

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
const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className, onUserNotFound }) => {
  // States
  const [fullName, setFullName] = React.useState<string>("");
  const [nickname, setNickname] = React.useState<string | null>(null);
  const [avatar, setAvatar] = React.useState<string>("");
  const [background] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoadingNumOfFriends, setIsLoadingNumOfFriends] = React.useState<boolean>(true);
  const [numberOfFriends, setNumberOfFriends] = React.useState<number>(0);

  const avtRef = useRef<HTMLDivElement>(null);

  // Auth info hook
  const t = useLanguage();
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const response = await userProfileService.getProfile(
        targetId,
        "avatar,background,fullName,nickname",
      );

      // Delay to simulate loading
      if (response.success) {
        // setAvatar(getImageUrl(response.data.infos.avatar) || "");
        // setBackground(getImageUrl(response.data.infos.background) || "");
        setFullName(response.data.infos.fullName);
        setNickname(response.data.infos.nickname);
      } else {
        onUserNotFound?.();
      }
      setIsLoading(false);
    };
    const fetchNumberOfFriends = async () => {
      setIsLoadingNumOfFriends(true);
      const response = await friendshipService.GetNumberOfFriends(targetId);
      if (response.success) {
        setNumberOfFriends(response.data?.numberOfFriends ?? 0);
      } else {
        // console.log(response.errorCodes);
      }
      setIsLoadingNumOfFriends(false);
    };
    if (targetId) {
      fetchProfile();
      fetchNumberOfFriends();
    }
  }, [targetId, onUserNotFound, friendshipService]);

  // Handle background and avatar selection
  const handleSelectBackground = useCallback(
    async (file: File) => {
      const result = await userProfileService.UploadBackground(file);
      // console.log(result);
      if (result.success) {
        // setBackground(getImageUrl(result.data) || "");
      } else if (result.error?.code === "LARGE_FILE_ERROR") {
        openDialog({
          title: t("user:profileHeader.oversizeErrorTitle"),
          content: t("user:profileHeader.oversizeErrorMessage"),
          primaryButton: {
            text: t("user:profileHeader.oversizeErrorButton"),
            onClick: closeDialog,
          },
        });
      }
    },
    [openDialog, closeDialog, t],
  );

  const handleSelectAvatar = useCallback(
    async (file: File) => {
      const result = await userProfileService.UploadAvatar(file);
      if (result.success) {
        setAvatar(result.data);
      } else if (result.error?.code === "LARGE_FILE_ERROR") {
        openDialog({
          title: t("user:profileHeader.oversizeErrorTitle"),
          content: t("user:profileHeader.oversizeErrorMessage"),
          primaryButton: {
            text: t("user:profileHeader.oversizeErrorButton"),
            onClick: closeDialog,
          },
        });
      }
    },
    [openDialog, closeDialog, t],
  );

  return (
    <div className={clsx("relative w-full flex flex-col items-center", className)}>
      <div className="relative w-full mt-2">
        <ProfileBackground
          isLoading={isLoading}
          background={background}
          handleSelectBackground={handleSelectBackground}
        />
      </div>

      <div className="-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3">
        <ProfileAvatar
          isLoading={isLoading}
          avatar={avatar}
          handleSelectAvatar={handleSelectAvatar}
          ref={avtRef}
        />
        <div className="flex flex-col gap-2 items-start flex-1 mb-3 ml-4">
          {isLoading ? (
            <Skeleton sz="sm-3" className="w-56" />
          ) : (
            <Text sz="xl-1" weight="bold" className="lg:text-left text-center break-words">
              {fullName}
              {nickname && (
                <Text sz="lg-3" weight="light" className="lg:text-left text-center lg:ml-2">
                  ({nickname})
                </Text>
              )}
            </Text>
          )}

          <div className="flex flex-col items-center w-full lg:flex-row">
            {!isLoadingNumOfFriends ? (
              <Text sz="md-2" weight="semibold" className="text-[var(--text-color)] opacity-70">
                {numberOfFriends > 0
                  ? numberOfFriends + " " + t("user:profileHeader.friendsCount")
                  : t("user:profileHeader.noFriendsCount")}
              </Text>
            ) : (
              <Skeleton sz="sm-3" className="w-36" />
            )}
            {!isLoading ? (
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
                  <Button sz="sm-1" variant="secondary">
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
