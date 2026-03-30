import { Button } from "@/components/atoms";
import { ComponentProps } from "@/components/common/component-type";
import clsx from "clsx";
import { useState } from "react";
import InfiniteScrollFlex from "../utils/infinite-scroll-flex";

interface MultiSelectProps extends ComponentProps {
  options?: { item: any; value: any }[];
  defaultSelected?: { item: any; value: any }[];
  onLoadMore: () => void;
  hasMore: boolean;
  onAccept?: (selectedValues: any[], defaultSelected: any[]) => void;
  onCancel?: () => void;
  itemTemplate: (item: any, isSelected: boolean, index?: number) => React.ReactNode;
  selectItemTemplate: (item: any, onRemove: () => void, index?: number) => React.ReactNode;
  defaultItemTemplate: (item: any, onRemove: () => void, index?: number) => React.ReactNode;
  selectClassName?: string;
  optionClassName?: string;
  canRemoveDefaultSelected?: boolean;
  isLoading?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  className,
  options,
  defaultSelected: _defaultSelected,
  onLoadMore,
  hasMore,
  onAccept,
  onCancel,
  itemTemplate,
  selectItemTemplate,
  defaultItemTemplate,
  selectClassName,
  optionClassName,
  canRemoveDefaultSelected = false,
  isLoading,
}) => {
  const [selected, setSelected] = useState<{ item: any; value: any }[]>([]);
  const [defaultSelected, setDefaultSelected] = useState<{ item: any; value: any }[]>(
    _defaultSelected || [],
  );

  const handleRemoveSelected = (value: any) => {
    if (canRemoveDefaultSelected) {
      setDefaultSelected(defaultSelected.filter((s) => s.value !== value));
    }
    setSelected(selected.filter((s) => s.value !== value));
  };

  return (
    <div
      className={clsx(
        "flex flex-col gap-1 overflow-hidden",
        isLoading ? "opacity-50 cursor-not-allowed" : "",
        className,
      )}
    >
      <div className={clsx("mb-2 gap-4", selectClassName)}>
        {[...defaultSelected, ...selected].map((item, index) => {
          const isDefault = defaultSelected.some((s) => s.value === item.value);
          return (
            <div key={item.value} className="relative">
              {isDefault
                ? defaultItemTemplate(item.item, () => handleRemoveSelected(item.value), index)
                : selectItemTemplate(item.item, () => handleRemoveSelected(item.value), index)}
            </div>
          );
        })}
      </div>
      <div className={clsx("flex flex-col flex-1 gap-1 overflow-y-auto", optionClassName)}>
        <InfiniteScrollFlex
          items={options || []}
          onLoadMore={onLoadMore}
          hasMore={hasMore}
          itemKey={(item) => item.value}
          itemTemplate={(option, index) => {
            const isSelected =
              selected.some((s) => s.value === option.value) ||
              defaultSelected.some((s) => s.value === option.value);
            return (
              <div
                onClick={() => {
                  if (isLoading) return;
                  if (isSelected) {
                    setSelected(selected.filter((s) => s.value !== option.value));
                  } else {
                    setSelected([...selected, option]);
                  }
                }}
              >
                {itemTemplate ? itemTemplate(option.item, isSelected, index) : option.item}
              </div>
            );
          }}
        />
      </div>
      <div className="w-full flex gap-1 mt-2">
        <Button
          sz="sm"
          className="flex flex-1 items-center justify-center"
          onClick={() =>
            onAccept?.(
              selected.map((s) => s.value),
              defaultSelected.map((s) => s.value),
            )
          }
          disabled={isLoading}
        >
          {isLoading && (
            <div className="flex items-center justify-center mr-2">
              <div className="w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
            </div>
          )}
          Accept
        </Button>
        <Button
          sz="sm"
          className="flex flex-1 items-center justify-center"
          variant="fourth"
          onClick={onCancel}
          disabled={isLoading}
        >
          {isLoading && (
            <div className="flex items-center justify-center mr-2">
              <div className="w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
            </div>
          )}
          Cancel
        </Button>
      </div>
    </div>
  );
};
