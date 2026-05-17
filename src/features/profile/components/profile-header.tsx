import React, { useCallback, useEffect, useState } from "react";
import ProfileBackground from "./profile-background";
import ProfileAvatar from "./profile-avatar";
import AddFriendButton from "./friend-button";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useProfilePage } from "../hooks/use-profile-page";
import useLanguage from "@/utils/i18n";
import { Button, Text, Skeleton, BackButton } from "@/components/atoms";
import { useGetUserProfile } from "@/features/hooks/use-user-profile";
import { useGetNumberOfFriends } from "@/features/hooks/use-friend";
import { useAuth, useDialog } from "@/contexts";
import { useOpenChat } from "@/features/chat/hooks/use-open-chat";
import { useChatStore } from "@/features/chat/hooks/use-floating-chat";
import UserInfoDialog from "./user-info-dialog";
import { createPortal } from "react-dom";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";

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
  const { openDialog, closeDialog } = useDialog();

  const { data, isLoading, isFetching } = useGetUserProfile(targetId);
  const userProfile = data?.infos;
  const { openChat } = useChatStore();
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileInfoPage, setShowMobileInfoPage] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { data: numberOfFriends, isFetching: numberOfFriendsFetching } =
    useGetNumberOfFriends(targetId);

  const { openChatWithTarget } = useOpenChat();

  const handleMessageClick = useCallback(async () => {
    if (!targetId) return;
    await openChatWithTarget(targetId);
  }, [isMobile, targetId, openChatWithTarget, openChat]);

  const handleOpenInfoDialog = useCallback(() => {
    if (isMobile) {
      setShowMobileInfoPage(true);
    } else {
      openDialog({
        title: t("user:profileHeader.infoTitle"),
        className: "w-[380px] max-w-[95vw]",
        onClose: closeDialog,
        primaryButton: {
          text: t("user:profileHeader.closeButton"),
          onClick: closeDialog,
        },
        content: <UserInfoDialog userProfile={userProfile} targetId={targetId || ""} />,
      });
    }
  }, [isMobile, openDialog, closeDialog, userProfile, targetId, t]);

  return (
    <div className={clsx("relative w-full flex flex-col items-center", className)}>
      <div className="relative w-full sm:mt-2 mt-0">
        <ProfileBackground />
      </div>

      <div className="-mt-[80px] flex w-[85%] flex-col lg:flex-row items-center justify-center lg:items-end mb-5 lg:gap-0 gap-3">
        <ProfileAvatar />
        <div className="flex flex-col gap-2 items-start flex-1 lg:mb-3 lg:ml-4">
          {isLoading || isFetching ? (
            <Skeleton sz="md" className="!w-56" />
          ) : (
            <Text weight="bold" className="!text-2xl text-center break-words w-full lg:w-auto">
              {userProfile?.fullName}
              {userProfile?.nickname && (
                <Text sz="lg" weight="light" className="lg:text-left text-center ml-2">
                  ({userProfile?.nickname})
                </Text>
              )}
            </Text>
          )}

          <div className="flex flex-col items-center w-full lg:flex-row">
            {!numberOfFriendsFetching ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-third/80 border border-border-main/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-bg-third select-none">
                <i className="fa-solid fa-users text-primary-500 text-sm" />
                <span className="text-sm font-bold text-text-main">{numberOfFriends || 0}</span>
                <span className="text-xs text-text-third font-semibold">
                  {t("user:profileHeader.friendsCount")}
                </span>
              </div>
            ) : (
              <Skeleton sz="md" className="!w-36 !h-8 !rounded-full" />
            )}
            {!isLoading || !isFetching ? (
              <div className="flex flex-wrap flex-row gap-2 mt-2 lg:ml-auto lg:mt-0">
                {isAuthenticated && (
                  <>
                    {isOwner ? (
                      <Button
                        sz="sm"
                        onClick={() => {
                          navigate(`/settings`);
                        }}
                      >
                        <i className="fa-solid fa-user-pen"></i>{" "}
                        {t("user:profileHeader.editButton")}
                      </Button>
                    ) : (
                      <AddFriendButton sz="sm" uid={targetId} />
                    )}
                  </>
                )}

                {!isOwner && isAuthenticated && (
                  <Button sz="sm" variant="secondary" onClick={handleMessageClick}>
                    <i className="fa-solid fa-comment"></i> {t("user:profileHeader.messageButton")}
                  </Button>
                )}
                <Button sz="sm" variant="secondary" onClick={handleOpenInfoDialog}>
                  <i className="fa-solid fa-circle-info"></i>
                </Button>
              </div>
            ) : (
              <Skeleton sz="md" className="!w-[250px] lg:ml-auto mb-1" />
            )}
          </div>
        </div>
      </div>

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <Transition
            show={showMobileInfoPage}
            animation={AnimationLib.DropdownSlide}
            duration={180}
            className="fixed inset-0 bg-bg-main z-[9999] flex flex-col p-6 w-full h-[100dvh] overflow-y-auto scrollbar-hide sm:hidden"
          >
            <div className="flex flex-col w-full h-full">
              {/* Header */}
              <div className="flex items-center justify-between w-full mb-8 shrink-0">
                <BackButton sz="md" onClick={() => setShowMobileInfoPage(false)} />
                <Text weight="bold" sz="lg" className="text-text-main font-semibold">
                  {t("user:profileHeader.infoTitle")}
                </Text>
                <div className="w-10" />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                <UserInfoDialog userProfile={userProfile} targetId={targetId || ""} />
              </div>
            </div>
          </Transition>,
          document.body,
        )}
    </div>
  );
};

export default ProfileHeader;
