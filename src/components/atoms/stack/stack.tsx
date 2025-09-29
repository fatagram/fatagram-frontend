import { ComponentProps } from "@/components/common/types/component-type";
import React, { ElementType, useEffect, useState, useMemo, forwardRef } from "react";

interface StackProps extends ComponentProps {
  as?: ElementType;
  space?: number;
  direction?: "up" | "down" | "left" | "right";
  overflow?: "auto" | "hidden" | "visible" | "scroll";
  align?: "center" | "start" | "end";
  justify?: "center" | "start" | "end" | "between" | "around";
  wrap?: "wrap" | "nowrap" | "wrap-reverse";
  smProps?: Partial<StackProps>;
  mdProps?: Partial<StackProps>;
  lgProps?: Partial<StackProps>;
}

const buildClasses = (props: Partial<StackProps>, prefix: "" | "sm:" | "md:" | "lg:" = "") => {
  const classes: string[] = [];

  if (props.space !== undefined) classes.push(`${prefix}gap-${props.space}`);
  if (props.direction) {
    classes.push(
      props.direction === "up"
        ? `${prefix}flex-col-reverse`
        : props.direction === "down"
        ? `${prefix}flex-col`
        : props.direction === "left"
        ? `${prefix}flex-row-reverse`
        : `${prefix}flex-row`,
    );
  }

  if (props.overflow) classes.push(`${prefix}overflow-${props.overflow}`);
  if (props.align) classes.push(`${prefix}items-${props.align}`);
  if (props.justify) classes.push(`${prefix}justify-${props.justify}`);
  if (props.wrap) classes.push(`${prefix}flex-${props.wrap}`);
  if (props.className) {
    if (prefix) {
      classes.push(
        props.className
          .split(" ")
          .map((c) => prefix + c)
          .join(" "),
      );
    } else {
      classes.push(props.className);
    }
  }

  return classes.join(" ");
};

const Stack = forwardRef<HTMLElement, StackProps>(
  (
    {
      as: Component = "div",
      space,
      direction = "down",
      overflow = "auto",
      align = "center",
      justify = "start",
      wrap = "nowrap",
      className,
      smProps,
      mdProps,
      lgProps,
      children,
      ...props
    },
    ref,
  ) => {
    const baseClass = buildClasses({ space, direction, overflow, align, wrap, justify, className });
    const smClass = buildClasses(smProps || {}, "sm:");
    console.log("smClass", smClass);
    const mdClass = buildClasses(mdProps || {}, "md:");
    const lgClass = buildClasses(lgProps || {}, "lg:");

    return (
      <Component
        className={`flex ${baseClass} ${smClass} ${mdClass} ${lgClass}`}
        {...props}
        ref={ref}
      >
        {children}
      </Component>
    );
  },
);

export default Stack;
