import React from "react";
import { Option, OptionKey } from "@/components/atoms";
import { SmartSelectBox } from "@/components/ui/smart-select-box";
import { List } from "@/components/ui/list";

interface SelectBoxSettingProps {
  options?: Option[];
  selectedOption?: string;
  onOptionChange?: (option: OptionKey) => void;
  className?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconClassName?: string;
  selectBox?: React.ReactNode;
}

const SelectBoxSetting: React.FC<SelectBoxSettingProps> = ({
  options = [],
  selectedOption = "",
  onOptionChange = () => {},
  title,
  description,
  icon,
  iconClassName,
  className,
  selectBox,
}) => {
  return (
    <List.Item
      title={title}
      description={description}
      icon={icon}
      iconClassName={iconClassName}
      className={className}
      hideChevron={true}
      rightIcon={
        selectBox ? (
          selectBox
        ) : (
          <SmartSelectBox
            showTitle={false}
            title={title}
            className="!min-w-[170px]"
            selectedOption={selectedOption}
            options={options}
            onSelect={(e) => onOptionChange(e)}
          />
        )
      }
    />
  );
};

export default SelectBoxSetting;
