import { useState } from "react";
import { Text } from "@/components/atoms";
import clsx from "clsx";

type PageNavbarSectionProps = {
  title?: string;
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
};

const PageNavbarSection: React.FC<PageNavbarSectionProps> = ({ title, className, titleClassName, children }) => {
  const [showChildren, setShowChildren] = useState<boolean>(true);

  return (
    <div className={clsx("w-full", className)}>
      {title && (
        <Text
          sz="lg-1"
          weight="bold"
          className={clsx("p-2 pl-5 text-text-third cursor-pointer select-none", titleClassName)}
          onClick={() => setShowChildren(!showChildren)}
        >
          {title}
        </Text>
      )}
      {showChildren && <div className={clsx("w-full animate-dropdown-slide mt-1")}>{children}</div>}
    </div>
  );
};

export default PageNavbarSection;
