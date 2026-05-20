import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { Button, Textbox, Text } from "@/components/atoms";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { List } from "@/components/ui/list";

interface EditableFieldProps {
  className?: string;
  valueClassName?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
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
  description,
  icon,
  iconClassName,
  value,
  placeholder,
  valueClassName,
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
    <div className="relative flex flex-col gap-1 w-full flex-1">
      <Textbox
        sz="sm"
        placeholder={placeholder}
        isWrong={isError}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full"
      />
      {isError && (
        <Text sz="sm" className="!text-red-500 ml-0 mt-1">
          {errorMessage}
        </Text>
      )}
    </div>
  );

  const actionButtons = (
    <div className="flex flex-row gap-2 mt-2 sm:mt-0 sm:w-auto w-full">
      <Button
        sz="sm"
        variant="fourth"
        onClick={() => onCancelClick?.()}
        className="flex-1 sm:flex-none whitespace-nowrap"
      >
        {t("settings:editableField.cancelButton")}
      </Button>
      <Button
        disabled={isSaveDisabled}
        sz="sm"
        variant="primary"
        onClick={() => onSaveClick?.(inputValue)}
        className="flex-1 sm:flex-none whitespace-nowrap"
      >
        <FontAwesomeIcon icon={faFloppyDisk} className="mr-2" />
        {t("settings:editableField.saveButton")}
      </Button>
    </div>
  );

  return (
    <>
      <List.Item
        title={title}
        description={description}
        icon={icon}
        iconClassName={iconClassName}
        value={<span className={clsx(valueClassName, "opacity-80")}>{value ?? noDataValue}</span>}
        onClick={canEdit && !isEdit ? onChangeClick : undefined}
        className={className}
        hideChevron={!canEdit || isEdit}
      >
        {canEdit && isInlineMode && isEdit && !isMobile && (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mt-3 bg-bg-third/30 p-3 rounded-xl border border-bg-fourth/50 animate-slide-up-in">
            {editForm}
            {actionButtons}
          </div>
        )}
      </List.Item>

      {canEdit && isInlineMode && isMobile && (
        <BottomSheet
          open={isEdit}
          onOpenChange={(open) => !open && onCancelClick?.()}
          trigger={<span className="hidden" />}
          title={title}
        >
          <div className="flex flex-col w-full px-4 pt-2 pb-6 gap-4">
            {editForm}
            <div className="w-full">{actionButtons}</div>
          </div>
        </BottomSheet>
      )}
    </>
  );
};

export default EditableField;
