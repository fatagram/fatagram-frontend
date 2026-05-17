import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

export interface AnimationType {
  in: string;
  out: string;
  duration: number;
}

export enum AnimationName {
  SoftFade = "SoftFade",
  Fade = "Fade",
  SlideRightToLeft = "SlideRightToLeft",
  SlideRightToLeftFull = "SlideRightToLeftFull",
  SlideLeftToRight = "SlideLeftToRight",
  SlideLeftToRightFull = "SlideLeftToRightFull",
  DropdownSlide = "DropdownSlide",
  SlideUp = "SlideUp",
  Opacity = "Opacity",
  SlideSnappy = "SlideSnappy",
  None = "None",
}

export const AnimationLib: Record<AnimationName, AnimationType> = {
  SoftFade: {
    in: "animate-soft-fade-in",
    out: "animate-soft-fade-out",
    duration: 100,
  },
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
  SlideRightToLeftFull: {
    in: "animate-slide-in-right-full",
    out: "animate-slide-out-left-full",
    duration: 300,
  },
  SlideLeftToRight: {
    in: "animate-left-to-right-in",
    out: "animate-left-to-right-out",
    duration: 300,
  },
  SlideLeftToRightFull: {
    in: "animate-slide-in-left-full",
    out: "animate-slide-out-right-full",
    duration: 300,
  },
  DropdownSlide: {
    in: "animate-dropdown-slide-in",
    out: "animate-dropdown-slide-out",
    duration: 200,
  },
  SlideUp: {
    in: "animate-slide-up-in",
    out: "animate-slide-up-out",
    duration: 200,
  },
  Opacity: {
    in: "animate-opacity-in",
    out: "animate-opacity-out",
    duration: 300,
  },
  SlideSnappy: {
    in: "animate-slide-in-right",
    out: "animate-slide-out-left",
    duration: 250,
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
  style?: React.CSSProperties;
};

export default function Transition({
  animation = AnimationLib.None,
  show,
  children,
  className = "",
  duration,
  style,
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

  const onAnimationEnd = (e: React.AnimationEvent) => {
    if (e.target !== e.currentTarget) return;

    // Ignore ending events of IN animations when we are transitioning out
    const animName = e.animationName.toLowerCase();
    if (animName.includes("in")) {
      return;
    }

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
      style={{ animationDuration: animDuration + "ms", ...style }}
    >
      {children}
    </div>
  );
}
