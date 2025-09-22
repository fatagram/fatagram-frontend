import React from "react";
import styles from "./overlay-loading.module.css";

const OverlayLoading: React.FC = () => {

    return <div className={`absolute inset-0 flex items-center justify-center z-50 ${styles['overlay-loading-bg-color']}`}>
        <div className="absolute top-1/2 w-12 h-12 border-4 border-transparent 
                                border-t-single-main border-r-single-main 
                                rounded-full animate-spin"></div>
    </div>
}

export default OverlayLoading           ;