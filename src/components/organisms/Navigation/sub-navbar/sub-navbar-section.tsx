import { useState } from "react";
import { Stack, Text } from "@/components/atoms";

type SubNavbarSectionProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const SubNavbarSection: React.FC<SubNavbarSectionProps> = ({ title, className, children }) => {
  const [showChildren, setShowChildren] = useState<boolean>(true);

  return (
    <Stack space={2} className={`${className}`}>
      {title && (
        <Text
          sz="lg-1"
          weight="bold"
          className="p-2 pl-5 text-gradient-main"
          onClick={() => setShowChildren(!showChildren)}
        >
          {title}
        </Text>
      )}
      {showChildren && <div className="animate-dropdown-slide">{children}</div>}
    </Stack>
  );
};

export default SubNavbarSection;
