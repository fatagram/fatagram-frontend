import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

interface ImageViewProps extends ComponentProps {
  url: string;
}

export const ImageView: React.FC<ImageViewProps> = ({ url, className }) => {
  return (
    <img
      src={url}
      alt="media-view"
      className={clsx("max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none", className)}
      draggable={false}
    />
  );
};
