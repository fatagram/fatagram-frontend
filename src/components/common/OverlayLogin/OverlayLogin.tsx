import React from "react";
import LoginForm from "../../../features/auth/components/LoginForm/LoginForm";

interface OverlayLoginProps {
    onClose?: () => void;
}

const OverlayLogin: React.FC<OverlayLoginProps> = ({onClose}) => {

    return <div className="fixed inset-0 flex items-center justify-center z-50 overlay-loading-bg-color">
                    <LoginForm showClose={true} onClose={onClose} showLogo={false}/>
            </div>
}

export default OverlayLogin;