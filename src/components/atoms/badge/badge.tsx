import { ComponentProps } from "@/components/common/types/component-type";
import clsx from "clsx";

interface BadgeProps extends ComponentProps {
  count?: number;
  ref?: React.Ref<HTMLDivElement> | undefined;
  onClick?: () => void;
}

export function Badge({
  count = 0,
  className = "",
  ref = null,
  onClick = () => {},
  children,
}: BadgeProps) {
  return (
    <div
      ref={ref}
      className={clsx(
        "relative flex items-center justify-center rounded-full bg-bg-second",
        "w-[48px] aspect-square text-text-main text-xl",
        "cursor-pointer hover:bg-bg-fourth transition-all duration-200 ease-in-out",
        "active:scale-95",
        className,
      )}
      onClick={onClick}
    >
      {children}
      {count > 0 && (
        <div
          className={clsx(
            "absolute -top-0 bg-red-500 text-text-main text-[10px] min-w-[16px]",
            "h-[16px] px-[4px] rounded-full border-[2px] border-bg-main",
            "flex items-center justify-center",
            count > 99 ? "-right-2" : "-right-1",
          )}
        >
          {count > 99 ? "99+" : count}
        </div>
      )}
    </div>
  );
}
