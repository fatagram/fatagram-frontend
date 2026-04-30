import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";

interface ImageViewProps extends ComponentProps {
  url: string;
}

import { useMediaBlob } from "@/hooks/use-media-blob";

export const ImageView: React.FC<ImageViewProps> = ({ url, className }) => {
  const { blobUrl } = useMediaBlob(url);
  return (
    <img
      src={blobUrl || url}
      alt="media-view"
      className={clsx("max-h-[85vh] max-w-[90vw] object-contain rounded-lg select-none", className)}
      draggable={false}
    />
  );
};
