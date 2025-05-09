import React from "react";

interface NotificationIconProps {
    count?: number;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({count = 2}) => {

    return (
        <div
            className={`relative flex items-center justify-center rounded-full bg-[var(--bg-color-secondary)] 
            w-[48px] aspect-square text-[var(--text-color)] text-xl
            cursor-pointer hover:bg-[var(--bg-color)] transition-all duration-200 ease-in-out
            active:bg-[var(--bg-color-secondary)] active:scale-95`}>

            <i className="fa-solid fa-bell"></i>
            {count > 0 && (
                <div className={`absolute -top-0 ${count > 99 ? "-right-2" : "-right-1"} bg-red-500 text-white text-[10px] min-w-[16px] 
                    h-[16px] px-[4px] rounded-full border-[2px] border-[var(--bg-color)] flex items-center justify-center`}>
                    {count > 99 ? "99+" : count}
                </div>
            )}
        </div>
    );
}

export default NotificationIcon;