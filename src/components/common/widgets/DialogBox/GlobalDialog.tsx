import DialogBox from "@/components/common/utils/DialogBox/DialogBox";
import { useDialog } from "@/contexts/DialogContext";
import { useDispatch, useSelector } from "react-redux"

const GlobalDialog: React.FC = () => {
    const { isOpen, dialogProps, closeDialog } = useDialog();

    if (!isOpen) return null;

    return (
        <div className={`fixed z-[9998] inset-0 flex items-center justify-center bg-black bg-opacity-50`}>
            <DialogBox {...dialogProps} onClose={closeDialog} />
        </div>
    )
}

export default GlobalDialog;