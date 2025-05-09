import { DialogBoxProps } from "@/components/common/utils/DialogBox/DialogBox";
import OverlayDialog from "@/components/common/utils/DialogBox/OverlayDialog";
import React, { useContext } from "react";

interface DialogContextType {
    showDialog: (dialogProps: DialogBoxProps) => void;
    closeDialog: () => void;
}

const DialogContext = React.createContext<DialogContextType>({
    showDialog: () => {},
    closeDialog: () => {}
});

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogProps, setDialogProps] = React.useState<DialogBoxProps | null>(null);
    const [isShowDialog, setIsShowDialog] = React.useState<boolean>(false);

    const showDialog = (dialogProps: DialogBoxProps) => {
        setIsShowDialog(true);
        setDialogProps(dialogProps);
    };

    const closeDialog = () => {
        setIsShowDialog(false);
        setDialogProps(null);
    };

    return (    
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
            {children}
            {isShowDialog && <OverlayDialog {...dialogProps}/>}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);