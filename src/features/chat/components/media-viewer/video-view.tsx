import { ComponentProps } from "@/components/common/component-type";
import { VideoMessage } from "../messages/video-message";

interface VideoViewProps extends ComponentProps {
  url: string;
}

export const VideoView: React.FC<VideoViewProps> = ({ url, className }) => {
  return (
    <VideoMessage
      url={url}
      className={["max-h-[85vh] max-w-[90vw] min-h-[220px] min-w-[320px] rounded-lg", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
};
