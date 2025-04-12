import React from "react";
import RegisterForm from "../../../features/user/components/RegisterForm/RegisterForm";

interface OverlayRegisterProps {
    onClose?: () => void;
}

const OverlayRegister: React.FC<OverlayRegisterProps> = ({onClose}) => {

    return <div className="fixed inset-0 flex items-center justify-center z-50 overlay-loading-bg-color">
                    <RegisterForm showClose={true} onClose={onClose} showLogo={false}/>
            </div>
}

export default OverlayRegister;