import React, { useEffect, useState } from "react";
import SelectBox from "@/components/common/ui/SelectBox";
import { Option, OptionKey } from "../../../../../components/common/ui/SelectBox/SelectBox";
import { Language, useLanguage } from "@/contexts/LanguageContext";
import { userConfigService } from "@/api/user/user-config.api";

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