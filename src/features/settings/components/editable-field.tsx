import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Textbox, Text } from "@/components/atoms";

interface EditableFieldProps {
  className?: string;
  valueClassName?: string;
  title?: string;
  value?: string;
  placeholder?: string;
  editableMode?: "inline" | "none";
  isEdit?: boolean;
  isError?: boolean;
  errorMessage?: string;
  btnChildren?: React.ReactNode;
  noDataValue?: string;
  canEdit?: boolean;
  onChangeClick?: () => void;
  onSaveClick?: (value: string | undefined) => void;
  onCancelClick?: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
  className,
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
    <div
      className={clsx(
        "flex flex-col sm:flex-row sm:justify-between sm:items-center w-full",
        className,
      )}
    >
      <Text sz="lg" className="font-semibold mb-0">
        {title}
      </Text>
      <div className="flex sm:items-center items-end gap-4 justify-between">
        {editableMode === "inline" && isEdit ? (
          <div className="relative flex flex-col gap-1">
            <Textbox sz="sm" placeholder={placeholder} isWrong={isError} type={"text"} />
            {isError && (
              <Text sz="sm" className="text-red-500 ml-2 h-[5px]">
                {errorMessage}
              </Text>
            )}
          </div>
        ) : (
          <Text sz="lg" className={clsx(valueClassName)}>
            {value ?? noDataValue}
          </Text>
        )}
        {canEdit && (
          <>
            {editableMode === "inline" && isEdit ? (
              <div className="animate-fade-in gap-1 flex">
                <Button
                  disabled={value === inputValue}
                  sz="sm"
                  variant="primary"
                  onClick={() => {
                    onSaveClick?.(inputValue);
                  }}
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

export default EditableField;
