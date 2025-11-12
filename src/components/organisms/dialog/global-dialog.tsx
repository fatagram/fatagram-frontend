import { useDialog } from "@/hooks/utilities/use-dialog";
import clsx from "clsx";
import { Dialog } from "./dialog";

export const GlobalDialog: React.FC = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();

  if (!isOpen) return null;

  return (
    <div
      className={clsx(
        "fixed z-[9998] inset-0 flex items-center justify-center",
        "bg-black bg-opacity-50",
      )}
    >
      <Dialog {...dialogProps} onClose={closeDialog} />
    </div>
  );
};
