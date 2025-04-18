import SelectBox from "@/components/common/ui/SelectBox";
import { Option, OptionKey } from "@/components/common/ui/SelectBox/SelectBox";
import React from "react";

interface SelectBoxSettingProps {
    options: Option[];
    selectedOption: string;
    onOptionChange: (option: OptionKey) => void;
    className?: string;
    title?: string;
}

const SelectBoxSetting : React.FC<SelectBoxSettingProps> = ({options, selectedOption, onOptionChange, title, className}) => {

    return (
        <div className="flex justify-between items-center w-full">
            <p className="text-lg font-light m-2">{title}</p>
            <SelectBox className="!min-w-[170px]"
                selectedOption={selectedOption} options={options} onSelect={onOptionChange}></SelectBox>
        </div>  
    );
}

export default SelectBoxSetting;