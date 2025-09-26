import React from "react";
import { userProfileService } from "@/api/user/user-profile.api";
import { friendshipService } from "@/api/user/friendship.api";
import { useTranslation } from "react-i18next";
import ProfileBackground from "./profile-background";
import ProfileAvatar from "./profile-avatar";
import AddFriendButton from "./friend-button";
import { useNavigate } from "react-router-dom";
import { useDialog } from "@/contexts/common/dialog-context";
import Text, { TextSkeletonLoading } from "@/components/atoms/text";
import Button from "@/components/atoms/button";
import { ProfilePageState } from "@/types/profile-page-state";
import { useProfilePage } from "../context/profile-page-context";

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
  const [background, setBackground] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [isLoadingNumOfFriends, setIsLoadingNumOfFriends] = React.useState<boolean>(true);
  const [numberOfFriends, setNumberOfFriends] = React.useState<number>(0);

  const avtRef = React.useRef<HTMLDivElement>(null);

  // Auth info hook
  const { t } = useTranslation() as { t: (key: string) => string };
  const navigate = useNavigate();
  const { openDialog, closeDialog } = useDialog();
  const { isAuthenticated, targetId, isOwner } = useProfilePage();

  // Fetch user profile
  React.useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const response = await userProfileService.GetProfile(
        targetId,
        "avatar,background,fullName,nickname",
      );
      // Delay to simulate loading
      if (response.success) {
        setAvatar(response.data.infos.avatar);
        setBackground(response.data.infos.background);
        setFullName(response.data.infos.fullName);
        setNickname(response.data.infos.nickname);
      } else {
        onUserNotFound?.();
      }
      setIsLoading(false);
    };
    const fetchNumberOfFriends = async () => {
      setIsLoadingNumOfFriends(true);
      const response = await friendshipService.GetNumberOfFriends(
        targetId
      );
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
  const handleSelectBackground = async (file: File) => {
    const result = await userProfileService.UploadBackground(file);
    // console.log(result);
    if (result.success) {
      setBackground(result.data);
    } else if (result.errorCode === "LARGE_FILE_ERROR") {
      openDialog({
        title: t("user:profileHeader.oversizeErrorTitle"),
        content: t("user:profileHeader.oversizeErrorMessage"),
        primaryButton: {
          text: t("user:profileHeader.oversizeErrorButton"),
          onClick: closeDialog,
        },
      });
    }
  };

  const handleSelectAvatar = async (file: File) => {
    const result = await userProfileService.UploadAvatar(file);
    if (result.success) {
      setAvatar(result.data);
    } else if (result.errorCode === "LARGE_FILE_ERROR") {
      openDialog({
        title: t("user:profileHeader.oversizeErrorTitle"),
        content: t("user:profileHeader.oversizeErrorMessage"),
        primaryButton: {
          text: t("user:profileHeader.oversizeErrorButton"),
          onClick: closeDialog,
        },
      });
    }
  };

  return (
    <div className={`relative flex flex-col w-full items-center ${className} `}>
      <div className="relative w-full lg:mx-0 mx-2 ">
        <ProfileBackground
          isLoading={isLoading}
          background={background}
          handleSelectBackground={handleSelectBackground}
        />
      </div>

      <div
        className={`-mt-[80px] flex layout w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end
                            mb-5 lg:gap-0 gap-3`}
      >
        <ProfileAvatar
          isLoading={isLoading}
          avatar={avatar}
          handleSelectAvatar={handleSelectAvatar}
          ref={avtRef}
        />
        <div className="flex flex-col gap-2 flex-1 mb-3 ml-4">
          {isLoading ? (
            <TextSkeletonLoading
              size="md-1"
              className="lg:self-start self-center mb-2 lg:ml-5 w-[200px] mt-2 lg:mt-0"
            />
          ) : (
            <Text size="xl-1" weight="bold" className="lg:text-left text-center break-words">
              {fullName}
              {nickname && (
                <Text size="lg-3" weight="light" className="lg:text-left text-center lg:ml-2">
                  ({nickname})
                </Text>
              )}
            </Text>
          )}

          <div className="flex lg:flex-row flex-col items-center w-full">
            {!isLoadingNumOfFriends ? (
              <Text size="md-2" weight="semibold" className="text-[var(--text-color)] opacity-70">
                {numberOfFriends > 0
                  ? numberOfFriends + " " + t("user:profileHeader.friendsCount")
                  : t("user:profileHeader.noFriendsCount")}
              </Text>
            ) : (
              <TextSkeletonLoading size="md-1" className="w-[150px] lg:ml-5 mb-1" />
            )}
            {!isLoading ? (
              <div className="relative flex flex-wrap lg:flex-none gap-2 lg:mt-0 mt-2 lg:ml-auto">
                {isAuthenticated && (
                  <>
                    {isOwner ? (  
                      <Button
                        size="sm-1"
                        onClick={() => {
                          navigate(`/settings`);
                        }}
                      >
                        <i className="fa-solid fa-user-pen"></i>{" "}
                        {t("user:profileHeader.editButton")}
                      </Button>
                    ) : (
                      <AddFriendButton size="sm-1" uid={targetId} />
                    )}
                  </>
                )}

                {!isOwner && isAuthenticated && (
                  <Button size="sm-1" variant="secondary">
                    <i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}
                  </Button>
                )}
                <Button size="sm-1" variant="secondary">
                  <i className="fa-solid fa-circle-info"></i>
                </Button>
              </div>
            ) : (
              <TextSkeletonLoading size="md-1" className="w-[250px] lg:ml-auto mb-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
