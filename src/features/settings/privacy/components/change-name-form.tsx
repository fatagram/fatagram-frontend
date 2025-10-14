import { ErrorCodes } from "@/api/user/dto/change-name.dto";
import { userProfileService } from "@/api/user/user-profile.api";
import { Text, Textbox, Button, Skeleton } from "@/components/atoms";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "@/hooks/utilities/use-auth";

type ChangeNameFormProps = {
  className?: string;
};

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

  // Close change name form
  const handleClose = () => {
    navigate("/settings");
  };

  const handleSubmit = async () => {
    const response = await userProfileService.UpdateName({ firstName, lastName });
    if (response.success) {
      navigate("/settings", { state: { reload: true } });
    } else {
      const errorCode = response?.errorCodes?.[0] || response.errorCode;
      if (errorCode) {
        setErrorMessage(t(ErrorCodes[errorCode].message));
        setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
        setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
      } else {
        setErrorMessage(t(ErrorCodes["UNKNOWN_ERROR"].message));
        setFirstNameFailed(false);
        setLastNameFailed(false);
      }
    }
  };

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const response = await userProfileService.GetProfile(userId ?? "", "firstName,lastName");
      if (response.success) {
        setFirstName(response.data.infos.firstName);
        setLastName(response.data.infos.lastName);
        setOldFirstName(response.data.infos.firstName);
        setOldLastName(response.data.infos.lastName);
      }
      setIsLoading(false);
    };
    setErrorMessage("");
    setFirstNameFailed(false);
    setLastNameFailed(false);
    fetchProfile();
  }, [userProfileService, userId]);

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 lg:pt-0 pt-10",
        className,
      )}
    >
      <div
        className={clsx(
          "animate-fade-in relative flex flex-col justify-center bg-bg-second rounded-2xl shadow-lg px-10 py-8",
        )}
      >
        <Text sz="lg-3" className={clsx("pb-6 px-2 text-gradient-main !font-bold")}>
          {t("settings:account.personalInfo.changeNameForm.title")}
        </Text>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div>
            <div
              className={clsx(
                "animate-fade-in flex flex-wrap gap-7 justify-center w-full rounded-2xl bg-bg-main p-5",
              )}
            >
              <div className={clsx("flex flex-col")}>
                <Text sz="md-2" className={clsx("ml-2 mb-1")}>
                  {t("settings:account.personalInfo.changeNameForm.firstName")}
                </Text>
                <Textbox
                  isWrong={firstNameFailed}
                  value={firstName}
                  placeholder="First name"
                  className={clsx("py-1 px-2 lg:max-w-[200px]")}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className={clsx("flex flex-col")}>
                <Text sz="md-2" className={clsx("ml-2 mb-1")}>
                  {t("settings:account.personalInfo.changeNameForm.lastName")}
                </Text>
                <Textbox
                  isWrong={lastNameFailed}
                  value={lastName}
                  placeholder="Last name"
                  className={clsx("py-1 px-2 lg:max-w-[200px]")}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            {errorMessage && (
              <Text sz="md-1" color="danger" className={clsx("mt-2 mx-4")}>
                {errorMessage}
              </Text>
            )}
          </div>
        )}
        <Text className={clsx("mx-8 mt-8 mb-4 h-[0.5px] bg-primary-500")}></Text>
        <Text sz="sm-2" className={clsx("font-light px-2 mb-4 flex flex-col gap-1")}>
          <Text weight="bold" className={clsx("text-single-second")}>
            * {t("settings:account.personalInfo.changeNameForm.note")}:
          </Text>
          <Text className={clsx("opacity-80")}>
            - {t("settings:account.personalInfo.changeNameForm.noteText1")} &nbsp;
            <Text weight="bold" className={clsx("text-single-main")}>
              7 {t("settings:account.personalInfo.changeNameForm.day")}
            </Text>
            .
          </Text>
          <Text className={clsx("opacity-80")}>
            - {t("settings:account.personalInfo.changeNameForm.noteText2")}
          </Text>
          <Text className={clsx("opacity-80")}>
            - {t("settings:account.personalInfo.changeNameForm.noteText3")} &nbsp;
            <Text sz="md-1">!, #, $, @, ...</Text>.
          </Text>
        </Text>
        <Button
          disabled={firstName === oldFirstName && lastName === oldLastName}
          sz="md-1"
          className={clsx("mt-2")}
          onClick={handleSubmit}
        >
          {t("settings:account.personalInfo.changeNameForm.acceptButton")}
        </Button>
        <Text
          sz="lg-2"
          className={clsx("absolute top-5 right-8 hover:text-primary-500 cursor-pointer")}
          onClick={handleClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </Text>
      </div>
    </div>
  );
};

export default ChangeNameForm;
