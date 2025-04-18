import React, { useEffect, useState } from "react";
import SelectBox from "@/components/common/ui/SelectBox";
import { Option, OptionKey } from "../../ui/SelectBox/SelectBox";
import { Language, useLanguage } from "@/contexts/LanguageContext";

interface SelectLanguageProps {
    className?: string;
}


const SelectLanguage: React.FC<SelectLanguageProps> = ({className}) => {

    const [langs, setLangs] = useState<Option[]>([]);
    const { language, setLanguage, availableLanguages } = useLanguage();

    const selectLanguage = (opt: OptionKey) => {
            setLanguage(opt as Language);
        }

    useEffect(() => {
        const options: Option[] = availableLanguages.map((lang) => ({ key: lang.language, value: lang.display }));
        setLangs(options)
    }, [availableLanguages])

    return (
        <SelectBox className={`${className} !min-w-[170px]`} options={langs} 
            selectedOption={language}
            onSelect={selectLanguage}/>
    );
}

export default SelectLanguage;