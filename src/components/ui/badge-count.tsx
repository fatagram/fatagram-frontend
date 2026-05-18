import React from "react";

type Size = "xs" | "sm" | "md" | "lg";

export type BadgeCountProps = {
  count?: number | null;
  showZero?: boolean;
  max?: number;
  size?: Size;
  variant?: "primary" | "accent" | "neutral";
  className?: string;
  dot?: boolean;
  ariaLabel?: string;
};

const sizeClasses: Record<Size, string> = {
  xs: "h-4 min-w-4 text-[10px] px-1",
  sm: "h-5 min-w-[1.25rem] text-xs px-1.5",
  md: "h-6 min-w-[1.5rem] text-sm px-2",
  lg: "h-8 min-w-8 text-sm px-2.5",
};

function bgFor(variant: BadgeCountProps["variant"]) {
  switch (variant) {
    case "accent":
      return "rgb(var(--secondary-500))";
    case "neutral":
      return "rgba(var(--text-reverse-main), 0.12)";
    case "primary":
    default:
      return "rgb(var(--btn-main))";
  }
}

export const BadgeCount: React.FC<BadgeCountProps> = ({
  count = null,
  showZero = false,
  max = 99,
  size = "md",
  variant = "primary",
  className = "",
  dot = false,
  ariaLabel,
}) => {
  if (dot) {
    const dotSize = size === "lg" ? 3 : size === "md" ? 2.5 : size === "sm" ? 2 : 1.5;
    return (
      <span
        className={`inline-block rounded-full border-2 border-bg-main ${className}`}
        style={{
          width: `${dotSize}rem`,
          height: `${dotSize}rem`,
          background: bgFor(variant),
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
        }}
        aria-hidden={false}
        aria-label={ariaLabel ?? "badge"}
      />
    );
  }

  if (count === null || count === undefined || (count === 0 && !showZero)) return null;

  const display = typeof count === "number" && count > max ? `${max}+` : String(count);

  return (
    <span
      role="status"
      aria-label={ariaLabel ?? `count: ${display}`}
      className={`inline-flex items-center justify-center rounded-full font-medium text-white leading-none select-none border-2 border-bg-main ${sizeClasses[size]} ${className}`}
      style={{
        background: bgFor(variant),
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      }}
    >
      {display}
    </span>
  );
};

export default BadgeCount;
