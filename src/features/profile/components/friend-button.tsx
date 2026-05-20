import { friendshipService } from "@/api/user/friendship.api";
import { Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import useClickOutside from "@/hooks/use-click-outside";
import clsx from "clsx";
import React, { RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts";
import { useFriendshipStatus } from "../hooks/use-friendship-status";
import { SmartDropdown } from "@/components/ui/smart-dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserXmark,
  faCheck,
  faXmark,
  faSpinner,
  faPlus,
  faReply,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

interface FriendButtonProps extends ComponentProps {
  uid?: string;
  initialStatus?: string;
}

const FriendButton: React.FC<FriendButtonProps> = ({ uid, initialStatus, className }) => {
  const { t } = useTranslation() as { t: (key: string) => string };

  if (!useAuth().isAuthenticated) return null;

  const [isShowFriendOptions, setIsShowFriendOptions] = useState<boolean>(false);
  const [isShowRequestOptions, setIsShowRequestOptions] = useState<boolean>(false);
  const {
    data: friendshipStatus,
    isLoading,
    isFetching,
  } = useFriendshipStatus(uid && !initialStatus ? uid : "");
  const [currentFriendshipStatus, setFriendshipStatus] = useState<string>(initialStatus || "None");

  useEffect(() => {
    if (friendshipStatus) {
      setFriendshipStatus(friendshipStatus.status);
    }
  }, [friendshipStatus]);

  useEffect(() => {
    if (initialStatus) {
      setFriendshipStatus(initialStatus);
    }
  }, [initialStatus]);

  const btnFriendRef = useRef<HTMLButtonElement>(null);
  const btnRequestRef = useRef<HTMLButtonElement>(null);
  const friendOptionsRef = useRef<HTMLDivElement>(null);
  const requestOptionsRef = useRef<HTMLDivElement>(null);

  useClickOutside(
    friendOptionsRef as RefObject<HTMLDivElement>,
    btnFriendRef as RefObject<HTMLButtonElement>,
    () => {
      if (isShowFriendOptions) setIsShowFriendOptions(false);
    },
  );

  useClickOutside(
    requestOptionsRef as RefObject<HTMLDivElement>,
    btnRequestRef as RefObject<HTMLButtonElement>,
    () => {
      if (isShowRequestOptions) setIsShowRequestOptions(false);
    },
  );

  const handleSentAddFriendRequest = useCallback(async () => {
    const response = await friendshipService.SendAddFriendRequest(uid ? uid : "");
    if (response.success) {
      setFriendshipStatus("SentByMe");
    }
  }, [uid, friendshipService]);

  const handleCancelAddFriendRequest = useCallback(async () => {
    const response = await friendshipService.CancelAddFriendRequest(uid ? uid : "");
    if (response.success) {
      setFriendshipStatus("None");
    }
  }, [uid, friendshipService]);

  const handleAcceptAddFriendRequest = useCallback(
    async (id: string | undefined) => {
      const response = await friendshipService.AcceptAddFriendRequest(id ? id : "");
      if (response.success) {
        setFriendshipStatus("Friend");
      }
    },
    [friendshipService],
  );

  const handleDeclineAddFriendRequest = useCallback(
    async (id: string | undefined) => {
      const response = await friendshipService.DeclineAddFriendRequest(id ? id : "");
      if (response.success) {
        setFriendshipStatus("None");
      }
    },
    [friendshipService],
  );

  // Handle unfriend action
  const handleUnfriend = useCallback(
    async (id: string | undefined) => {
      const response = await friendshipService.Unfriend(id ? id : "");
      if (response.success) {
        setFriendshipStatus("None");
      }
    },
    [friendshipService],
  );

  // Dropdown options for friend actions
  const friendOptions = useMemo(
    () => [
      {
        id: "unfriend",
        content: (
          <div>
            <FontAwesomeIcon icon={faUserXmark} className={clsx("mr-2")} />{" "}
            {t("user:profileHeader.unfriendButton")}
          </div>
        ),
        onClick: async () => {
          await handleUnfriend?.(uid);
        },
      },
    ],
    [uid, handleUnfriend, t],
  );

  // Dropdown options for request actions
  const requestOptions = useMemo(
    () => [
      {
        id: "acceptRequest",
        content: (
          <div>
            <FontAwesomeIcon icon={faCheck} className={clsx("mr-2")} />{" "}
            {t("user:profileHeader.acceptButton")}
          </div>
        ),
        onClick: async () => await handleAcceptAddFriendRequest?.(uid),
      },
      {
        id: "cancelRequest",
        content: (
          <div>
            <FontAwesomeIcon icon={faXmark} className={clsx("mr-2")} />{" "}
            {t("user:profileHeader.declineButton")}
          </div>
        ),
        onClick: async () => await handleDeclineAddFriendRequest?.(uid),
      },
    ],
    [uid, handleAcceptAddFriendRequest, handleDeclineAddFriendRequest, t],
  );

  if (isLoading || isFetching) {
    return (
      <Button sz="sm" disabled>
        <FontAwesomeIcon icon={faSpinner} spin />
      </Button>
    );
  }

  return (
    <div className={className}>
      {currentFriendshipStatus === "None" ? (
        <Button sz="sm" onClick={handleSentAddFriendRequest} className="w-full">
          <FontAwesomeIcon icon={faPlus} /> {t("user:profileHeader.addFriendButton")}
        </Button>
      ) : currentFriendshipStatus === "SentByMe" ? (
        <Button sz="sm" onClick={handleCancelAddFriendRequest} className="w-full">
          <FontAwesomeIcon icon={faXmark} /> {t("user:profileHeader.cancelRequestButton")}
        </Button>
      ) : currentFriendshipStatus === "SentByThem" ? (
        <div className={clsx("sm:relative", "z-50")}>
          <Button
            sz="sm"
            ref={btnRequestRef}
            onClick={() => {
              setIsShowRequestOptions(!isShowRequestOptions);
            }}
            className="w-full"
          >
            <FontAwesomeIcon icon={faReply} /> {t("user:profileHeader.respondRequestButton")}
          </Button>
          <SmartDropdown
            ref={requestOptionsRef}
            isShow={isShowRequestOptions}
            className={clsx(
              "absolute",
              "flex",
              "sm:top-[130%]",
              "top-[110%]",
              "left-[1%]",
              "bg-[var(--main-bg-color)]",
              "shadow-md",
              "z-[10]",
              "sm:min-w-[200px]",
              "w-[calc(100%-2%)]",
            )}
            items={requestOptions}
            onClose={() => setIsShowRequestOptions(false)}
          />
        </div>
      ) : (
        <div className={clsx("sm:relative", "z-50")}>
          <Button
            sz="sm"
            ref={btnFriendRef}
            onClick={() => {
              setIsShowFriendOptions(!isShowFriendOptions);
            }}
            className="w-full"
          >
            <FontAwesomeIcon icon={faUserCheck} /> {t("user:profileHeader.friendButton")}
          </Button>
          <SmartDropdown
            ref={friendOptionsRef}
            isShow={isShowFriendOptions}
            className={clsx(
              "absolute",
              "sm:top-[130%]",
              "top-[110%]",
              "left-[1%]",
              "bg-[var(--main-bg-color)]",
              "p-2",
              "rounded-lg",
              "shadow-md",
              "z-[10]",
              "sm:min-w-[200px]",
              "w-[calc(100%-2%)]",
            )}
            items={friendOptions}
            onClose={() => setIsShowFriendOptions(false)}
          />
        </div>
      )}
    </div>
  );
};

export default FriendButton;
