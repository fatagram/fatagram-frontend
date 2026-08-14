import React from "react";
import clsx from "clsx";
import { Button, Text } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
("@/components/atoms");

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

export const Dialog: React.FC<DialogBoxProps> = ({
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
        "relative flex flex-col gap-4 bg-bg-second px-8 py-7",
        "rounded-2xl shadow-lg",
        className,
      )}
    >
      {title && (
        <Text weight="bold" sz="lg" className="shrink-0 pr-6">
          {title}
        </Text>
      )}
      {content && <div className="flex-1 min-h-0 flex flex-col">{content}</div>}
      <div className="flex justify-end space-x-2 shrink-0">
        {tertiaryButton && (
          <Button onClick={tertiaryButton.onClick} variant="third" sz="sm">
            {tertiaryButton.text}
          </Button>
        )}
        {secondaryButton && (
          <Button onClick={secondaryButton.onClick} variant="third" sz="sm">
            {secondaryButton.text}
          </Button>
        )}
        {primaryButton && (
          <Button onClick={primaryButton.onClick} variant="primary" sz="sm">
            {primaryButton.text}
          </Button>
        )}
      </div>
      <Text
        className={clsx(
          "absolute top-4 right-5 text-[20px]",
          "text-text-third hover:text-text-main transition-colors",
          "cursor-pointer z-10 p-1",
        )}
        onClick={onClose}
      >
        <FontAwesomeIcon icon={faXmark} />
      </Text>
    </div>
  );
};
