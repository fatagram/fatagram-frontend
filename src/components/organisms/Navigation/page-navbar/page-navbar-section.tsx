import { useState } from "react";
import { Stack, Text } from "@/components/atoms";

type PageNavbarSectionProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const PageNavbarSection: React.FC<PageNavbarSectionProps> = ({ title, className, children }) => {
  const [showChildren, setShowChildren] = useState<boolean>(true);

  return (
    <Stack align="start" space={2} className={`w-full ${className}`}>
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
      {showChildren && <div className="w-full animate-dropdown-slide">{children}</div>}
    </Stack>
  );
};

export default PageNavbarSection;
