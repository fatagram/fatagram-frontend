import Button from "@/components/common/ui/Button";
import Label from "@/components/common/ui/Label";
import Textbox from "@/components/common/ui/Textbox";
import React, { useEffect } from "react";

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

    useEffect(() => {
        setInputValue(isEmpty ? "" : value ?? "");
    }, [isEmpty, isEdit, value]);

    return (
        <div className="flex-wrap lg:flex justify-between items-center w-full">
            <p className="text-lg font-light m-2">{title}</p>
            <div className="flex items-center gap-4">
                {editableMode === "inline" && isEdit ? 
                    <div className="relative flex flex-col gap-1">
                        <Textbox className={`animate-fade-in px-2 py-1 ${isError && "mt-[5px]"}`} placeholder={placeholder} value={inputValue}
                            isWrong={isError} 
                            onChange={(e) => setInputValue(e.target.value)}/>
                        {isError && <Label className="!text-[13px] text-red-500 ml-2 h-[5px]">{errorMessage}</Label>}
                    </div>
                     :
                    <Label size="large" className={`${valueClassName}`}>{value}</Label>
                }
                {editableMode === "inline" && isEdit ?
                    <div className="animate-fade-in lg:flex flex-wrap gap-1">
                        <Button disabled={value === inputValue} size="small" variant="primary" onClick={() => {onSaveClick?.(inputValue);}}>
                            <i className="fa-solid fa-floppy-disk mr-2"></i>Save
                        </Button>
                        <Button size="small" variant="secondary" onClick={() => {onCancelClick?.();}}>
                            Cancel
                        </Button>
                    </div> :
                    <Button size="small" variant="secondary" onClick={() => {onChangeClick?.();}}>{btnChildren}</Button> 
                }
            </div>
        </div>
    )
}

export default EditableField;