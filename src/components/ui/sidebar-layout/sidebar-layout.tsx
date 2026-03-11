import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useState } from "react";
import Transition, { AnimationLib } from "../utils/transition";

interface SidebarLayoutProps extends ComponentProps {
  navbar?: React.ReactNode;
  children: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ className, navbar, children }) => {
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(false);

  return (
    <div className={clsx("flex items-start", className)}>
      <aside
        className="z-10 w-[50%] max-w-[300px] shrink-0 overflow-y-auto sticky hidden lg:block"
        style={{
          top: "var(--header-height, 0px)",
          height: "calc(100vh - var(--header-height, 0px))",
        }}
      >
        {navbar}
      </aside>

      <Transition
        animation={AnimationLib.Opacity}
        show={isShowSidebar}
        className="fixed inset-0 z-20 lg:hidden"
        duration={300}
      >
        <div
          className="absolute inset-0 bg-black opacity-50"
          onClick={() => setIsShowSidebar(false)}
        />
      </Transition>

      <Transition
        animation={AnimationLib.SlideSnappy}
        show={isShowSidebar}
        className="fixed z-30 lg:hidden"
        style={{
          top: "var(--header-height, 0px)",
          height: "calc(100vh - var(--header-height, 0px))",
        }}
        duration={300}
      >
        <aside className="w-[70vw] max-w-[300px] h-full overflow-y-auto">{navbar}</aside>
      </Transition>

      <main className={clsx("flex-1")}>
        <div className="w-full flex flex-col items-center">
          <button
            className="self-start ml-2 text-xl block lg:hidden"
            onClick={() => setIsShowSidebar((prev) => !prev)}
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          {children}
        </div>
      </main>
    </div>
  );
};
