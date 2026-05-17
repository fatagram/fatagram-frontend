import { ComponentProps } from "@/components/common/component-type";
import React from "react";
import clsx from "clsx";

interface FooterProps extends ComponentProps {}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={clsx("text-center text-text-third text-sm py-4", className)}>
      © {new Date().getFullYear()} Fawe. All rights reserved.
    </footer>
  );
};
