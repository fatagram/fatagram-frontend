import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, TextArea, Text } from "@/components/atoms";

type EditableTextAreaProps = {
  className?: string; // ClassName of main component
  valueClassName?: string; // ClassName of value in component
  title?: string; // Title of EditableTextArea
  value?: string; // Initial value of EditableTextArea
  isEmpty?: boolean; //
  placeholder?: string;
  editableMode?: "inline" | "none";
  isEdit?: boolean;
  isError?: boolean;
  errorMessage?: string;
  valueType?: string;
  btnChildren?: React.ReactNode;
  noDataValue?: string;
  canEdit?: boolean;
  isLoading?: boolean; // Loading state for save button
  onChangeClick?: () => void;
  onSaveClick?: (value: string | undefined) => void;
  onCancelClick?: () => void;
};

const EditableTextArea: React.FC<EditableTextAreaProps> = ({
  editableMode = "none",
  title,
  value,
  placeholder,
  valueClassName,
  btnChildren,
  isEdit,
  isError = false,
  errorMessage,
  noDataValue,
  canEdit = true,
  isLoading = false,
  onChangeClick,
  onSaveClick,
  onCancelClick,
}) => {
  const [inputValue, setInputValue] = React.useState<string | undefined>(value);
  const { t } = useTranslation() as { t: (key: string) => string };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="flex justify-between items-center w-full">
      {title && (
        <Text sz="lg" className="font-light">
          {title}
        </Text>
      )}
      <div className="flex items-center gap-1 flex-col w-full">
        {editableMode === "inline" && isEdit ? (
          <div className="relative flex flex-col gap-1 w-full">
            <TextArea
              className={clsx("animate-fade-in ", isError && "mt-[5px]")}
              placeholder={placeholder}
              value={inputValue}
              isWrong={isError}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {isError && (
              <Text sz="sm" className="text-red-500 ml-2 h-[5px]">
                {errorMessage}
              </Text>
            )}
          </div>
        ) : (
          <Text sz="lg" className={clsx(valueClassName, "select-auto")} wrap="whitespace-pre-wrap">
            {value ?? noDataValue}
          </Text>
        )}
        {canEdit && (
          <>
            {editableMode === "inline" && isEdit ? (
              <div className="animate-fade-in gap-1 flex w-full">
                <Button
                  disabled={value === inputValue || isLoading}
                  sz="sm"
                  variant="primary"
                  onClick={() => {
                    onSaveClick?.(inputValue);
                  }}
                  className="flex-1"
                >
                  <i className="fa-solid fa-floppy-disk mr-2"></i>
                  {t("settings:editableField.saveButton")}
                </Button>
                <Button
                  sz="sm"
                  variant="fourth"
                  onClick={() => {
                    onCancelClick?.();
                  }}
                  className="flex-1"
                >
                  {t("settings:editableField.cancelButton")}
                </Button>
              </div>
            ) : (
              <Button
                sz="sm"
                variant="fourth"
                onClick={() => {
                  onChangeClick?.();
                }}
                className="w-full"
              >
                {btnChildren}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EditableTextArea;
