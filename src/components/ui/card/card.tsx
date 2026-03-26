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
  return (
    <div
      className={clsx(
        "flex flex-col items-start bg-bg-second p-7 rounded-2xl shadow-lg",
        className,
      )}
    >
      <Text sz="lg-2" weight="bold" className={clsx(titleClassName)}>
        {title}
      </Text>
      <div className={clsx("w-full", childrenClassName)}>{children}</div>
    </div>
  );
};

export default Card;
