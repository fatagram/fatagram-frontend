import React from "react";
import "./OverlayLoading.style.css";

const OverlayLoading: React.FC = () => {

    return <div className="absolute inset-0 flex items-center justify-center z-50 overlay-loading-bg-color">
        <div className="absolute top-1/2 w-12 h-12 border-4 border-transparent 
                                border-t-[var(--main-single-color)] border-r-[var(--main-single-color)] 
                                rounded-full animate-spin"></div>
    </div>
}

export default OverlayLoading;