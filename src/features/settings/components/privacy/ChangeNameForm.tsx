import { ErrorMessages } from "@/api/user/dto/change_name.dto";
import { UserService } from "@/api/user/user.api";
import Button from "@/components/common/ui/Button";
import Label, { LabelSkeletonLoading } from "@/components/common/ui/Label";
import Textbox from "@/components/common/ui/Textbox";
import React, { useEffect } from "react";
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

    const userService = React.useMemo(() => {
        return new UserService();
    }, []);

    const handleClose = () => {
        navigate("/settings/account");
    };

    const handleSubmit = async () => {
        const response = await userService.UpdateName({ firstName, lastName });
        if (response.success) {
            navigate("/settings/account", { state: { reload: true } });
        }
        else {
            const errorCode = response?.errorCodes?.[0];
            setErrorMessage(errorCode !== undefined ? ErrorMessages[errorCode].message : "An error occurred");
            if (errorCode !== undefined && ErrorMessages[errorCode].type === "FirstName")
                setFirstNameFailed(true);
            else if (errorCode !== undefined && ErrorMessages[errorCode].type === "LastName")
                setLastNameFailed(true);
            else {
                setFirstNameFailed(false);
                setLastNameFailed(false);
            }
        }
    }

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await userService.GetProfile(localStorage.getItem("userId") ?? "", "firstName,lastName");
            if (response.success) {
                setFirstName(response.data.infos.firstName);
                setLastName(response.data.infos.lastName);
                setOldFirstName(response.data.infos.firstName);
                setOldLastName(response.data.infos.lastName);
            }
            else {
                console.log(response.errorCodes);
            }
            setIsLoading(false);
        }
        setErrorMessage("");
        setFirstNameFailed(false);
        setLastNameFailed(false);
        fetchProfile();
    }, [userService]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="animate-fade-in  relative flex flex-col justify-center bg-[var(--bg-color-secondary)] rounded-2xl shadow-lg px-10 py-8">
                <Label size="xxlarge" className="pb-6 px-2 text-gradient-main !font-bold">Name</Label>
                { isLoading ? <LabelSkeletonLoading className="h-[50px]"/> : 
                    <div>
                        <div className="animate-fade-in flex flex-wrap gap-7 justify-center w-full rounded-2xl bg-[var(--bg-color)] p-5">
                            <div className="flex flex-col">
                                <Label size="medium-2" className="ml-2 mb-1">First name</Label>
                                <Textbox isWrong={firstNameFailed} value={firstName} placeholder="First name" className="py-1 px-2 lg:max-w-[200px]"
                                    onChange={(e) => setFirstName(e.target.value)}/>
                            </div>
                            <div className="flex flex-col">
                                <Label size="medium-2" className="ml-2 mb-1">Last name</Label>
                                <Textbox isWrong={lastNameFailed} value={lastName} placeholder="Last name" className="py-1 px-2 lg:max-w-[200px]"
                                    onChange={(e) => setLastName(e.target.value)}/>
                            </div>
                        </div>
                        <Label size="medium-2" className="text-[red] mt-2">{errorMessage}</Label>
                    </div>
                }
                <span className="mx-8 mt-8 mb-4 h-[0.5px] bg-[var(--third-single-color)]"></span>
                <p className="text-[14px] font-light px-2 mb-4 flex flex-col gap-1">
                    <span className="text-[var(--second-single-color)] font-bold">* Note:</span>
                    <span className="opacity-80">- Can only change your name &nbsp;
                        <span className="font-bold">once every 7 days</span>.
                    </span>
                    <span className="opacity-80">- Your name must have more than 3 characters and less than 36 characters.</span>
                    <span className="opacity-80">- Your name must not contains special characters such as &nbsp;
                        <span className="text-[18px]">!, #, $, @, ...</span>.
                    </span>
                </p>
                <Button disabled={firstName === oldFirstName && lastName === oldLastName} size="medium" className="mt-2 !text-[20px]"
                    onClick={handleSubmit}
                >Accept</Button>
                <span className={`absolute top-5 right-8 text-[25px] hover:text-[var(--main-single-color)] cursor-pointer`}
                    onClick={handleClose}><i className="fa-solid fa-xmark"></i></span>
            </div>
        </div>
    );
};

export default ChangeNameForm;