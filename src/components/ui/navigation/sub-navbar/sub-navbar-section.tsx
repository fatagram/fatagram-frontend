import { useState } from "react";
import { Text } from "@/components/atoms";
import clsx from "clsx";

type SubNavbarSectionProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

export const SubNavbarSection: React.FC<SubNavbarSectionProps> = ({
  title,
  className,
  children,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(true);

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {title && (
        <Text
          sz="lg-1"
          weight="bold"
          className={clsx("p-2 pl-5 text-gradient-main")}
          onClick={() => setShowChildren(!showChildren)}
        >
          {title}
        </Text>
      )}
      {showChildren && <div className="animate-dropdown-slide">{children}</div>}
    </div>
  );
};
