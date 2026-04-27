import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, TextArea, Text } from "@/components/atoms";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BottomSheet } from "@/components/ui/bottom-sheet";

type EditableTextAreaProps = {
  className?: string;
  valueClassName?: string;
  title?: string;
  value?: string;
  isEmpty?: boolean;
  placeholder?: string;
  editableMode?: "inline" | "none";
  isEdit?: boolean;
  isError?: boolean;
  errorMessage?: string;
  valueType?: string;
  btnChildren?: React.ReactNode;
  noDataValue?: string;
  canEdit?: boolean;
  isLoading?: boolean;
  onSaveClick?: (value: string | undefined) => void;
  onOpenChange: (isOpen: boolean) => void;
};

const EditableTextArea: React.FC<EditableTextAreaProps> = ({
  editableMode = "none",
  title,
  value,
  placeholder,
  valueClassName,
  btnChildren,
  isEdit = false,
  isError = false,
  errorMessage,
  noDataValue,
  canEdit = true,
  isLoading = false,
  onSaveClick,
  onOpenChange,
}) => {
  const { t } = useTranslation() as { t: (key: string) => string };
  const [inputValue, setInputValue] = useState<string | undefined>(value);

  const matches = useMediaQuery("(max-width: 640px)");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isMobile = mounted ? matches : false;

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const isInlineMode = editableMode === "inline";
  const isSaveDisabled = value === inputValue || isLoading;

  const editForm = (
    <div className="relative flex flex-col gap-1 w-full px-2 pt-2 pb-4">
      <TextArea
        className={clsx("animate-fade-in", isError && "mt-[5px]")}
        placeholder={placeholder}
        value={inputValue}
        isWrong={isError}
        onChange={(e) => setInputValue(e.target.value)}
        rows={2}
      />
      {isError && (
        <Text sz="sm" className="text-red-500 ml-2 h-[5px]">
          {errorMessage}
        </Text>
      )}
    </div>
  );

  const actionButtons = (
    <div className="animate-fade-in flex gap-2 w-full px-2 pb-2">
      <Button
        disabled={isSaveDisabled}
        sz="sm"
        variant="primary"
        onClick={() => onSaveClick?.(inputValue)}
        className="flex-1"
      >
        <i className="fa-solid fa-floppy-disk mr-2" />
        {t("settings:editableField.saveButton")}
      </Button>
      <Button sz="sm" variant="fourth" onClick={() => onOpenChange(false)} className="flex-1">
        {t("settings:editableField.cancelButton")}
      </Button>
    </div>
  );

  return (
    <div className="flex justify-between items-center w-full">
      {title && (
        <Text sz="lg" className="font-light">
          {title}
        </Text>
      )}

      <div className="flex items-center gap-1 flex-col w-full">
        {(!isEdit || (isEdit && isMobile)) && (
          <Text sz="lg" className={clsx(valueClassName, "select-auto")} wrap="whitespace-pre-wrap">
            {value ?? noDataValue}
          </Text>
        )}

        {isInlineMode && isEdit && !isMobile && (
          <>
            {editForm}
            {actionButtons}
          </>
        )}

        {isInlineMode && isMobile && (
          <BottomSheet
            open={isEdit}
            onOpenChange={onOpenChange}
            trigger={<span className="hidden" />}
            title={title}
          >
            {editForm}
            {actionButtons}
          </BottomSheet>
        )}

        {canEdit && !(isInlineMode && isEdit && !isMobile) && (
          <Button sz="sm" variant="fourth" onClick={() => onOpenChange(true)} className="w-full">
            {btnChildren}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditableTextArea;
