import React from "react";
import RegisterForm from "./RegisterForm";

interface OverlayRegisterProps {
    onClose?: () => void;
}

/**
 * OverlayRegister component displays a registration form overlay.
 * @param {function} onClose - Callback function to be called when the overlay is closed.
 * @returns {JSX.Element} OverlayRegister component
 */
const OverlayRegister: React.FC<OverlayRegisterProps> = ({onClose}) => {

    return <div className="fixed inset-0 flex items-center justify-center z-50 overlay-loading-bg-color">
                    <RegisterForm showClose={true} onClose={onClose} showLogo={false}
                        className="sm:max-w-[400px] max-w-[90%]"/>
            </div>
}

export default OverlayRegister;