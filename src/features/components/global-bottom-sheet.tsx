import { BottomSheet } from "@/components/ui/bottom-sheet";
import { useBottomSheetStore } from "../hooks/use-bottom-sheet-store";

export function GlobalBottomSheet() {
  const { isOpen, content, title, closeSheet } = useBottomSheetStore();

  return (
    <BottomSheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeSheet();
        }
      }}
      trigger={null}
      title={title}
    >
      {content}
    </BottomSheet>
  );
}
