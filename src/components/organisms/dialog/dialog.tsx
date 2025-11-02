import { Button, Text } from "@/components/atoms";
import React from "react";
import clsx from "clsx";

interface ButtonProps {
  text: string;
  onClick: () => void;
}

export interface DialogBoxProps {
  title?: string;
  content?: React.ReactNode;
  primaryButton?: ButtonProps;
  secondaryButton?: ButtonProps;
  tertiaryButton?: ButtonProps;
  onClose?: () => void;
  className?: string;
}

const Dialog: React.FC<DialogBoxProps> = ({
  title,
  content,
  primaryButton,
  secondaryButton,
  tertiaryButton,
  onClose,
  className,
}) => {
  return (
    <div
      className={clsx(
        "relative flex flex-col gap-4 bg-[var(--second-bg-color)]",
        "rounded-lg shadow-lg",
        className
      )}
    >
      {title && (
        <Text weight="bold" sz="lg-2">
          {title}
        </Text>
      )}
      {content && <div>{content}</div>}
      <div className="flex justify-end space-x-2">
        {tertiaryButton && (
          <Button onClick={tertiaryButton.onClick} variant="secondary" sz="sm-1">
            {tertiaryButton.text}
          </Button>
        )}
        {secondaryButton && (
          <Button onClick={secondaryButton.onClick} variant="secondary" sz="sm-1">
            {secondaryButton.text}
          </Button>
        )}
        {primaryButton && (
          <Button onClick={primaryButton.onClick} variant="primary" sz="sm-1">
            {primaryButton.text}
          </Button>
        )}
      </div>
      <Text
        className={clsx(
          "absolute top-3 right-5 text-[20px]",
          "text-gradient-main hover:text-single-main",
          "cursor-pointer"
        )}
        onClick={onClose}
      >
        <i className="fa-solid fa-xmark"></i>
      </Text>
    </div>
  );
};

export default Dialog;
