import React from "react";
import { Text } from "@/components/atoms";
import clsx from "clsx";

interface CardProps {
  className?: string;
  titleClassName?: string;
  children?: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ className, children, title, titleClassName }) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-start bg-bg-second p-7 rounded-2xl shadow-lg",
        className,
      )}
    >
      <Text sz="lg-2" weight="bold" className={clsx("mb-5", titleClassName)}>
        {title}
      </Text>
      {children}
    </div>
  );
};

export default Card;
