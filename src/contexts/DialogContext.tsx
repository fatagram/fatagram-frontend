import { DialogBoxProps } from "@/components/common/widgets/DialogBox/DialogBox";
import OverlayDialog from "@/components/common/widgets/DialogBox/OverlayDialog";
import React, { useCallback, useContext } from "react";

// Dialog Context Type
interface DialogContextType {
    showDialog: (dialogProps: DialogBoxProps) => void;
    closeDialog: () => void;
}

// Dialog Context
const DialogContext = React.createContext<DialogContextType>({
    showDialog: () => {},
    closeDialog: () => {}
});

// Dialog Provider
export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [dialogProps, setDialogProps] = React.useState<DialogBoxProps | null>(null); // Current dialog props
    const [isShowDialog, setIsShowDialog] = React.useState<boolean>(false); // Dialog visibility state

    // Function to show dialog
    const showDialog = useCallback((dialogProps: DialogBoxProps) => {
        setIsShowDialog(true);
        setDialogProps(dialogProps);
    }, []);

    // Function to close dialog
    const closeDialog = useCallback(() => {
        setIsShowDialog(false);
        setDialogProps(null);
    }, []);

    return (    
        <DialogContext.Provider value={{ showDialog, closeDialog }}>
            {children}
            {isShowDialog && <OverlayDialog {...dialogProps}/>}
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);