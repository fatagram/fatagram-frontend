import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { BadgeCount } from "@/components/ui";

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
        <BadgeCount
          count={count}
          max={99}
          size="xs"
          variant="primary"
          className={clsx("absolute -top-0", count > 99 ? "-right-2" : "-right-1")}
        />
      )}
    </div>
  );
}
