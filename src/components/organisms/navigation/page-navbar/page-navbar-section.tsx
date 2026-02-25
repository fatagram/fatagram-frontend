import { useState } from "react";
import { Text } from "@/components/atoms";
import clsx from "clsx";
import HeightTransition from "@/components/utils/height-transition";

type PageNavbarSectionProps = {
  title?: string;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
};

export const PageNavbarSection: React.FC<PageNavbarSectionProps> = ({
  title,
  className,
  titleClassName,
  children,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(true);

  return (
    <div className={clsx("w-full", className)}>
      {title && (
        <div
          className={clsx(
            "group flex items-center justify-between",
            "p-2 pl-5 pr-3 cursor-pointer select-none",
            "hover:bg-bg-third/50 rounded-lg",
            "transition-all duration-200",
          )}
          onClick={() => setShowChildren(!showChildren)}
        >
          <Text
            sz="lg-1"
            weight="bold"
            className={clsx(
              "text-text-third group-hover:text-text-main transition-colors duration-200",
              titleClassName,
            )}
          >
            {title}
          </Text>
          <i
            className={clsx(
              "fas fa-chevron-down text-text-third text-sm",
              "transition-transform duration-300",
              "group-hover:text-primary-500",
              showChildren ? "rotate-180" : "rotate-0",
            )}
          />
        </div>
      )}
      <HeightTransition show={showChildren}>
        <div className={clsx("w-full mt-1 space-y-1")}>{children}</div>
      </HeightTransition>
    </div>
  );
};
