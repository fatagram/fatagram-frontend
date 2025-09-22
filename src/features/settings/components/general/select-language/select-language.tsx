import React, { useEffect, useState } from "react";
import { Language, useLanguage } from "@/contexts/common/language-context";
import { userConfigService } from "@/api/user/user-config.api";
import SelectBox, { OptionKey, Option } from "@/components/atoms/selectbox/selectbox";

interface SelectLanguageProps {
    className?: string;
}

const SelectLanguage: React.FC<SelectLanguageProps> = ({className}) => {

    const [langs, setLangs] = useState<Option[]>([]);
    const { language, setLanguage, availableLanguages } = useLanguage();

    const selectLanguage = async (opt: OptionKey) => {
        setLanguage(opt as Language);
        await userConfigService.changeLanguage({ LanguageCode: opt as string });
        // ("Change language to ", opt);

        window.location.reload();
    }

    useEffect(() => {
        const options: Option[] = availableLanguages.map((lang) => ({ key: lang.language, value: lang.display }));
        setLangs(options)
    }, [availableLanguages])

    return (
        <SelectBox className={`${className}`} options={langs} 
            selectedOption={language}
            onSelect={selectLanguage}/>
    );
}

export default SelectLanguage;