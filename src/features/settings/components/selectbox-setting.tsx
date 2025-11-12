import React from "react";
import clsx from "clsx";
import { Option, Text, OptionKey, SelectBox } from "@/components/atoms";

interface SelectBoxSettingProps {
  options?: Option[];
  selectedOption?: string;
  onOptionChange?: (option: OptionKey) => void;
  className?: string;
  title?: string;
  selectBox?: React.ReactNode;
}

const SelectBoxSetting: React.FC<SelectBoxSettingProps> = ({
  options = [],
  selectedOption = "",
  onOptionChange = (e: OptionKey) => {},
  title,
  className,
  selectBox,
}) => {
  return (
    <div className={clsx("flex justify-between items-center w-full", className)}>
      <Text sz="lg-1" className="m-2">
        {title}
      </Text>
      {selectBox ? (
        selectBox
      ) : (
        <SelectBox
          className="!min-w-[170px]"
          selectedOption={selectedOption}
          options={options}
          onSelect={onOptionChange}
        />
      )}
    </div>
  );
};

export default SelectBoxSetting;
