import { Text } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import React from "react";

interface NotFoundProps extends ComponentProps {
  icon: string;
  title: string;
  description: string;
}

export const NotFound: React.FC<NotFoundProps> = ({ icon, title, description, className }) => {
  return (
    <div
      className={clsx("flex flex-col items-center justify-center gap-4 animate-fade-in", className)}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-bg-third/50 text-text-third">
        <i className={icon}></i>
      </div>

      <div className="flex flex-col items-center gap-1">
        <Text sz="md" weight="bold" className="text-text-main text-base font-medium">
          {title}
        </Text>
        <Text
          sz="sm"
          wrap="whitespace-pre-wrap"
          className="text-text-main/60 text-sm text-text-fourth"
        >
          {description}
        </Text>
      </div>
    </div>
  );
};
