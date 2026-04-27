import { useState, forwardRef, useImperativeHandle } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Text } from "@/components/atoms";
import clsx from "clsx";

export interface BackgroundMetadata {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UpdateBackgroundContentProps {
  imageSrc: string;
  className?: string;
}

export interface UpdateBackgroundContentRef {
  getMetadata: () => BackgroundMetadata;
}

// Icons cho tính năng Zoom (Thu phóng)
const ZoomOutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500 hover:text-gray-800 transition-colors"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

const ZoomInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-500 hover:text-gray-800 transition-colors"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    <line x1="11" y1="8" x2="11" y2="14"></line>
    <line x1="8" y1="11" x2="14" y2="11"></line>
  </svg>
);

export const UpdateBackgroundContent = forwardRef<
  UpdateBackgroundContentRef,
  UpdateBackgroundContentProps
>(({ imageSrc, className }, ref) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const onCropComplete = (_croppedAreaPercentage: Area, _croppedAreaPixels: Area) => {
    setCroppedArea(_croppedAreaPercentage);
  };

  useImperativeHandle(ref, () => ({
    getMetadata: () => ({
      x: croppedArea?.x || 0,
      y: croppedArea?.y || 0,
      width: croppedArea?.width || 100,
      height: croppedArea?.height || 100,
    }),
  }));

  return (
    <div className={clsx("flex flex-col gap-4 w-full bg-bg-main rounded-xl box-border", className)}>
      <div className="relative w-full h-[250px] sm:h-[300px] rounded-xl overflow-hidden bg-bg-fourth/50 shadow-inner border border-bg-fourth group">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={16 / 6}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          showGrid={true}
          style={{
            containerStyle: { borderRadius: "0.75rem", width: "100%", height: "100%" },
          }}
        />
        <Text className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 text-white text-xs font-medium rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none backdrop-blur-sm">
          Drag to reposition
        </Text>
      </div>

      <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between items-center px-1">
          <Text className="text-sm font-semibold">Zoom level</Text>
          <div className="text-xs font-bold text-primary-600 bg-primary-500/20 px-2.5 py-1 rounded-md ">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        <div className="flex items-center gap-3 bg-bg-fourth p-3.5 rounded-lg border border-bg-fourth/60 w-full box-border">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(1, z - 0.1))}
            className="p-1.5 shrink-0 hover:bg-bg-second hover:shadow-sm rounded-md transition-all active:scale-95"
            aria-label="Zoom out"
          >
            <ZoomOutIcon />
          </button>

          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.01}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 min-w-0 h-1.5 bg-bg-third rounded-lg appearance-none cursor-pointer accent-primary-500 transition-all  focus:ring-primary-700 focus:ring-offset-1"
          />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
            className="p-1.5 shrink-0 hover:bg-white hover:shadow-sm rounded-md transition-all active:scale-95"
            aria-label="Zoom in"
          >
            <ZoomInIcon />
          </button>
        </div>
      </div>
    </div>
  );
});

UpdateBackgroundContent.displayName = "UpdateBackgroundContent";
