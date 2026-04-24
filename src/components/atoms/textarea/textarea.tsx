import {
  ChangeEvent,
  forwardRef,
  ReactNode,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
} from "react";
import clsx from "clsx";
import styles from "./textarea.module.css";
import { ComponentProps } from "@/components/common/component-type";

export type Size = "sm" | "md" | "lg" | "xl";

const sizeClasses: Record<Size, { mainText: string; titleText: string }> = {
  sm: { mainText: "px-2 py-2 text-sm", titleText: "text-sm" },
  md: { mainText: "px-2 py-3 text-base", titleText: "text-base" },
  lg: { mainText: "px-3 py-5 text-lg", titleText: "text-lg" },
  xl: { mainText: "px-4 py-6 text-xl", titleText: "text-xl" },
};

export interface TextAreaProps extends ComponentProps<HTMLTextAreaElement> {
  title?: string;
  isRequired?: boolean;
  isWrong?: boolean;
  wrongMessage?: string;
  wrapperClassName?: string;
  containerClassName?: string;
  topContent?: ReactNode;
  topContentClassName?: string;
  placeholder?: string;
  sz?: Size;
  maxRows?: number;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      isWrong = false,
      wrongMessage,
      title,
      isRequired = false,
      className,
      containerClassName,
      sz = "md",
      wrapperClassName,
      topContent,
      topContentClassName,
      placeholder,
      disabled,
      value,
      onChange,
      rows = 1,
      maxRows,
      ...props
    },
    ref,
  ) => {
    const inputId = useId();
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const styleCache = useRef<{ lineHeight: number; paddingY: number; borderY: number } | null>(
      null,
    );

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref],
    );

    const autoResize = useCallback(() => {
      const textarea = innerRef.current;
      if (!textarea) return;

      if (!styleCache.current) {
        const compStyle = window.getComputedStyle(textarea);
        styleCache.current = {
          lineHeight: parseFloat(compStyle.lineHeight) || 20,
          paddingY:
            (parseFloat(compStyle.paddingTop) || 0) + (parseFloat(compStyle.paddingBottom) || 0),
          borderY:
            (parseFloat(compStyle.borderTopWidth) || 0) +
            (parseFloat(compStyle.borderBottomWidth) || 0),
        };
      }

      const { lineHeight, paddingY, borderY } = styleCache.current;

      textarea.style.height = "0px";

      const minHeight = rows * lineHeight + paddingY + borderY;
      const maxHeight =
        maxRows && maxRows > 0
          ? maxRows * lineHeight + paddingY + borderY
          : Number.POSITIVE_INFINITY;

      const nextHeight = Math.min(Math.max(textarea.scrollHeight + borderY, minHeight), maxHeight);

      textarea.style.height = `${nextHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [maxRows, rows]);

    useLayoutEffect(() => {
      autoResize();
    }, [autoResize, value]);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      autoResize();
      onChange?.(event);
    };

    return (
      <div className={clsx(wrapperClassName, "flex flex-col gap-1")}>
        {title && (
          <label
            htmlFor={inputId}
            className={clsx("flex items-center gap-1 ml-1 font-medium", sizeClasses[sz].titleText)}
          >
            {title}
            {isRequired && <span className="text-red-400">*</span>}
          </label>
        )}

        <div
          className={clsx(
            "w-full border-[2px] text-text-main",
            "font-normal rounded-xl transition-all duration-300 ease-out",
            "focus-within:bg-gradient-main-move",
            {
              "bg-bg-main opacity-60 cursor-not-allowed": disabled,
              [styles["my-textarea-wrong"]]: isWrong && !disabled,
              [styles["my-textarea"]]: !isWrong && !disabled,
            },
            containerClassName,
            className,
          )}
        >
          {topContent && <div className={clsx(topContentClassName)}>{topContent}</div>}

          <textarea
            id={inputId}
            ref={setRefs}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            rows={rows}
            className={clsx(
              "w-full bg-transparent text-text-main resize-none",
              "outline-none caret-primary-500 selection:!bg-primary-600",
              "rounded-b-[inherit]",
              "block",
              { "pt-0": rows > 0 },
              sizeClasses[sz].mainText,
              styles["custom-scrollbar"],
            )}
            enterKeyHint="enter"
            {...props}
          />
        </div>

        {isWrong && wrongMessage && (
          <span className="text-red-400 text-sm ml-1">{wrongMessage}</span>
        )}
      </div>
    );
  },
);

TextArea.displayName = "TextArea";
