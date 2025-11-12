import { ComponentProps } from "@/components/common/types/component-type";
import React from "react";
import clsx from "clsx";

interface FooterProps extends ComponentProps {}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={clsx("text-center text-[#d8d8d8] text-sm py-4", className)}>
      © {new Date().getFullYear()} Fatagram. All rights reserved.
    </footer>
  );
};
