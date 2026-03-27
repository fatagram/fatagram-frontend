import { Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";

interface SocialButtonProps extends ComponentProps {
  icon?: string;
  name?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, name, onClick, disabled }) => {
  return (
    <Button
      variant="fourth"
      className="flex gap-2 flex-1 items-center justify-center"
      onClick={onClick}
      sz="sm-1"
      disabled={disabled}
    >
      <img src={icon} alt={name} className="w-5 h-5" />
      <span className="hidden sm:inline">{name}</span>
    </Button>
  );
};
