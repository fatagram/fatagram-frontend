import clsx from "clsx";
import { Dialog } from "../../components/ui/dialog/dialog";
import { useDialog } from "@/contexts";

export const GlobalDialog: React.FC = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();

  if (!isOpen) return null;

  return (
    <div
      className={clsx("fixed z-[9998] inset-0 flex items-center justify-center", "bg-bg-overlay")}
    >
      <Dialog {...dialogProps} onClose={closeDialog} />
    </div>
  );
};
