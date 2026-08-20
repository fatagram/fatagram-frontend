/// <reference types="vite/client" />

interface Window {
  __INITIAL_DATA__?: {
    isAuthenticated?: boolean;
    userData?: Record<string, unknown>;
  };
}

declare namespace React {
  namespace JSX {
    interface IntrinsicElements {
      "vite-streaming-end": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}
