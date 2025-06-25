import Link from "@/components/common/ui/Link";
import NavbarItem from "@/components/layout/Navbar/NavbarItem";

interface ProfileNavbarProps {
    userParam?: string;
    className?: string;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
    userParam,
    className = ""
}) => {

    const navbarItems = [
        { name: 'Posts', href: `/${userParam}` },
        { name: 'Friends', href: `/${userParam}/friends` },
        { name: 'Photos', href: `/${userParam}/photos` },
        { name: 'Videos', href: `/${userParam}/videos` },
        { name: 'About', href: `/${userParam}/about` },
        { name: 'Settings', href: `/${userParam}/settings` },
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