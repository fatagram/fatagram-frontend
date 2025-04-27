import { ErrorCodes } from "@/api/user/dto/change_name.dto";
import { UserService } from "@/api/user/user.api";
import Button from "@/components/common/ui/Button";
import Text, { TextSkeletonLoading } from "@/components/common/ui/Text";
import Textbox from "@/components/common/ui/Textbox";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ChangeNameFormProps {
    className?: string
}

const ChangeNameForm: React.FC<ChangeNameFormProps> = ({ className }) => {

    const [oldFirstName, setOldFirstName] = React.useState<string>("");
    const [oldLastName, setOldLastName] = React.useState<string>("");
    const [firstName, setFirstName] = React.useState<string>("");
    const [lastName, setLastName] = React.useState<string>("");
    const [firstNameFailed, setFirstNameFailed] = React.useState<boolean>(false);
    const [lastNameFailed, setLastNameFailed] = React.useState<boolean>(false);
    const [errorMessage, setErrorMessage] = React.useState<string>("");

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const navigate = useNavigate();
    const { t } = useTranslation() as { t: (key: string) => string };
    const { userId } = useAuth();

    const userService = React.useMemo(() => {
        return new UserService();
    }, []);

    // Close change name form
    const handleClose = () => {
        navigate("/settings/account");
    };

    const handleSubmit = async () => {
        const response = await userService.UpdateName({ firstName, lastName });
        if (response.success) {
            navigate("/settings/account", { state: { reload: true } });
        }
        else {
            const errorCode = response?.errorCodes?.[0] || response.errorCode;
            if (errorCode)
            {
                setErrorMessage(t(ErrorCodes[errorCode].message));
                setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
                setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
            }
            else {
                setErrorMessage(t(ErrorCodes["UNKNOWN_ERROR"].message));
                setFirstNameFailed(false);
                setLastNameFailed(false);
            }
        }
    }

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            const response = await userService.GetProfile(userId ?? "", "firstName,lastName");
            if (response.success) {
                setFirstName(response.data.infos.firstName);
                setLastName(response.data.infos.lastName);
                setOldFirstName(response.data.infos.firstName);
                setOldLastName(response.data.infos.lastName);
            }
            setIsLoading(false);
        }
        setErrorMessage("");
        setFirstNameFailed(false);
        setLastNameFailed(false);
        fetchProfile();
    }, [userService, userId]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:pt-0 pt-10">
            <div className="animate-fade-in  relative flex flex-col justify-center bg-[var(--bg-color-secondary)] rounded-2xl shadow-lg px-10 py-8">
                <Text size="lg-3" className="pb-6 px-2 text-gradient-main !font-bold">{t("settings:account.personalInfo.changeNameForm.title")}</Text>
                { isLoading ? <TextSkeletonLoading className="h-[50px]"/> : 
                    <div>
                        <div className="animate-fade-in flex flex-wrap gap-7 justify-center w-full rounded-2xl bg-[var(--bg-color)] p-5">
                            <div className="flex flex-col">
                                <Text size="md-2" className="ml-2 mb-1">{t("settings:account.personalInfo.changeNameForm.firstName")}</Text>
                                <Textbox isWrong={firstNameFailed} value={firstName} placeholder="First name" className="py-1 px-2 lg:max-w-[200px]"
                                    onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <Text size="md-2" className="ml-2 mb-1">{t("settings:account.personalInfo.changeNameForm.lastName")}</Text>
                                <Textbox isWrong={lastNameFailed} value={lastName} placeholder="Last name" className="py-1 px-2 lg:max-w-[200px]"
                                    onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                        </div>
                        <Text size="md" color="danger" className="mt-2 mx-4">{errorMessage}</Text>
                    </div>
                }
                <Text className="mx-8 mt-8 mb-4 h-[0.5px] bg-[var(--third-single-color)]"></Text>
                <Text size="sm-2" className="font-light px-2 mb-4 flex flex-col gap-1">
                    <Text weight="bold" className="text-[var(--second-single-color)]">* {t("settings:account.personalInfo.changeNameForm.note")}:</Text>
                    <Text className="opacity-80">- {t("settings:account.personalInfo.changeNameForm.noteText1")} &nbsp;
                        <Text weight="bold" className="text-[var(--main-single-color)]">7 {t("settings:account.personalInfo.changeNameForm.day")}</Text>.
                    </Text>
                    <Text className="opacity-80">- {t("settings:account.personalInfo.changeNameForm.noteText2")}</Text>
                    <Text className="opacity-80">- {t("settings:account.personalInfo.changeNameForm.noteText3")} &nbsp;
                        <Text size="md">!, #, $, @, ...</Text>.
                    </Text>
                </Text>
                <Button disabled={firstName === oldFirstName && lastName === oldLastName} size="medium" className="mt-2 !text-[20px]"
                    onClick={handleSubmit}
                >{t("settings:account.personalInfo.changeNameForm.acceptButton")}</Button>
                <Text size="lg-2" className={`absolute top-5 right-8 hover:text-[var(--main-single-color)] cursor-pointer`}
                    onClick={handleClose}><i className="fa-solid fa-xmark"></i></Text>
            </div>
        </div>
    );
};

export default ChangeNameForm;