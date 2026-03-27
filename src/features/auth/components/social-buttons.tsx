import { useAuth } from "@/contexts/auth-context";
import { SocialButton } from "./social-button";
import { ComponentProps } from "@/components/common/component-type";

interface SocialButtonsProps extends ComponentProps {
  disabled?: boolean;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ disabled }) => {
  const { redirectToGoogle } = useAuth();
  return (
    <div className="flex gap-3 w-full">
      <SocialButton
        name="Google"
        icon="/svgs/google-icon.svg"
        onClick={redirectToGoogle}
        disabled={disabled}
      />
      <SocialButton name="Facebook" icon="/svgs/facebook-icon.svg" disabled={true} />
    </div>
  );
};
