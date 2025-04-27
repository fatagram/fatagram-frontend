import Button from "@/components/common/ui/Button";
import Text from "@/components/common/ui/Text";
import Textbox from "@/components/common/ui/Textbox";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface EditableFieldProps {
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
    onChangeClick?: () => void;
    onSaveClick?: (value: string) => void;
    onCancelClick?: () => void;
}

const EditableField: React.FC<EditableFieldProps> = ({
    editableMode="none", 
    title, 
    value, 
    isEmpty=false,
    placeholder,
    valueClassName, 
    btnChildren,
    isEdit,
    isError=false,
    errorMessage,
    onChangeClick,
    onSaveClick,
    onCancelClick}) => {

    const [inputValue, setInputValue] = React.useState<string>(isEmpty ? "" : value ?? "");
    const { t } = useTranslation() as { t: (key: string) => string };
    
    useEffect(() => {
        setInputValue(isEmpty ? "" : value ?? "");
    }, [isEmpty, isEdit, value]);

    return (
        <div className="flex justify-between items-center w-full">
            <Text size="lg" className="font-light m-2">{title}</Text>
            <div className="flex sm:items-center items-end gap-4 sm:flex-row flex-col">
                {editableMode === "inline" && isEdit ? 
                    <div className="relative flex flex-col gap-1">
                        <Textbox className={`animate-fade-in px-2 py-1 ${isError && "mt-[5px]"}`} placeholder={placeholder} value={inputValue}
                            isWrong={isError} 
                            onChange={(e) => setInputValue(e.target.value)}/>
                        {isError && <Text size="sm" className="text-red-500 ml-2 h-[5px]">{errorMessage}</Text>}
                    </div>
                     :
                    <Text size="lg" className={`${valueClassName}`}>{value}</Text>
                }
                {editableMode === "inline" && isEdit ?
                    <div className="animate-fade-in gap-1 flex">
                        <Button disabled={value === inputValue} size="small" variant="primary" onClick={() => {onSaveClick?.(inputValue);}}>
                            <i className="fa-solid fa-floppy-disk mr-2"></i>{t("settings:editableField.saveButton")}
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => {onCancelClick?.();}}>
                            {t("settings:editableField.cancelButton")}
                        </Button>
                    </div> :
                    <Button size="small" variant="secondary" onClick={() => {onChangeClick?.();}}>{btnChildren}</Button> 
                }
            </div>
        </div>
    )
}

export default EditableField;