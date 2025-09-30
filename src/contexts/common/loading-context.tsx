import LoadingPage from "@/pages/loading/loading-page";
import React, { use, useCallback, useContext, useMemo, useState } from "react";

type LoadingContextType = {
  increment: () => void;
  decrement: () => void;
};

const LoadingContext = React.createContext<LoadingContextType>({
  increment: () => {},
  decrement: () => {},
});

type LoadingProviderProps = {
  children: React.ReactNode;
};

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  // const [isLoading, setIsLoading] = useState<boolean>(true);
  const [count, setCount] = useState(1);

  const stableIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);
  const stableDecrement = useCallback(() => {
    setCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = useMemo(
    () => ({
      increment: stableIncrement,
      decrement: stableDecrement,
    }),
    [stableIncrement, stableDecrement],
  );

  return (
    <LoadingContext.Provider value={value}>
      {count > 0 && <LoadingPage />}
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  return useContext(LoadingContext);
};

export default LoadingContext;
