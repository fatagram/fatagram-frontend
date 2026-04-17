import { createContext, useCallback, useContext, useState } from "react";

type MediaViewerContextType = {
  onOpen: (options: { url: string; type: "image" | "video"; conversationId: string }) => void;
  onClose: () => void;
  conversationId: string | null;
  media: {
    url: string;
    type: "image" | "video";
  } | null;
};

interface MediaViewerProviderProps {
  children: React.ReactNode;
}

const MediaViewerContext = createContext<MediaViewerContextType>({
  onOpen: () => {},
  onClose: () => {},
  conversationId: null,
  media: null,
});

export const MediaViewerProvider: React.FC<MediaViewerProviderProps> = ({ children }) => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [media, setMedia] = useState<{ url: string; type: "image" | "video" } | null>(null);

  const onOpen = useCallback(
    (options: { url: string; type: "image" | "video"; conversationId: string }) => {
      setConversationId(options.conversationId);
      setMedia({ url: options.url, type: options.type });
    },
    [],
  );

  const onClose = useCallback(() => {
    setMedia(null);
    setConversationId(null);
  }, []);

  return (
    <MediaViewerContext.Provider value={{ onOpen, onClose, conversationId, media }}>
      {children}
    </MediaViewerContext.Provider>
  );
};

export function useMediaViewer() {
  const context = useContext(MediaViewerContext);
  if (context === undefined) {
    throw new Error("useMediaViewer must be used within a MediaViewerProvider");
  }
  return context;
}
