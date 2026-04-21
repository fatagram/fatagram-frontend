import { MediaType, MessageMedia } from "@/types/entities/message.type";
import { createContext, useCallback, useContext, useState } from "react";

type MediaViewerContextType = {
  onOpen: (options: { id: string; url: string; type: MediaType; conversationId: string }) => void;
  onClose: () => void;
  conversationId: string | null;
  media: MessageMedia | null;
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
  const [media, setMedia] = useState<MessageMedia | null>(null);

  const onOpen = useCallback(
    (options: { id: string; url: string; type: MediaType; conversationId: string }) => {
      setConversationId(options.conversationId);
      setMedia({ id: options.id, url: options.url, type: options.type });
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
