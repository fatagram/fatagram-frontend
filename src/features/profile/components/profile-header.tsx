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
import UserInfoDialog from "./user-info-dialog";
import { createPortal } from "react-dom";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faUserPen, faComment, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export type ProfileHeaderProps = {
  className?: string;
  onUserNotFound?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ className, onUserNotFound }) => {
  const t = useLanguage();
  const navigate = useNavigate();
  const { targetId, isOwner } = useProfilePage();
  const { isAuthenticated } = useAuth();
  const { openDialog, closeDialog } = useDialog();

  const { data, isLoading, isFetching } = useGetUserProfile(targetId);
  const userProfile = data?.infos;
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
  }, [targetId, openChatWithTarget]);

  useEffect(() => {
    if (!isLoading && !isFetching && !userProfile && onUserNotFound) {
      onUserNotFound();
    }
  }, [isLoading, isFetching, userProfile, onUserNotFound]);

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
      <div className="relative w-full aspect-[16/6] sm:aspect-[16/5] overflow-hidden">
        <ProfileBackground />
        <div className="absolute inset-0 bg-black/10 z-5 pointer-events-none" />
      </div>

      <div className="hidden sm:flex relative z-20 w-full max-w-[930px] bg-bg-main/95 backdrop-blur-md rounded-2xl p-7 shadow-md border border-bg-fourth/50 gap-8 items-start -mt-[110px] mb-2 transition-all duration-300 hover:bg-bg-main">
        <div className="shrink-0 rounded-full shadow-md -mt-[98px] relative z-20">
          <ProfileAvatar />
        </div>

        <div className="flex-1 flex flex-col gap-5 pt-2">
          <div className="flex items-center gap-6 flex-wrap">
            {isLoading || isFetching ? (
              <Skeleton sz="md" className="!w-48 !h-8" />
            ) : (
              <div className="flex items-baseline gap-2 flex-wrap">
                <Text weight="bold" className="!text-2xl text-text-main">
                  {userProfile?.fullName}
                </Text>
                {userProfile?.nickname && (
                  <Text sz="lg" weight="light" className="text-text-third">
                    ({userProfile.nickname})
                  </Text>
                )}
              </div>
            )}

            {!numberOfFriendsFetching ? (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-third/80 border border-border-main/50 backdrop-blur-sm transition-all duration-300 hover:bg-bg-third select-none h-8">
                <FontAwesomeIcon icon={faUsers} className="text-primary-500 text-sm leading-none"  />
                <span className="text-sm font-bold text-text-main leading-none flex items-center">
                  {numberOfFriends || 0}
                </span>
                <span className="text-xs text-text-third font-semibold leading-none flex items-center">
                  {t("user:profileHeader.friendsCount")}
                </span>
              </div>
            ) : (
              <Skeleton sz="md" className="!w-36 !h-8 !rounded-full" />
            )}

            {userProfile?.nickname && (
              <div className="flex gap-1.5 items-center">
                <span className="text-text-third text-sm">Biệt danh:</span>
                <span className="text-sm font-bold text-text-main truncate max-w-[150px]">
                  {userProfile.nickname}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!isLoading && !isFetching ? (
              <div className="flex items-center gap-2.5">
                {isAuthenticated && (
                  <>
                    {isOwner ? (
                      <Button
                        sz="sm"
                        className="!h-9 text-xs font-semibold rounded-lg bg-bg-third border border-bg-fourth hover:bg-bg-hover transition-colors px-4 justify-center"
                        onClick={() => navigate(`/settings`)}
                      >
                        <FontAwesomeIcon icon={faUserPen} className="mr-2" /> Chỉnh sửa
                      </Button>
                    ) : (
                      <>
                        <AddFriendButton
                          className="!h-9 text-xs font-semibold rounded-lg"
                          sz="sm"
                          uid={targetId}
                        />
                        <Button
                          sz="sm"
                          variant="secondary"
                          className="!h-9 text-xs font-semibold rounded-lg justify-center border border-bg-fourth hover:bg-bg-hover transition-colors px-4"
                          onClick={handleMessageClick}
                        >
                          <FontAwesomeIcon icon={faComment} className="mr-2" />{" "}
                          {t("user:profileHeader.messageButton")}
                        </Button>
                      </>
                    )}
                  </>
                )}
                <Button
                  sz="sm"
                  variant="secondary"
                  className="w-10 !h-9 flex items-center justify-center rounded-lg border border-bg-fourth shrink-0 hover:bg-bg-hover transition-colors group"
                  onClick={handleOpenInfoDialog}
                >
                  <FontAwesomeIcon icon={faCircleInfo} className="text-text-second group-hover:text-text-main transition-colors" />
                </Button>
              </div>
            ) : (
              <Skeleton sz="md" className="!w-[250px] !h-9 rounded-lg" />
            )}
          </div>

          <div className="flex flex-col gap-1">
            {userProfile?.bio && (
              <Text
                sz="sm"
                className="text-text-second leading-relaxed break-words whitespace-pre-line max-w-[550px]"
              >
                {userProfile?.bio}
              </Text>
            )}
          </div>
        </div>
      </div>

      <div className="w-full px-4 pt-5 pb-2 flex flex-col gap-3.5 sm:hidden relative bg-bg-main rounded-t-2xl -mt-6 z-20">
        <div className="flex items-end gap-4 -mt-[56px] relative z-10">
          <div className="shrink-0 rounded-full shadow-sm">
            <ProfileAvatar />
          </div>

          <div className="flex-1 pb-1 flex flex-row items-baseline gap-2 flex-wrap min-w-0">
            {isLoading || isFetching ? (
              <Skeleton sz="md" className="!w-32 !h-6" />
            ) : (
              <Text weight="bold" className="!text-xl text-text-main truncate">
                {userProfile?.fullName}
              </Text>
            )}
            {userProfile?.nickname && (
              <Text sz="sm" className="text-text-third font-medium truncate">
                ({userProfile.nickname})
              </Text>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {!numberOfFriendsFetching ? (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-bg-third/80 border border-border-main/50 backdrop-blur-sm transition-all duration-300 hover:bg-bg-third select-none h-7">
              <FontAwesomeIcon icon={faUsers} className="text-primary-500 text-xs leading-none"  />
              <span className="text-xs font-bold text-text-main leading-none flex items-center">
                {numberOfFriends || 0}
              </span>
              <span className="text-[10px] text-text-third font-semibold leading-none flex items-center">
                {t("user:profileHeader.friendsCount")}
              </span>
            </div>
          ) : (
            <Skeleton sz="sm" className="!w-24 !h-6 !rounded-full" />
          )}

          {userProfile?.nickname && (
            <span className="text-xs text-text-third font-medium ml-1">
              Biệt danh: <span className="font-bold text-text-main">{userProfile.nickname}</span>
            </span>
          )}
        </div>

        {userProfile?.bio && (
          <Text
            sz="sm"
            className="text-text-second leading-relaxed break-words whitespace-pre-line"
          >
            {userProfile?.bio}
          </Text>
        )}

        <div className="flex gap-2 w-full mt-1">
          {isAuthenticated && (
            <>
              {isOwner ? (
                <Button
                  sz="sm"
                  className="flex-1 !h-9 text-xs font-semibold rounded-lg justify-center bg-bg-third border border-bg-fourth"
                  onClick={() => navigate(`/settings`)}
                >
                  <FontAwesomeIcon icon={faUserPen} className="mr-1.5" /> Chỉnh sửa
                </Button>
              ) : (
                <div className="flex-1 flex gap-2">
                  <div className="flex-1">
                    <AddFriendButton
                      className="w-full !h-9 text-xs font-semibold rounded-lg"
                      sz="sm"
                      uid={targetId}
                    />
                  </div>
                  <Button
                    sz="sm"
                    variant="secondary"
                    className="flex-1 !h-9 text-xs font-semibold rounded-lg justify-center border border-bg-fourth"
                    onClick={handleMessageClick}
                  >
                    <FontAwesomeIcon icon={faComment} className="mr-1.5" />{" "}
                    {t("user:profileHeader.messageButton")}
                  </Button>
                </div>
              )}
            </>
          )}
          <Button
            sz="sm"
            variant="secondary"
            className="w-10 !h-9 flex items-center justify-center rounded-lg border border-bg-fourth shrink-0 group"
            onClick={handleOpenInfoDialog}
          >
            <FontAwesomeIcon icon={faCircleInfo} className="text-text-second group-hover:text-text-main transition-colors" />
          </Button>
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
              <div className="flex items-center justify-between w-full mb-8 shrink-0">
                <BackButton sz="md" onClick={() => setShowMobileInfoPage(false)} />
                <Text weight="bold" sz="lg" className="text-text-main font-semibold">
                  {t("user:profileHeader.infoTitle")}
                </Text>
                <div className="w-10" />
              </div>

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
