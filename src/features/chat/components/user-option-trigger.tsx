import React, { useState } from "react";
import { useMobile } from "@/hooks/use-mobile";
import { useDialog } from "@/contexts";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { UserOptionsMenu } from "./user-options-menu";

interface UserOptionTriggerProps {
  children: React.ReactNode;
  user: {
    userId: string;
    fullName: string;
    avatarUrl?: string;
  };
}

export const UserOptionTrigger: React.FC<UserOptionTriggerProps> = ({ children, user }) => {
  const isMobile = useMobile();
  const { openDialog, closeDialog } = useDialog();
  const [showSheet, setShowSheet] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMobile) {
      setShowSheet(true);
    } else {
      openDialog({
        title: "",
        content: (
          <UserOptionsMenu
            userId={user.userId}
            fullName={user.fullName}
            avatarUrl={user.avatarUrl}
            onClose={closeDialog}
          />
        ),
      });
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
      <BottomSheet
        open={showSheet}
        onOpenChange={setShowSheet}
        title=""
        trigger={<div className="hidden" />}
      >
        <UserOptionsMenu
          userId={user.userId}
          fullName={user.fullName}
          avatarUrl={user.avatarUrl}
          isSheet
          onClose={() => setShowSheet(false)}
        />
      </BottomSheet>
    </>
  );
};
