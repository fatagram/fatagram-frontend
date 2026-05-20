import React from "react";
import clsx from "clsx";
import { Text } from "@/components/atoms";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

interface ListProps {
  children?: React.ReactNode;
  className?: string;
  cardClassName?: string;
  title?: string;
  description?: string;
}

const ListSection: React.FC<ListProps> = ({
  children,
  className,
  cardClassName,
  title,
  description,
}) => {
  return (
    <div className={clsx("flex flex-col w-full mb-6", className)}>
      <div
        className={clsx(
          "flex flex-col",
          "bg-transparent sm:bg-bg-main sm:rounded-2xl sm:border sm:border-bg-fourth/80 sm:shadow-sm",
          cardClassName,
        )}
      >
        {(title || description) && (
          <div className="flex flex-col px-0 sm:px-6 pt-4 pb-2">
            {title && (
              <Text sz="lg" weight="bold" className="text-text-main mb-1">
                {title}
              </Text>
            )}
            {description && (
              <Text sz="sm" className="text-text-third" wrap="whitespace-normal">
                {description}
              </Text>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

interface ListItemProps {
  icon?: React.ReactNode;
  iconClassName?: string;
  title: string;
  description?: string;
  value?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  hideChevron?: boolean;
}

const ListItem: React.FC<ListItemProps> = ({
  icon,
  iconClassName,
  title,
  description,
  value,
  rightIcon,
  onClick,
  className,
  children,
  hideChevron = false,
}) => {
  const isClickable = !!onClick;
  const Wrapper = isClickable ? "button" : "div";

  return (
    <div className="flex flex-col w-full relative">
      <Wrapper
        onClick={onClick}
        className={clsx(
          "flex items-center justify-between px-0 sm:px-6 py-4 w-full text-left transition-colors",
          isClickable &&
            "hover:bg-bg-third/30 active:bg-bg-third/50 cursor-pointer sm:first-of-type:rounded-t-2xl sm:last-of-type:rounded-b-2xl",
          className,
        )}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {icon && (
            <div
              className={clsx(
                "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                iconClassName || "bg-primary-500/10 text-primary-500",
              )}
            >
              {icon}
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0 justify-center">
            <Text sz="md" weight="medium" className="text-text-main mb-0" wrap="whitespace-normal">
              {title}
            </Text>
            {description && (
              <Text sz="sm" className="text-text-third mb-0 mt-0.5" wrap="whitespace-normal">
                {description}
              </Text>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          {value && (
            <div className="text-text-second text-sm sm:text-md truncate max-w-[150px] sm:max-w-[200px]">
              {value}
            </div>
          )}
          {rightIcon && rightIcon}
          {isClickable && !hideChevron && !rightIcon && (
            <FontAwesomeIcon icon={faChevronRight} className="text-text-fourth text-sm" />
          )}
        </div>
      </Wrapper>
      {children && <div className="flex flex-col px-0 sm:px-6 pb-4 w-full">{children}</div>}
      <div className="absolute bottom-0 left-16 sm:left-[80px] right-0 h-[1px] bg-bg-fourth/50 last-of-type:hidden" />
    </div>
  );
};

export const List = Object.assign(ListSection, { Item: ListItem });
