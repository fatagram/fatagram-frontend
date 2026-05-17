import { useCallback, useRef } from "react";

export const useLongPress = (onLongPress: () => void, ms = 500) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      let x = 0;
      let y = 0;

      if ("touches" in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as React.MouseEvent).clientX;
        y = (e as React.MouseEvent).clientY;
      }

      startPosRef.current = { x, y };
      timerRef.current = setTimeout(() => {
        onLongPress();
        startPosRef.current = null;
      }, ms);
    },
    [onLongPress, ms],
  );

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPosRef.current = null;
  }, []);

  const move = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!timerRef.current || !startPosRef.current) return;

      let x = 0;
      let y = 0;

      if ("touches" in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = (e as React.MouseEvent).clientX;
        y = (e as React.MouseEvent).clientY;
      }

      const dx = x - startPosRef.current.x;
      const dy = y - startPosRef.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If moved more than 10px, it's a scroll/drag, cancel the long press
      if (distance > 10) {
        stop();
      }
    },
    [stop],
  );

  return {
    onMouseDown: start,
    onMouseMove: move,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchMove: move,
    onTouchEnd: stop,
  };
};
