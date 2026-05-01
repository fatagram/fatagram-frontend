import { useCallback, useEffect, useRef } from "react";

interface UseTypingProps {
  onStart: () => void;
  onStop: () => void;
  debounceTime: number;
  startDelay?: number;
}

export const useTyping = ({ onStart, onStop, debounceTime, startDelay = 1000 }: UseTypingProps) => {
  const isTypingRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startDelayRef = useRef<NodeJS.Timeout | null>(null);
  const onStartRef = useRef(onStart);
  const onStopRef = useRef(onStop);

  useEffect(() => {
    onStartRef.current = onStart;
    onStopRef.current = onStop;
  }, [onStart, onStop]);

  const stopTyping = useCallback(() => {
    if (startDelayRef.current) {
      clearTimeout(startDelayRef.current);
      startDelayRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (isTypingRef.current) {
      onStopRef.current();
      isTypingRef.current = false;
    }
  }, []);

  const handleTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isTypingRef.current) {
      if (!startDelayRef.current) {
        startDelayRef.current = setTimeout(() => {
          startDelayRef.current = null;
          isTypingRef.current = true;
          onStartRef.current();
        }, startDelay);
      }
    }

    timeoutRef.current = setTimeout(() => {
      if (startDelayRef.current) {
        clearTimeout(startDelayRef.current);
        startDelayRef.current = null;
      }
      if (isTypingRef.current) {
        onStopRef.current();
        isTypingRef.current = false;
      }
    }, debounceTime);
  }, [startDelay, debounceTime]);

  useEffect(() => {
    return () => {
      if (startDelayRef.current) clearTimeout(startDelayRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { handleTyping, stopTyping };
};
