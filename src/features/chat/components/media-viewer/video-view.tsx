import { ComponentProps } from "@/components/common/component-type";
import { VideoMessage } from "../messages/video-message";
import clsx from "clsx";

interface VideoViewProps extends ComponentProps {
  url: string;
}

export const VideoView: React.FC<VideoViewProps> = ({ url, className }) => {
  return (
    <VideoMessage
      url={url}
      className={clsx(
        "min-h-[220px] min-w-[320px] rounded-lg",
        !className?.includes("max-h") && "max-h-[85vh]",
        !className?.includes("max-w") && "max-w-[90vw]",
        className,
      )}
    />
  );
};
