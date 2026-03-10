import React from "react";
import clsx from "clsx";
import { Logo } from "@/components/atoms";

// LoadingPage
// This component is the loading page component.
const LoadingPage: React.FC = () => {
  return (
    <div className={clsx("fixed inset-0 z-[9999] flex justify-center items-center bg-bg-main")}>
      <div className={clsx("flex flex-col items-center")}>
        <Logo sz="lg-1" hasSlogan={false} />
        {/* <div className={clsx(
              "relative top-1/2 w-12 h-12 mt-5 border-4 border-transparent",
              "border-t-single-main border-r-single-main",
              "rounded-full animate-spin"
            )}></div> */}
      </div>
    </div>
  );
};

export default LoadingPage;
