import React from "react";
import clsx from "clsx";
import { Drawer } from "vaul";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxHeight?: string;
  className?: string;
}

export function BottomSheet({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  maxHeight = "max-h-[80dvh]",
  className,
}: BottomSheetProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      (document.activeElement as HTMLElement)?.blur();
    }
    onOpenChange(nextOpen);
  };

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>

      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 bg-black/40 z-[100] touch-none select-none cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(false);
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenChange(false);
          }}
        />

        <Drawer.Content
          className={clsx(
            "bg-bg-card flex flex-col rounded-t-[16px]",
            "fixed bottom-0 left-0 right-0 z-[101]",
            "outline-none shadow-2xl",
            "[&[data-state=open]]:!duration-[100ms]",
            "[&[data-state=closed]]:!duration-[150ms]",
            maxHeight,
            className,
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <Drawer.Description className="sr-only">
            {description || title || "Dialog"}
          </Drawer.Description>

          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-border-main mt-4 mb-2" />
          <Drawer.Title
            className={clsx(
              title
                ? "px-4 pt-4 pb-2 font-semibold text-lg text-text-primary text-center"
                : "sr-only",
            )}
          >
            {title || "Dialog"}
          </Drawer.Title>

          <div className="overflow-y-auto flex-1">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
