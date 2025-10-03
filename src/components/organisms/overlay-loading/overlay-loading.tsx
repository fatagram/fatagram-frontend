import React from "react";
import clsx from "clsx";
import styles from "./overlay-loading.module.css";

const OverlayLoading: React.FC = () => {
  return (
    <div
      className={clsx(
        "absolute inset-0 flex items-center justify-center z-50",
        styles["overlay-loading-bg-color"]
      )}
    >
      <div
        className={clsx(
          "absolute top-1/2 w-12 h-12 border-4 border-transparent",
          "border-t-primary-700 border-r-primary-700",
          "rounded-full animate-spin"
        )}
      ></div>
    </div>
  );
};

export default OverlayLoading;
