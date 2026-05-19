import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Dialog, DialogBoxProps } from "../../components/ui/dialog";
import { useDialog } from "@/contexts";
import Transition, { AnimationLib } from "@/components/ui/utils/transition";

export const GlobalDialog: React.FC = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();
  const [activeProps, setActiveProps] = useState<DialogBoxProps | null>(null);

  useEffect(() => {
    if (dialogProps) {
      setActiveProps(dialogProps);
    }
  }, [dialogProps]);

  return (
    <Transition
      show={isOpen}
      animation={AnimationLib.Opacity}
      duration={150}
      className="fixed z-[9998] inset-0 flex items-center justify-center bg-bg-overlay"
    >
      <Transition
        show={isOpen}
        animation={AnimationLib.DialogZoom}
        duration={150}
      >
        {activeProps && <Dialog {...activeProps} onClose={closeDialog} />}
      </Transition>
    </Transition>
  );
};
