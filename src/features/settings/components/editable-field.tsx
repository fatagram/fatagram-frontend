import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Textbox, Text } from "@/components/atoms";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

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
  onSaveClick?: (value: string) => void;
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
  isEdit = false,
  isError = false,
  errorMessage,
  noDataValue,
  canEdit = true,
  onChangeClick,
  onSaveClick,
  onCancelClick,
}) => {
  const [inputValue, setInputValue] = useState<string>(value ?? "");
  const { t } = useTranslation();
  const isMobile = useMobile();

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const isInlineMode = editableMode === "inline";
  const isSaveDisabled = value === inputValue;

  const editForm = (
    <div className="relative flex flex-col gap-1 w-full ">
      <Textbox
        sz="sm"
        placeholder={placeholder}
        isWrong={isError}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      {isError && (
        <Text sz="sm" className="!text-red-500 ml-0">
          {errorMessage}
        </Text>
      )}
    </div>
  );

  const actionButtons = (
    <div className="flex flex-nowrap gap-1 w-full">
      <Button
        disabled={isSaveDisabled}
        sz="sm"
        variant="primary"
        onClick={() => onSaveClick?.(inputValue)}
        className="flex-1 whitespace-nowrap"
      >
        <FontAwesomeIcon icon={faFloppyDisk} className="mr-2"  />
        {t("settings:editableField.saveButton")}
      </Button>
      <Button
        sz="sm"
        variant="fourth"
        onClick={() => onCancelClick?.()}
        className="flex-1 whitespace-nowrap"
      >
        {t("settings:editableField.cancelButton")}
      </Button>
    </div>
  );

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

      <div className="flex sm:items-center gap-4 justify-between">
        {(!isEdit || (isEdit && isMobile)) && (
          <Text sz="lg" className={clsx(valueClassName)}>
            {value ?? noDataValue}
          </Text>
        )}

        {canEdit && (
          <>
            {isInlineMode && isEdit && !isMobile && (
              <div className="flex justify-center gap-1 items-center">
                {editForm}
                {actionButtons}
              </div>
            )}

            {isInlineMode && isMobile && (
              <BottomSheet
                open={isEdit}
                onOpenChange={(open) => !open && onCancelClick?.()}
                trigger={<span className="hidden" />}
                title={title}
              >
                <div className="flex flex-col w-full px-2 pt-2 pb-4 gap-2">
                  {editForm}
                  {actionButtons}
                </div>
              </BottomSheet>
            )}

            {!(isInlineMode && isEdit && !isMobile) && (
              <Button sz="sm" variant="fourth" onClick={() => onChangeClick?.()}>
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
