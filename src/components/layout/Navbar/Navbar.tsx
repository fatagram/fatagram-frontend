import React from "react";
import Logo from "../../common/Logo/Logo";
import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../common/Button/Button";
import { useAuth } from "../../../contexts/AuthContext";
import ProfileMenu from "../../../features/user/components/ProfileMenu/ProfileMenu";
import OverlayLogin from "../../common/OverlayLogin/OverlayLogin";
import OverlayRegister from "../../common/OverlayRegister/OverlayRegister";
import { useNavigate } from "react-router-dom";

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({className}) => {
    const toggleTheme = useTheme();
    const { isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = React.useState<boolean>(false);
    const [showRegister, setShowRegister] = React.useState<boolean>(false);
    
    const navigate = useNavigate();

    const handleGoToHome = () => {
        if (isAuthenticated) {
            navigate("/");
        } else
        {
            setShowLogin(true);
        }
    }
    
    return (
        <div className={`flex py-1 sm:pl-10 sm:pr-10 pl-1 pr-1 bg-[var(--bg-color-third)] gap-3
            ${className}
            shadow-md items-center justify-between`}>
                <div onClick={handleGoToHome} className="cursor-pointer flex items-center gap-2">
                    <Logo hasSlogan={false} size="medium"/>
                </div>
            { isAuthenticated ? <ProfileMenu /> : 
                <Button size="small" variant="secondary" onClick={() => setShowLogin(true)}>Sign in</Button>
            }
            { 
                !isAuthenticated && <Button size="small" variant="primary" onClick={() => setShowRegister(true)}>Sign Up</Button>
            }

            {(showLogin && !isAuthenticated) && <OverlayLogin onClose={() => setShowLogin(false)}/>}
            {(showRegister && !isAuthenticated) && <OverlayRegister onClose={() => setShowRegister(false)}/>}
        </div>
    )
}

export default Navbar;