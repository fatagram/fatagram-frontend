import React from "react";

interface FooterProps {
    className?: string;
}

const Footer: React.FC<FooterProps> = ({className}) => {
    return (
        <footer className={`text-center text-[#d8d8d8] text-sm py-4 ${className}`}>
            © {new Date().getFullYear()} Fatagram. All rights reserved.
        </footer>
    )
}

export default Footer;