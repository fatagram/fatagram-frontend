import { DialogBoxProps } from "@/components/ui/dialog/dialog";
import React, { createContext } from "react";

export interface DialogContextType {
  isOpen: boolean;
  dialogProps?: DialogBoxProps | null;
  openDialog: (props: DialogBoxProps) => void;
  closeDialog: () => void;
}

export const DialogContext = createContext<DialogContextType>({
  isOpen: false,
  dialogProps: null,
  openDialog: () => {},
  closeDialog: () => {},
});

type DialogProviderProps = {
  children: React.ReactNode;
};

export const DialogProvider = React.memo(function DialogProvider({
  children,
}: DialogProviderProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [dialogProps, setDialogProps] = React.useState<DialogBoxProps | null>(null);

  const openDialog = React.useCallback((props: DialogBoxProps) => {
    setDialogProps(props);
    setIsOpen(true);
  }, []);

  const closeDialog = React.useCallback(() => {
    setIsOpen(false);
    setDialogProps(null);
  }, []);

  const value = React.useMemo(
    () => ({
      isOpen,
      dialogProps,
      openDialog,
      closeDialog,
    }),
    [isOpen, dialogProps, openDialog, closeDialog],
  );

  return <DialogContext.Provider value={value}>{children}</DialogContext.Provider>;
});

export function useDialog() {
  const context = React.useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
}
