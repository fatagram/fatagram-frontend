import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface AnimationType {
  in: string;
  out: string;
  duration: number;
}

export const AnimationLib: Record<string, AnimationType> = {
  Fade: {
    in: "animate-fade-in",
    out: "animate-fade-out",
    duration: 100,
  },
  SlideRightToLeft: {
    in: "animate-right-to-left-in",
    out: "animate-right-to-left-out",
    duration: 300,
  },
  SlideLeftToRight: {
    in: "animate-left-to-right-in",
    out: "animate-left-to-right-out",
    duration: 300,
  },
  DropdownSlide: {
    in: "animate-dropdown-slide-in",
    out: "animate-dropdown-slide-out",
    duration: 200,
  },
  None: {
    in: "",
    out: "",
    duration: 0,
  },
};

type TransitionProps = {
  animation?: AnimationType;
  show: boolean;
  children: React.ReactNode;
  timeout?: number;
  className?: string;
  duration?: number;
};

export default function Transition({
  animation = AnimationLib.None,
  show,
  children,
  className = "",
  duration,
}: TransitionProps) {
  const [render, setRender] = useState<boolean>(show);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animDuration = duration ?? animation.duration;

  useEffect(() => {
    if (show) {
      setRender(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      return;
    }

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setRender(false);
    }, animDuration);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setRender(false);
    }
  };

  if (!render) return null;

  return (
    <div
      className={clsx(className, show ? animation.in : animation.out)}
      onAnimationEnd={onAnimationEnd}
      style={{ animationDuration: animDuration + "ms" }}
    >
      {children}
    </div>
  );
}
