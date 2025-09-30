import React from "react";
import styles from "./Checkbox.module.css";
import { ComponentProps } from "@/components/common/types/component-type";

// CheckboxProps interface
interface CheckboxProps extends ComponentProps {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

// Checkbox component
// This component is a checkbox component that can be used in the application.
const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled,
  className,
  ...props
}) => {
  return (
    <label
      className={`relative inline-flex items-start gap-[0.1rem] select-none checkbox ${className || ""}`}
    >
      <input
        {...props}
        disabled={disabled}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`relative invisible mr-[5px] w-[18px] h-[18px] peer`}
      />
      <span
        className={`absolute z-[2] rounded-[4px] m-[3px] w-[18px] h-[18px] ${styles["checkmark"]} bg-gradient-main
                after:absolute after:invisible after:content-["✓"] after:text-[0.8rem] after:w-[18px] after:h-[18px] after:top-1/2 after:left-1/2
                after:-translate-x-1/2 after:-translate-y-1/2 after:m-0 after:text-white after:rounded-[4px] 
                after:text-center after:leading-[18px] after:z-[3] after:opacity-[0.3] after:transition-opacity after:duration-[0.1s]
                before:absolute before:content-[""] before:w-[13px] before:h-[13px] before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
                before:m-0 before:rounded-[3px] before:bg-[var(--second-bg-color)] before:z-[2]
                peer-checked:after:visible peer-checked:after:opacity-100`}
      ></span>
      <span className={`text-single-second text-[1.0rem] ${className}`}>{label}</span>
    </label>
  );
};

export default Checkbox;
