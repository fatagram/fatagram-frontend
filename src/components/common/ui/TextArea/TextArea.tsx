import React from "react";
import styles from "./TextArea.module.css";
import { Size } from "../styles/size";

const sizeClasses: Record<Size, string> = {
  "xs": 'px-2 py-1 text-xs min-h-16',
  "sm-1": 'px-3 py-1 text-[16px] min-h-24',   
  "sm-2": 'px-4 py-2 text-[13px] min-h-24',
  "sm-3": 'px-5 py-2 text-[13px] min-h-24',
  "md-1": 'px-6 py-3 text-base min-h-28',
  "md-2": 'px-7 py-3 text-base min-h-28',
  "md-3": 'px-8 py-4 text-base min-h-32',
  "lg-1": 'px-8 py-4 text-base min-h-32',
  "lg-2": 'px-9 py-4 text-base min-h-32',
  "lg-3": 'px-10 py-5 text-base min-h-32',
  "xl-1": 'px-10 py-5 text-xl min-h-32',
  "xl-2": 'px-12 py-6 text-2xl min-h-32',
  "xl-3": 'px-14 py-7 text-3xl min-h-32',
};

interface TextAreaProps {
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  value?: string;
  disabled?: boolean;
  isWrong?: boolean;
  autoComplete?: string;
  name?: string;
  size?: Size;
  ref?: React.Ref<HTMLTextAreaElement>;
  className?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  placeholder,
  onChange,
  value,
  disabled = false,
  isWrong = false,
  className = "",
  ref,
  size = "sm-1",
  autoComplete = "off",
  name = "",
  ...props
}) => {
  return (
    <textarea
      ref={ref}
      name={name}
      value={value}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onChange={onChange}
      disabled={disabled}
      className={`border-[3px] bg-[var(--second-bg-color)] text-[var(--text-color)]
        resize-none
          ${disabled ? `bg-[var(--main-bg-color)]` : `focus:bg-gradient-main-move`}
        font-normal rounded-[15px] outline-none text-lg caret-single-main
        ${sizeClasses[size]}
        ${isWrong ? styles['my-textarea-wrong'] : styles['my-textarea']}
        ${className}`}
      {...props}
    />
  );
};

export default TextArea;
