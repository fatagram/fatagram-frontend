import { DialogBoxProps } from "@/components/common/utils/DialogBox/DialogBox";
import React, { createContext } from "react";

type DialogContextType = {
    isOpen: boolean;
    dialogProps?: DialogBoxProps | null;
    openDialog: (props: DialogBoxProps) => void;
    closeDialog: () => void;
};

const DialogContext = createContext<DialogContextType>({
    isOpen: false,
    dialogProps: null,
    openDialog: () => {},
    closeDialog: () => {}
});

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [dialogProps, setDialogProps] = React.useState<DialogBoxProps | null>(null);

    const openDialog = (props: DialogBoxProps) => {
        setDialogProps(props);
        setIsOpen(true);
    }

    const closeDialog = () => {
        setIsOpen(false);
        setDialogProps(null);
    }

    return (
        <DialogContext.Provider value={{ isOpen, dialogProps, openDialog, closeDialog,  }}>
            {children}
        </DialogContext.Provider>
    );
};

export const useDialog = () => {
    const context = React.useContext(DialogContext);
    if (!context) {
        throw new Error("useDialog must be used within a DialogProvider");
    }
    return context;
};