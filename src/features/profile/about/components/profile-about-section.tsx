import Text from "@/components/atoms/text";

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
    <div className={`${className}`}>
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
