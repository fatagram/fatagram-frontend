import { MiniButton, TextArea } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import { useAuth } from "@/contexts";
import { useSendMessage } from "@/features/hooks/use-message";
import { useMessageCacheMutations } from "@/features/hooks/use-message-store";
import { useChatUpload } from "@/features/hooks/use-chat-upload";
import { MediaType, MessageType } from "@/types/entities/message.type";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "@/contexts";
import { getMediaTypeFromFileType, MAX_FILE_SIZE, validateFileSize } from "@/utils/file";
import { compressImage, compressVideo } from "@/utils/compression";

interface ChatInputProps extends ComponentProps {
  conversationId?: string;
  correlationId?: string;
  receiverId?: string;
  onFocus?: () => void;
  onAfterSend?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  conversationId,
  correlationId,
  receiverId,
  onFocus,
  onAfterSend,
  className,
}) => {
  const [hasInput, setHasInput] = useState(false);
  const [fileUrls, setFileUrls] = useState<{ url: string; file: File }[]>([]);
  const textboxRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { fetch: send } = useSendMessage();
  const { addMessageToCache } = useMessageCacheMutations();
  const { userId } = useAuth();
  const { upload, loading: _uploading } = useChatUpload();
  const { t } = useTranslation();
  const { showSnackbar } = useSnackbar();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasInput(e.target.value.trim() !== "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    const content = textboxRef.current?.value.trim() || "";

    if (!content && fileUrls.length === 0) {
      return;
    }

    const baseBody = {
      conversationId,
      correlationId,
      receiverId,
    };

    const basePreviewBody = {
      conversationId: conversationId || "",
      senderId: userId,
      status: "pending" as const,
      content,
      createdAt: new Date(),
      sequenceNumber: -1,
      isGroup: false,
    };

    const currentFiles = [...fileUrls];
    if (textboxRef.current) {
      textboxRef.current.value = "";
      try {
        // collapse textarea to its initial height after send
        textboxRef.current.style.height = "0px";
        textboxRef.current.style.overflowY = "hidden";
      } catch (e) {
        // ignore if DOM manipulation isn't allowed
      }
    }
    setFileUrls([]);
    setHasInput(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onAfterSend?.();
      });
    });

    const imageMedia = currentFiles.filter(
      (it) => getMediaTypeFromFileType(it.file.type) === MediaType.Image,
    );
    const otherMedia = currentFiles.filter(
      (it) => getMediaTypeFromFileType(it.file.type) !== MediaType.Image,
    );

    // Preserve original media types for otherMedia (audio/video/file)
    // since Cloudinary returns "video" for both audio and video
    const otherMediaTypes = otherMedia.map((it) => getMediaTypeFromFileType(it.file.type));

    const tempOtherMediaIds = otherMedia.map(() => crypto.randomUUID());
    let tempTextId = "";
    let tempImageId = "";

    if (imageMedia.length > 0) {
      tempImageId = crypto.randomUUID();
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempImageId,
        clientTempId: tempImageId,
        type: MessageType.Media,
        media: imageMedia.map((it) => ({
          url: it.url,
          type: getMediaTypeFromFileType(it.file.type),
          metadata: { name: it.file.name, size: it.file.size },
        })),
      });
    }

    for (let i = 0; i < otherMedia.length; i++) {
      const it = otherMedia[i];
      const tempId = tempOtherMediaIds[i];
      const url = URL.createObjectURL(it.file);
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempId,
        clientTempId: tempId,
        type: MessageType.Media,
        media: [
          {
            url,
            type: getMediaTypeFromFileType(it.file.type),
            metadata: { name: it.file.name, size: it.file.size },
          },
        ],
      });
    }
    if (content && content.trim() !== "") {
      tempTextId = crypto.randomUUID();
      addMessageToCache(conversationId || "", {
        ...basePreviewBody,
        id: tempTextId,
        clientTempId: tempTextId,
        type: MessageType.Text,
      });
    }

    if (imageMedia.length > 0) {
      try {
        const image = await upload(imageMedia.map((it) => it.file));
        await send({
          ...baseBody,
          clientTempId: tempImageId,
          content: "",
          type: MessageType.Media,
          media: image.map((url) => ({
            url: url.url,
            type: MediaType.Image,
            metadata: { name: url.original_filename, size: url.bytes },
          })),
        });
      } catch (error) {
        console.error("Error uploading images:", error);
      }
    }

    if (otherMedia.length > 0) {
      const otherMediaUrls = await upload(otherMedia.map((it) => it.file));
      for (let i = 0; i < otherMedia.length; i++) {
        const url = otherMediaUrls[i];
        await send({
          ...baseBody,
          clientTempId: tempOtherMediaIds[i],
          content: "",
          type: MessageType.Media,
          media: [
            {
              url: url.url,
              type: otherMediaTypes[i],
              metadata: { name: url.original_filename, size: url.bytes },
            },
          ],
        });
      }
    }

    if (content && content.trim() !== "") {
      await send({
        ...baseBody,
        clientTempId: tempTextId,
        content,
        type: MessageType.Text,
      });
    }

    fileUrls.forEach((it) => URL.revokeObjectURL(it.url));
    setFileUrls([]);
  };

  const handleSelectFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newItems: { url: string; file: File }[] = [];

      for (const file of fileArray) {
        const sizeValidation = validateFileSize(file, MAX_FILE_SIZE);
        if (!sizeValidation.valid) {
          showSnackbar(
            t("chat.upload.fileTooLarge", {
              fileName: file.name,
              maxSize: "50MB",
            }),
            "error",
          );
          continue;
        }

        let fileToAdd = file;
        if (file.type.startsWith("image/")) {
          try {
            fileToAdd = await compressImage(file, 1920, 1920, 0.8);
          } catch (error) {
            console.error("Error compressing image:", error);
            showSnackbar(t("chat.upload.compressionError", { fileName: file.name }), "error");
            continue;
          }
        } else if (file.type.startsWith("video/")) {
          try {
            fileToAdd = await compressVideo(file, {
              maxWidth: 1280,
              maxHeight: 720,
              videoBitsPerSecond: 900_000,
            });
          } catch (error) {
            console.error("Error compressing video:", error);
            showSnackbar(t("chat.upload.compressionError", { fileName: file.name }), "error");
          }
        }

        newItems.push({ url: URL.createObjectURL(fileToAdd), file: fileToAdd });
      }

      if (newItems.length > 0) {
        setFileUrls((prev) => [...prev, ...newItems]);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const renderFilePreview = (it: { url: string; file: File }) => {
    const type = getMediaTypeFromFileType(it.file.type);

    switch (type) {
      case MediaType.Image:
        return <img src={it.url} alt="preview" className="h-16 w-16 object-cover rounded-xl" />;
      case MediaType.Video:
        return (
          <div className="h-16 w-16 bg-black rounded-xl flex items-center justify-center relative">
            <i className="fa-solid fa-video text-white/50 text-xl"></i>
            <video
              src={it.url}
              className="absolute inset-0 h-full w-full object-cover opacity-30 rounded-xl"
            />
          </div>
        );
      case MediaType.Audio:
        return (
          <div className="h-16 w-32 bg-primary-100 rounded-xl flex flex-col items-center justify-center px-2">
            <i className="fa-solid fa-microphone text-primary-500 mb-1"></i>
            <span className="text-[10px] truncate w-full text-center">{it.file.name}</span>
          </div>
        );
      default:
        return (
          <div className="h-16 w-32 bg-bg-main border border-border-main rounded-xl flex flex-col items-center justify-center px-2">
            <i className="fa-solid fa-file-lines text-primary-500 mb-1"></i>
            <span className="text-[10px] truncate w-full text-center">{it.file.name}</span>
          </div>
        );
    }
  };

  return (
    <div className={clsx("flex flex-col w-full bg-bg-third", className)} ref={containerRef}>
      <div className="w-full flex items-end gap-1">
        <input
          type="file"
          ref={imageInputRef}
          className="hidden"
          multiple
          accept="image/*"
          onChange={handleSelectFiles}
        />

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept="video/*,audio/*,.pdf,.doc,.docx,.zip,.rar"
          onChange={handleSelectFiles}
        />

        <MiniButton
          onClick={() => fileInputRef.current?.click()}
          onPointerDown={(e) => e.preventDefault()}
        >
          <i className="fa-solid fa-paperclip text-primary-500"></i>
        </MiniButton>

        <MiniButton
          onClick={() => imageInputRef.current?.click()}
          onPointerDown={(e) => e.preventDefault()}
        >
          <i className="fa-solid fa-image text-primary-500"></i>
        </MiniButton>

        <TextArea
          sz="sm"
          className="!rounded-2xl"
          wrapperClassName="flex-1 min-w-0"
          placeholder="Tin nhắn của bạn"
          onKeyDown={handleKeyDown}
          ref={textboxRef}
          onChange={handleInputChange}
          rows={0}
          maxRows={5}
          onFocus={() => {
            onFocus?.();
          }}
          topContent={
            <>
              {fileUrls.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto py-2 px-2">
                  {fileUrls.map((it) => (
                    <div key={it.url} className="relative group flex-shrink-0">
                      {renderFilePreview(it)}
                      <button
                        type="button"
                        className={clsx(
                          "absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5",
                          "flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity",
                        )}
                        onClick={() => {
                          URL.revokeObjectURL(it.url);
                          setFileUrls((prev) => prev.filter((u) => u.url !== it.url));
                        }}
                      >
                        <i className="fa-solid fa-xmark text-[10px]"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          }
        />

        <MiniButton
          onClick={handleSendMessage}
          disabled={!hasInput && fileUrls.length === 0}
          onPointerDown={(e) => e.preventDefault()}
        >
          <i className="fa-solid fa-paper-plane text-primary-500"></i>
        </MiniButton>
      </div>
    </div>
  );
};
