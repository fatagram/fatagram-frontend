import React from "react";
import { Text } from "@/components/atoms";
import clsx from "clsx";

interface CardProps {
  className?: string;
  titleClassName?: string;
  childrenClassName?: string;
  children?: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({
  className,
  children,
  title,
  titleClassName,
  childrenClassName,
}) => {
  const hasBg = className?.includes("bg-");
  const hasShadow = className?.includes("shadow-");
  const hasBorder = className?.includes("border");

  return (
    <div
      className={clsx(
        "flex flex-col items-start p-7 rounded-2xl",
        !hasBg && "bg-bg-second",
        !hasShadow && "shadow-none",
        !hasBorder && "border-none sm:border border-bg-fourth",
        className,
      )}
    >
      <Text sz="lg" weight="bold" className={clsx(titleClassName)}>
        {title}
      </Text>
      <div className={clsx("w-full", childrenClassName)}>{children}</div>
    </div>
  );
};

export default Card;
