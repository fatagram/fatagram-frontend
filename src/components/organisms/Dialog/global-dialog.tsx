import { useDialog } from "@/contexts/common/dialog-context";
import Dialog from "./dialog";

const GlobalDialog: React.FC = () => {
  const { isOpen, dialogProps, closeDialog } = useDialog();

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-[9998] inset-0 flex items-center justify-center bg-black bg-opacity-50`}
    >
      <Dialog {...dialogProps} onClose={closeDialog} />
    </div>
  );
};

export default GlobalDialog;
