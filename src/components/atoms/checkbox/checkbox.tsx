import React from "react";
import styles from "./checkbox.module.css";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

// CheckboxProps interface
interface CheckboxProps extends ComponentProps {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isWrong?: boolean;
}

// Checkbox component
// This component is a checkbox component that can be used in the application.
export const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  isWrong,
  className,
  ...props
}) => {
  const checkmarkClass = styles["checkmark"];

  return (
    <label className={clsx("relative inline-flex items-center gap-1 select-none", className)}>
      <input
        {...props}
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={clsx("relative invisible mr-[5px] w-[18px] h-[18px] peer", {
          "cursor-not-allowed": disabled,
          "text-red-500": isWrong,
        })}
      />
      <span
        className={clsx(
          "absolute z-[2] rounded-md m-[3px] w-[18px] h-[18px] bg-gradient-main",
          checkmarkClass,
          isWrong && "border border-danger",
          'after:absolute after:invisible after:content-["✓"] after:text-[0.8rem] after:w-[18px] after:h-[18px] after:top-1/2 after:left-1/2',
          "after:-translate-x-1/2 after:-translate-y-1/2 after:m-0 after:text-text-main after:rounded-md",
          "after:text-center after:leading-[18px] after:z-[3] after:opacity-[0.3] after:transition-opacity after:duration-[0.1s]",
          'before:absolute before:content-[""] before:w-3 before:h-3 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2',
          "before:m-0 before:rounded-sm before:bg-bg-second before:z-[2]",
          "peer-checked:after:visible peer-checked:after:opacity-100",
        )}
      />
      <span className={clsx("text-text-main text-sm", className)}>{label}</span>
    </label>
  );
};
