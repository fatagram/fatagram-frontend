import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import Transition, { AnimationLib } from "../utils/transition";

interface SidebarLayoutProps extends ComponentProps {
  navbar?: React.ReactNode;
  sidebarClassName?: string;
  children: React.ReactNode;
  title?: string;
  showOverlay?: boolean;
  showMenuButton?: boolean;
  showSidebar?: boolean;
  setShowSidebar?: (show: boolean) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  className,
  navbar,
  sidebarClassName,
  title,
  showMenuButton = true,
  showSidebar = false,
  setShowSidebar,
  showOverlay = true,
  children,
}) => {
  return (
    <div className={clsx("flex flex-1 items-stretch", className)}>
      <aside
        className={clsx(
          "z-30 max-w-[300px] shrink-0 overflow-y-auto ",
          "fixed lg:sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))] transition-transform duration-300",
          showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          sidebarClassName,
        )}
      >
        {navbar}
      </aside>

      {showOverlay && (
        <Transition
          animation={AnimationLib.Opacity}
          show={showSidebar}
          className="fixed inset-0 z-20 lg:hidden"
          duration={300}
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShowSidebar?.(false)}
          />
        </Transition>
      )}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        {showMenuButton && (
          <button
            className="self-start ml-3 my-3 text-2xl font-bold lg:hidden"
            onClick={() => setShowSidebar?.(!showSidebar)}
          >
            <i className="fa-solid fa-bars mr-2" />
            <span>{title}</span>
          </button>
        )}
        {children}
        {children}
        {children}
        {children}
        {children}
        {children}
        {children}
      </div>
    </div>
  );
};
