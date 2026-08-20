import { useEffect, useRef, useState } from "react";

type HeightTransitionProps = {
  show: boolean;
  duration?: number;
  children: React.ReactNode;
  fade?: boolean;
};

export default function HeightTransition({
  show,
  children,
  duration = 150,
  fade = true,
}: Readonly<HeightTransitionProps>) {
  const mainRef = useRef<HTMLDivElement>(null);
  const [maxHeight, setMaxHeight] = useState<string>(show ? "none" : "0px");
  const [isVisible, setIsVisible] = useState<boolean>(show);

  useEffect(() => {
    if (!mainRef.current) {
      return;
    }
    const element = mainRef.current;
    const measuredHeight = element.scrollHeight;

    if (show) {
      setIsVisible(true);
      setMaxHeight(measuredHeight + "px");
    } else {
      setIsVisible(false);
      setMaxHeight("0px");
    }
  }, [show]);

  let opacity = 1;
  let transform = "none";

  if (fade) {
    opacity = show ? 1 : 0.5;
    transform = show ? "translateY(0)" : "translateY(-10px)";
  }

  return (
    <div
      ref={mainRef}
      style={{
        overflow: "hidden",
        maxHeight: maxHeight,
        transitionDuration: `${duration}ms`,
        opacity,
        transform,
        transitionProperty: fade ? "max-height, opacity, transform" : "max-height",
      }}
      aria-hidden={!isVisible}
    >
      {children}
    </div>
  );
}
