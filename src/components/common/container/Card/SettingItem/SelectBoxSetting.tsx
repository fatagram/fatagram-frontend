import SelectBox from "@/components/common/ui/SelectBox";
import { Option, OptionKey } from "@/components/common/ui/SelectBox/SelectBox";
import Text from "@/components/common/ui/Text";
import React from "react";

interface SelectBoxSettingProps {
    options?: Option[];
    selectedOption?: string;
    onOptionChange?: (option: OptionKey) => void;
    className?: string;
    title?: string;
    selectBox?: React.ReactNode;
}

const SelectBoxSetting : React.FC<SelectBoxSettingProps> = ({
    options = [], 
    selectedOption = "", 
    onOptionChange = (e: OptionKey) => {}, 
    title, 
    className,
    selectBox}) => {

    return (
        <div className={`flex justify-between items-center w-full ${className}`}>
            <Text size="lg-1" className="m-2">{title}</Text>
            { selectBox ? selectBox :  
                <SelectBox className="!min-w-[170px]"
                    selectedOption={selectedOption} options={options} onSelect={onOptionChange} />}
        </div>  
    );
}

export default SelectBoxSetting;
