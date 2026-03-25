import { Button } from "@/components/atoms";

interface SocialButtonProps {
  icon?: string;
  name?: string;
  onClick?: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ icon, name, onClick }) => {
  return (
    <Button
      variant="fourth"
      className="flex gap-2 flex-1 items-center justify-center"
      onClick={onClick}
      sz="sm-1"
    >
      <img src={icon} alt={name} className="w-5 h-5" />
      <span className="hidden sm:inline">{name}</span>
    </Button>
  );
};
