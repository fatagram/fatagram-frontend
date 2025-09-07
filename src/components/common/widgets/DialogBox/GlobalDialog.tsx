import DialogBox from "@/components/common/utils/DialogBox/DialogBox";
import { AppDispatch, RootState } from "@/store";
import { closeDialog } from "@/store/dialogSlice";
import { useDispatch, useSelector } from "react-redux"

const GlobalDialog: React.FC = () => {
    const dispatch = useDispatch();
    const { isOpen, props } = useSelector((state: RootState) => state.dialog);

    if (!isOpen) return null;

    return (
        <div className={`fixed z-[9998] inset-0 flex items-center justify-center bg-black bg-opacity-50 ${props?.className}`}>
            <DialogBox {...props} onClose={() => dispatch(closeDialog())} />
        </div>
    )
}

export default GlobalDialog;