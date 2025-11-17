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
    <div className="flex justify-between items-center w-full">
      <Text sz="lg-1" className="font-light m-2">
        {title}
      </Text>
      <div className="flex sm:items-center items-end gap-4 sm:flex-row flex-col">
        {editableMode === "inline" && isEdit ? (
          <div className="relative flex flex-col gap-1">
            <Textbox
              className={clsx("animate-fade-in px-2 py-1", {
                "mt-[5px]": isError,
              })}
              placeholder={placeholder}
              value={inputValue}
              isWrong={isError}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {isError && (
              <Text sz="sm-1" className="text-red-500 ml-2 h-[5px]">
                {errorMessage}
              </Text>
            )}
          </div>
        ) : (
          <Text sz="lg-1" className={clsx(valueClassName)}>
            {value ?? noDataValue}
          </Text>
        )}
        {canEdit && (
          <>
            {editableMode === "inline" && isEdit ? (
              <div className="animate-fade-in gap-1 flex">
                <Button
                  disabled={value === inputValue}
                  sz="sm-1"
                  variant="primary"
                  onClick={() => {
                    onSaveClick?.(inputValue);
                  }}
                >
                  <i className="fa-solid fa-floppy-disk mr-2"></i>
                  {t("settings:editableField.saveButton")}
                </Button>
                <Button
                  sz="sm-1"
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
                sz="sm-1"
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
