import Text from "@/components/atoms/text";
import clsx from "clsx";

type ProfileAboutSectionProps = {
  title?: string;
  className?: string;
  children?: React.ReactNode;
};

const ProfileAboutSection: React.FC<ProfileAboutSectionProps> = ({
  title,
  className,
  children,
}) => {
  return (
    <div className={clsx(className)}>
      {title && (
        <Text sz="lg-1" weight="bold">
          {title}
        </Text>
      )}
      {children}
    </div>
  );
};

export default ProfileAboutSection;
