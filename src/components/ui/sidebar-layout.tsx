import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import Transition, { AnimationLib } from "./utils/transition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Text } from "@/components/atoms";

interface SidebarLayoutProps extends ComponentProps {
  navbar?: React.ReactNode;
  sidebarClassName?: string;
  childrenWrapperCalssName?: string;
  children: React.ReactNode;
  title?: string;
  showOverlay?: boolean;
  showMenuButton?: boolean;
  showSidebar?: boolean;
  mobileSticky?: boolean;
  setShowSidebar?: (show: boolean) => void;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  className,
  navbar,
  sidebarClassName,
  childrenWrapperCalssName,
  title,
  showMenuButton = true,
  showSidebar = false,
  mobileSticky = false,
  setShowSidebar,
  showOverlay = true,
  children,
}) => {
  return (
    <div className={clsx("flex flex-1 items-stretch ", className)}>
      <aside
        className={clsx(
          "z-30 w-full max-w-[300px] shrink-0 overflow-y-auto",
          mobileSticky
            ? "sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))]"
            : "fixed lg:sticky top-[var(--header-height)] h-[calc(100dvh-var(--header-height))] transition-transform duration-300",
          !mobileSticky && (showSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
          mobileSticky && !showSidebar && "hidden lg:flex",
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

      <div className={clsx("flex-1 flex flex-col min-w-0 h-full", childrenWrapperCalssName)}>
        {showMenuButton && (
          <button
            className="self-start m-3 text-2xl font-bold lg:hidden flex items-center"
            onClick={() => setShowSidebar?.(!showSidebar)}
          >
            <FontAwesomeIcon icon={faBars} className="mr-3" />
            <Text sz="lg" weight="bold">
              {title}
            </Text>
          </button>
        )}
        {children}
      </div>
    </div>
  );
};
