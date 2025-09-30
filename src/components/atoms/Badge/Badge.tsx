import { ComponentProps } from "@/components/common/types/component-type";

interface BadgeProps extends ComponentProps{
  count?: number;
  ref?: React.Ref<HTMLDivElement> | undefined;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  count = 0,
  className = "",
  ref = null,
  onClick = () => {},
  children,
}) => {
  return (
    <div
      ref={ref}
      className={`relative flex items-center justify-center rounded-full bg-[var(--second-bg-color)] 
            w-[48px] aspect-square text-[var(--text-color)] text-xl
            cursor-pointer hover:bg-[var(--main-bg-color)] transition-all duration-200 ease-in-out
            active:bg-[var(--second-bg-color)] active:scale-95 ${className}`}
      onClick={onClick}
    >
      {children}
      {count > 0 && (
        <div
          className={`absolute -top-0 ${count > 99 ? "-right-2" : "-right-1"} bg-red-500 text-white text-[10px] min-w-[16px] 
                    h-[16px] px-[4px] rounded-full border-[2px] border-[var(--main-bg-color)] flex items-center justify-center`}
        >
          {count > 99 ? "99+" : count}
        </div>
      )}
    </div>
  );
};

export default Badge;
