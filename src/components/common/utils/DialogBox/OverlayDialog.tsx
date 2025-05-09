import React from "react";
import DialogBox, { DialogBoxProps } from "./DialogBox";

const OverlayDialog: React.FC<DialogBoxProps> = (props) => {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <DialogBox {...props} />
        </div>
    )
}

export default OverlayDialog;