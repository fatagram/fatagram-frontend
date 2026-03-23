import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useState } from "react";
import Transition, { AnimationLib } from "../utils/transition";

interface SidebarLayoutProps extends ComponentProps {
  navbar?: React.ReactNode;
  sidebarClassName?: string;
  children: React.ReactNode;
  title?: string;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  className,
  navbar,
  sidebarClassName,
  title,
  children,
}) => {
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(false);

  return (
    <div className={clsx("flex items-start", className)}>
      <aside
        className={clsx(
          "z-30 w-[70vw] max-w-[300px] shrink-0 overflow-y-auto",
          "fixed lg:sticky transition-transform duration-300",
          isShowSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarClassName,
        )}
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

      <main className={clsx("flex-1 lg:ml-0 h-full")}>
        <div className="w-full h-full flex flex-col items-center">
          <button
            className="self-start ml-3 my-3 text-2xl font-bold lg:hidden"
            onClick={() => setIsShowSidebar((prev) => !prev)}
          >
            <i className="fa-solid fa-bars mr-2" />
            <span>{title}</span>
          </button>
          {children}
        </div>
      </main>
    </div>
  );
};
