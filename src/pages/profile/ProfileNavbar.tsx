import Link from "@/components/common/ui/Link";
import NavbarItem from "@/components/layout/Navbar/NavbarItem";
import { useTransition } from "react";
import { useTranslation } from "react-i18next";

interface ProfileNavbarProps {
    userParam?: string;
    isOwner?: boolean;
    className?: string;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
    userParam,
    isOwner,
    className = ""
}) => {

    const { t } = useTranslation() as { t: (key: string) => string };

    const navbarItems = [
        { name: t('user:profileMenu.posts'), href: `/${userParam}` },
        { name: t('user:profileMenu.friends'), href: `/${userParam}/friends` },
        { name: t('user:profileMenu.photos'), href: `/${userParam}/photos` },
        { name: t('user:profileMenu.videos'), href: `/${userParam}/videos` },
        { name: t('user:profileMenu.about'), href: `/${userParam}/about` },
        { name: t('user:profileMenu.settings'), href: `/${userParam}/settings` },
    ]

    return (
        <div className={`flex ${className}`}>
            {
                navbarItems.map((item, index) => { 
                    return <NavbarItem key={index}
                        path={item.href ?? ""} 
                        children={item.name}
                        end={`/${userParam}`}/>
                }) 
            }
        </div>
    )
}

export default ProfileNavbar;