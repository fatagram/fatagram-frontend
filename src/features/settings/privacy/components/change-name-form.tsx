import { Text, Textbox, Button, Skeleton } from "@/components/atoms";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useGetUserProfile, useUpdateName } from "@/features/hooks/use-user-profile";
import { ErrorCodes } from "@/api/user/dto/change-name.dto";
import { useAuth } from "@/contexts";

type ChangeNameFormProps = {
  className?: string;
};

const ChangeNameForm: React.FC<ChangeNameFormProps> = ({ className }) => {
  const [firstNameFailed, setFirstNameFailed] = React.useState<boolean>(false);
  const [middleNameFailed, setMiddleNameFailed] = React.useState<boolean>(false);
  const [lastNameFailed, setLastNameFailed] = React.useState<boolean>(false);
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string) => string };
  const { userId } = useAuth();

  const { data: userProfile, isLoading } = useGetUserProfile(userId!);
  const updateNameMutation = useUpdateName(userId!);
  const [newFirstName, setNewFirstName] = React.useState<string>("");
  const [newMiddleName, setNewMiddleName] = React.useState<string>("");
  const [newLastName, setNewLastName] = React.useState<string>("");

  useEffect(() => {
    setNewFirstName(userProfile?.infos.firstName || "");
    setNewMiddleName(userProfile?.infos.middleName || "");
    setNewLastName(userProfile?.infos.lastName || "");
  }, [userProfile]);

  // Close change name form
  const handleClose = () => {
    navigate("/settings");
  };

  const handleSubmit = async () => {
    // Reset errors
    setErrorMessage("");
    setFirstNameFailed(false);
    setMiddleNameFailed(false);
    setLastNameFailed(false);
    setIsSubmitting(true);

    await updateNameMutation.fetch(
      {
        firstName: newFirstName,
        middleName: newMiddleName || null,
        lastName: newLastName,
      },
      {
        onSuccess: () => {
          setIsSubmitting(false);
          navigate("/settings");
        },
        onError: (error) => {
          const errorCode = error?.code;
          if (errorCode && ErrorCodes[errorCode]) {
            setErrorMessage(t(ErrorCodes[errorCode].message));
            setFirstNameFailed(ErrorCodes[errorCode].type === "FirstName");
            setLastNameFailed(ErrorCodes[errorCode].type === "LastName");
          } else {
            setErrorMessage(t(ErrorCodes["UNKNOWN_ERROR"].message));
          }
          setIsSubmitting(false);
        },
      },
    );
  };

  return (
    <div
      className={clsx(
        "fixed inset-0 bg-bg-overlay flex items-center justify-center z-50",
        className,
      )}
    >
      <div
        className={clsx(
          "animate-fade-in relative flex flex-col justify-center bg-bg-second rounded-2xl shadow-lg px-10 py-10",
          "w-full h-full sm:h-fit sm:w-fit",
        )}
      >
        <Text sz="lg-3" className={clsx("sm:mb-4 text-gradient-main !font-bold")}>
          {t("settings:account.personalInfo.changeNameForm.title")}
        </Text>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div>
            <div
              className={clsx(
                "animate-fade-in flex flex-col sm:flex-row gap-7 justify-center w-full rounded-2xl sm:bg-bg-main sm:px-5 py-5",
              )}
            >
              <div className={clsx("flex flex-col")}>
                <Text sz="md-2" className={clsx("ml-2 mb-1")}>
                  {t("settings:account.personalInfo.changeNameForm.firstName")}
                </Text>
                <Textbox
                  isWrong={firstNameFailed}
                  value={newFirstName}
                  onChange={(e) => setNewFirstName(e.target.value)}
                  placeholder="First name"
                  className={clsx("w-full py-1 px-2 lg:max-w-[200px]")}
                />
              </div>
              <div className={clsx("flex flex-col")}>
                <Text sz="md-2" className={clsx("ml-2 mb-1")}>
                  {t("settings:account.personalInfo.changeNameForm.middleName")}
                </Text>
                <Textbox
                  isWrong={middleNameFailed}
                  value={newMiddleName}
                  onChange={(e) => setNewMiddleName(e.target.value)}
                  placeholder="Middle name"
                  className={clsx("w-full py-1 px-2 lg:max-w-[200px]")}
                />
              </div>
              <div className={clsx("flex flex-col")}>
                <Text sz="md-2" className={clsx("ml-2 mb-1")}>
                  {t("settings:account.personalInfo.changeNameForm.lastName")}
                </Text>
                <Textbox
                  isWrong={lastNameFailed}
                  value={newLastName}
                  onChange={(e) => setNewLastName(e.target.value)}
                  placeholder="Last name"
                  className={clsx("w-full py-1 px-2 lg:max-w-[200px]")}
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
        <span className={clsx("mx-8 mt-4 mb-4 h-[0.5px] bg-primary-500")}></span>
        <Text sz="sm-2" className={clsx("font-light px-2 mb-4 flex flex-col gap-1")}>
          <Text weight="bold" className={clsx("text-single-second")}>
            * {t("settings:account.personalInfo.changeNameForm.note")}:
          </Text>
          <Text className={clsx("opacity-80")} wrap="whitespace-normal">
            - {t("settings:account.personalInfo.changeNameForm.noteText1")} &nbsp;
            <Text weight="bold" className={clsx("text-single-main")}>
              7 {t("settings:account.personalInfo.changeNameForm.day")}
            </Text>
            .
          </Text>
          <Text className={clsx("opacity-80")} wrap="whitespace-normal">
            - {t("settings:account.personalInfo.changeNameForm.noteText2")}
          </Text>
          <Text className={clsx("opacity-80")} wrap="whitespace-normal">
            - {t("settings:account.personalInfo.changeNameForm.noteText3")} &nbsp;
            <Text sz="md-1">!, #, $, @, ...</Text>.
          </Text>
        </Text>
        <Button
          disabled={
            isSubmitting ||
            (newFirstName === userProfile?.infos.firstName &&
              newMiddleName === (userProfile?.infos.middleName || "") &&
              newLastName === userProfile?.infos.lastName)
          }
          sz="md-1"
          className={clsx("mt-2")}
          onClick={handleSubmit}
        >
          {isSubmitting
            ? t("settings:account.personalInfo.changeNameForm.submitting")
            : t("settings:account.personalInfo.changeNameForm.acceptButton")}
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
