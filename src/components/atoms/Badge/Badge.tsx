import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

export const sizeClasses = {
  // Mini sizes
  "xs": "w-[24px]",

  // Small sizes
  "sm-1": "w-[45px]",
  "sm-2": "w-[56px]",
  "sm-3": "w-[64px]",

  // Medium sizes
  "md-1": "w-[96px]",
  "md-2": "w-[112px] ",
  "md-3": "w-[128px]",

  // Large sizes
  "lg-1": "w-[160px]",
  "lg-2": "w-[192px]",
  "lg-3": "w-[224px]",

  // Extra Large
  "xl-1": "w-[256px]",
  "xl-2": "w-[288px]",
  "xl-3": "w-[320px]",
} as const;

interface BadgeProps extends ComponentProps{
  count?: number;
  ref?: React.Ref<HTMLDivElement> | undefined;
  onClick?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  count = 0,
  className = "",
  sz = "sm-1",
  ref = null,
  onClick = () => {},
  children,
}) => {
  return (
    <div
      ref={ref}
      className={clsx(
        'relative flex items-center justify-center rounded-full bg-bg-second',
        sizeClasses[sz],
        'aspect-square text-text-main text-xl',
        'cursor-pointer hover:bg-bg-fourth transition-all duration-200 ease-in-out',
        'active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {children}
      {count > 0 && (
        <div
          className={clsx(
            'absolute -top-0 bg-red-500 text-text-main text-[10px] min-w-[16px]',
            'h-[16px] px-[4px] rounded-full border-[2px] border-bg-main',
            'flex items-center justify-center',
            count > 99 ? '-right-2' : '-right-1'
          )}
        >
          {count > 99 ? "99+" : count}
        </div>
      )}
    </div>
  );
};

export default Badge;
