import { Text, Textbox, Button, Skeleton } from "@/components/atoms";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useGetUserProfile, useUpdateName } from "@/features/hooks/use-user-profile";
import { ErrorCodes } from "@/api/user/dto/change-name.dto";
import { useAuth } from "@/contexts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faCircleInfo, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { createPortal } from "react-dom";
import { useMobile } from "@/hooks/use-mobile";
import { BottomSheet } from "@/components/ui/bottom-sheet";

type ChangeNameFormProps = {
  className?: string;
};

const ChangeNameForm: React.FC<ChangeNameFormProps> = ({ className }) => {
  const [mounted, setMounted] = useState(false);
  const isMobile = useMobile();
  const [firstNameFailed, setFirstNameFailed] = useState<boolean>(false);
  const [middleNameFailed, setMiddleNameFailed] = useState<boolean>(false);
  const [lastNameFailed, setLastNameFailed] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { t } = useTranslation() as { t: (key: string, options?: any) => string };
  const { userId } = useAuth();

  const { data: userProfile, isLoading } = useGetUserProfile(userId!);
  const updateNameMutation = useUpdateName(userId!);
  const [newFirstName, setNewFirstName] = useState<string>("");
  const [newMiddleName, setNewMiddleName] = useState<string>("");
  const [newLastName, setNewLastName] = useState<string>("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (userProfile?.infos) {
      setNewFirstName(userProfile.infos.firstName || "");
      setNewMiddleName(userProfile.infos.middleName || "");
      setNewLastName(userProfile.infos.lastName || "");
    }
  }, [userProfile]);

  // Close change name form
  const handleClose = () => {
    navigate("/settings");
  };

  const isUnchanged =
    userProfile?.infos &&
    newFirstName.trim() === (userProfile.infos.firstName || "").trim() &&
    newMiddleName.trim() === (userProfile.infos.middleName || "").trim() &&
    newLastName.trim() === (userProfile.infos.lastName || "").trim();

  const isInvalid = !newFirstName.trim() || !newLastName.trim();

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmitting || isLoading || isUnchanged || isInvalid) return;

    // Reset errors
    setErrorMessage("");
    setFirstNameFailed(false);
    setMiddleNameFailed(false);
    setLastNameFailed(false);
    setIsSubmitting(true);

    await updateNameMutation.fetch(
      {
        firstName: newFirstName.trim(),
        middleName: newMiddleName.trim() || null,
        lastName: newLastName.trim(),
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

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  const formFields = (
    <div className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary px-0.5">
            {t("settings:account.personalInfo.changeNameForm.firstName")}{" "}
            <span className="text-error">*</span>
          </label>
          <Textbox
            isWrong={firstNameFailed}
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            placeholder={t("settings:account.personalInfo.changeNameForm.firstName")}
            className="w-full !rounded-xl !bg-bg-main border border-bg-fourth focus:border-primary-500 py-1.5 px-3 transition-colors"
            type="text"
            sz="md"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-text-secondary px-0.5">
            {t("settings:account.personalInfo.changeNameForm.middleName")}
          </label>
          <Textbox
            isWrong={middleNameFailed}
            value={newMiddleName}
            onChange={(e) => setNewMiddleName(e.target.value)}
            placeholder={t("settings:account.personalInfo.changeNameForm.middleName")}
            className="w-full !rounded-xl !bg-bg-main border border-bg-fourth focus:border-primary-500 py-1.5 px-3 transition-colors"
            type="text"
            sz="md"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-text-secondary px-0.5">
          {t("settings:account.personalInfo.changeNameForm.lastName")}{" "}
          <span className="text-error">*</span>
        </label>
        <Textbox
          isWrong={lastNameFailed}
          value={newLastName}
          onChange={(e) => setNewLastName(e.target.value)}
          placeholder={t("settings:account.personalInfo.changeNameForm.lastName")}
          className="w-full !rounded-xl !bg-bg-main border border-bg-fourth focus:border-primary-500 py-1.5 px-3 transition-colors"
          type="text"
          sz="md"
        />
      </div>
    </div>
  );

  const errorAlert = errorMessage && (
    <div className="bg-error/10 border border-error/30 text-error rounded-xl p-3 text-xs flex items-center gap-2 animate-fade-in">
      <FontAwesomeIcon icon={faCircleInfo} className="shrink-0" />
      <span>{errorMessage}</span>
    </div>
  );

  const noteCard = (
    <div className="bg-bg-main/70 border border-bg-fourth rounded-xl p-3.5 flex flex-col gap-2">
      <div className="flex items-center gap-2 text-primary-500 font-semibold text-xs">
        <FontAwesomeIcon icon={faCircleInfo} />
        <span>{t("settings:account.personalInfo.changeNameForm.note")}</span>
      </div>
      <ul className="text-xs text-text-secondary flex flex-col gap-1.5 list-disc list-inside leading-relaxed">
        <li>
          {t("settings:account.personalInfo.changeNameForm.noteText1")}{" "}
          <strong className="text-text-main font-semibold">
            7 {t("settings:account.personalInfo.changeNameForm.day")}
          </strong>
          .
        </li>
        <li>{t("settings:account.personalInfo.changeNameForm.noteText2")}</li>
        <li>
          {t("settings:account.personalInfo.changeNameForm.noteText3")}{" "}
          <span className="font-mono text-text-main font-medium">!, #, $, @...</span>
        </li>
      </ul>
    </div>
  );

  if (isMobile) {
    return (
      <BottomSheet
        open={true}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
        trigger={<span className="hidden" />}
        title={t("settings:account.personalInfo.changeNameForm.title")}
        maxHeight="max-h-[90dvh]"
        className={className}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 pt-2 pb-6">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton sz="sm" className="w-1/3 h-4" />
              <Skeleton sz="md" className="w-full h-10 rounded-xl" />
              <Skeleton sz="sm" className="w-1/3 h-4 mt-2" />
              <Skeleton sz="md" className="w-full h-10 rounded-xl" />
            </div>
          ) : (
            <>
              {formFields}
              {errorAlert}
              {noteCard}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="secondary"
                  sz="md"
                  className="flex-1 justify-center"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {t("settings:editableField.cancelButton")}
                </Button>
                <Button
                  variant="primary"
                  sz="md"
                  className="flex-1 justify-center"
                  onClick={handleSubmit}
                  disabled={isLoading || isSubmitting || !userProfile || isUnchanged || isInvalid}
                >
                  {isSubmitting
                    ? t("settings:account.personalInfo.changeNameForm.submitting")
                    : t("settings:account.personalInfo.changeNameForm.acceptButton")}
                </Button>
              </div>
            </>
          )}
        </form>
      </BottomSheet>
    );
  }

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] animate-fade-in",
        className,
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className={clsx(
          "relative flex flex-col bg-bg-second w-full max-w-[480px] max-h-[85vh]",
          "border border-bg-fourth/80 rounded-2xl shadow-2xl overflow-hidden",
          "animate-dialog-zoom-in",
        )}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-bg-fourth shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-500/10 text-primary-500 flex items-center justify-center shrink-0">
              <FontAwesomeIcon icon={faPenToSquare} className="text-sm" />
            </div>
            <div className="flex flex-col">
              <Text sz="lg" weight="bold" className="text-text-main leading-tight">
                {t("settings:account.personalInfo.changeNameForm.title")}
              </Text>
              <Text sz="xs" className="!text-text-secondary mt-0.5 font-normal" wrap="whitespace-normal">
                {t("settings:account.personalInfo.yourNameDescription")}
              </Text>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary hover:text-text-main hover:bg-bg-third transition-colors cursor-pointer"
            onClick={handleClose}
            aria-label="Close"
          >
            <FontAwesomeIcon icon={faXmark} className="text-base" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col gap-3 py-2">
              <Skeleton sz="sm" className="w-1/3 h-4" />
              <Skeleton sz="md" className="w-full h-10 rounded-xl" />
              <Skeleton sz="sm" className="w-1/3 h-4 mt-2" />
              <Skeleton sz="md" className="w-full h-10 rounded-xl" />
            </div>
          ) : (
            <>
              {formFields}
              {errorAlert}
              {noteCard}
            </>
          )}
        </form>

        {/* Modal Footer Actions */}
        <div className="px-6 py-3.5 border-t border-bg-fourth bg-bg-second/80 backdrop-blur-sm flex items-center justify-end gap-3 shrink-0">
          <Button
            variant="secondary"
            sz="md"
            className="justify-center"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            {t("settings:editableField.cancelButton")}
          </Button>
          <Button
            variant="primary"
            sz="md"
            className="justify-center min-w-[120px]"
            onClick={handleSubmit}
            disabled={isLoading || isSubmitting || !userProfile || isUnchanged || isInvalid}
          >
            {isSubmitting
              ? t("settings:account.personalInfo.changeNameForm.submitting")
              : t("settings:account.personalInfo.changeNameForm.acceptButton")}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ChangeNameForm;
