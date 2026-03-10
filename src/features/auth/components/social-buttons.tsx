import { useAuth } from "@/contexts/auth-context";
import { SocialButton } from "./social-button";

export const SocialButtons: React.FC = () => {
  const { redirectToGoogle } = useAuth();
  return (
    <div className="flex gap-3 w-full">
      <SocialButton
        name="Google"
        icon="src/assets/svgs/google-icon.svg"
        onClick={redirectToGoogle}
      />
      <SocialButton name="Facebook" icon="src/assets/svgs/facebook-icon.svg" />
    </div>
  );
};
