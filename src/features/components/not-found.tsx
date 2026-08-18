import { Text } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import React from "react";

interface NotFoundProps extends ComponentProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const NotFound: React.FC<NotFoundProps> = ({ icon, title, description, className }) => {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center gap-4 py-8 animate-fade-in",
        className,
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 text-primary-500 border-2 border-primary-500/20 shadow-sm">
        {typeof icon === "string" ? (
          <i className={clsx("text-2xl", icon)}></i>
        ) : (
          <div className="text-2xl flex items-center justify-center">{icon}</div>
        )}
      </div>

      <div className="flex flex-col items-center text-center gap-1 max-w-[280px]">
        <Text sz="lg" weight="bold" className="text-text-main font-semibold">
          {title}
        </Text>
        <Text sz="sm" wrap="whitespace-pre-wrap" className="text-text-third leading-relaxed">
          {description}
        </Text>
      </div>
    </div>
  );
};
