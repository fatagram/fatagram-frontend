import React from "react";
import Logo from "../../common/Logo/Logo";
import { useTheme } from "../../../contexts/ThemeContext";
import Button from "../../common/Button/Button";

interface NavbarProps {
    className?: string;
}

const Navbar: React.FC<NavbarProps> = ({className}) => {
    const toggleTheme = useTheme();

    return (
        <div className={`flex p-1 pl-10 pr-10 bg-[var(--bg-color-third)] ${className}
            shadow-md items-center`}>
            <Logo hasSlogan={false}/>
            <Button size="small" onClick={toggleTheme.toggleTheme} className="ml-auto">Toggle Theme</Button>
        </div>
    )
}

export default Navbar;