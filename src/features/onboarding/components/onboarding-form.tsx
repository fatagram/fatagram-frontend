import React, { useState } from "react";
import { Button, Textbox, SelectBox, SelectDay } from "@/components/atoms";
import { Option } from "@/components/atoms";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { userProfileService } from "@/api/user/user-profile.api";
import {
  onboardingInitialValues,
  onboardingValidationSchema,
} from "../validation/onboarding.validation";
import { OverlayLoading } from "@/components/ui/overlay-loading";
import { ErrorCodes } from "@/api/user/dto/onboarding.dto";
import { useNavigate } from "react-router-dom";
import { authEvents } from "@/events/auth-event";
import { useOnboarding } from "@/features/hooks/use-user-profile";

// gender options will be created inside the component to allow translation

export const OnboardingForm: React.FC = () => {
  const { t } = useTranslation();
  const genderOptions: Option[] = [
    { key: "male", value: t("onboarding.form.gender.options.male") },
    { key: "female", value: t("onboarding.form.gender.options.female") },
    { key: "other", value: t("onboarding.form.gender.options.other") },
  ];
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { fetch: completeOnboarding } = useOnboarding();

  const formik = useFormik({
    initialValues: { ...onboardingInitialValues, gender: genderOptions[0].key },
    validationSchema: onboardingValidationSchema,
    onSubmit: async (values) => {
      setErrors({});
      await completeOnboarding(
        {
          firstName: values.firstName,
          middleName: values.middleName,
          lastName: values.lastName,
          birthday: values.birthday,
          gender: values.gender.toString(),
        },
        {
          onSuccess: () => {
            authEvents.emit("onboardingCompleted");
            navigate("/");
          },
          onError: (err) => {
            console.error("Error completing onboarding:", err);
            const errorCode = err?.code;
            if (errorCode && ErrorCodes[errorCode]) {
              const errorInfo = ErrorCodes[errorCode];
              setErrors({ [errorInfo.type]: errorInfo.message });
            }
          },
        },
      );
    },
  });

  React.useEffect(() => {
    const fetchDefaults = async () => {
      const result = await userProfileService.getOnboardingDefaults();
      if (result.success && result.data) {
        const data = result.data;
        const genderMap: Record<number, string> = {
          0: "male",
          1: "female",
          2: "other",
        };

        formik.setValues({
          firstName: data.firstName || "",
          middleName: data.middleName || "",
          lastName: data.lastName || "",
          birthday: data.birthDay ? data.birthDay.split("T")[0] : "",
          gender: data.gender !== undefined ? genderMap[data.gender] || "male" : "male",
        });
      }
    };
    fetchDefaults();
  }, [formik.setValues]);

  return (
    <div className="relative w-full">
      {formik.isSubmitting && <OverlayLoading />}

      <div className="flex flex-col gap-4 w-full">
        <div className="flex sm:flex-row flex-col gap-2 w-full">
          <Textbox
            title={t("onboarding.form.firstName.title")}
            className="w-full"
            isRequired={true}
            placeholder={t("onboarding.form.firstName.placeholder")}
            value={formik.values.firstName}
            onChange={(e) => formik.setFieldValue("firstName", e.target.value)}
            isWrong={
              (formik.touched.firstName && Boolean(formik.errors.firstName)) ||
              Boolean(errors.FirstName)
            }
            wrongMessage={t(errors.FirstName || formik.errors.firstName || "")}
            type={"text"}
          />
          <Textbox
            title={t("onboarding.form.middleName.title")}
            className="w-full"
            placeholder={t("onboarding.form.middleName.placeholder")}
            value={formik.values.middleName}
            onChange={(e) => formik.setFieldValue("middleName", e.target.value)}
            type={"text"}
          />
          <Textbox
            title={t("onboarding.form.lastName.title")}
            isRequired={true}
            placeholder={t("onboarding.form.lastName.placeholder")}
            className="w-full"
            value={formik.values.lastName}
            onChange={(e) => formik.setFieldValue("lastName", e.target.value)}
            isWrong={
              (formik.touched.lastName && Boolean(formik.errors.lastName)) ||
              Boolean(errors.LastName)
            }
            wrongMessage={t(errors.LastName || formik.errors.lastName || "")}
            type={"text"}
          />
        </div>

        <SelectDay
          title={t("onboarding.form.birthday.title")}
          isRequired={true}
          value={formik.values.birthday}
          onChange={(e) => formik.setFieldValue("birthday", e.target.value)}
          isWrong={
            (formik.touched.birthday && Boolean(formik.errors.birthday)) || Boolean(errors.Birthday)
          }
          wrongMessage={t(errors.Birthday || formik.errors.birthday || "")}
        />

        <div className="flex gap-2 w-full">
          <div className="flex flex-col flex-1">
            <SelectBox
              title={t("onboarding.form.gender.title")}
              isRequired={true}
              options={genderOptions}
              selectedOption={formik.values.gender}
              onSelect={(key) => formik.setFieldValue("gender", key)}
            />
            {((formik.touched.gender && formik.errors.gender) || errors.Gender) && (
              <span className="text-xs text-error ml-1">
                {t(errors.Gender || formik.errors.gender || "")}
              </span>
            )}
          </div>
        </div>

        <Button type="button" className="w-full" onClick={formik.submitForm} sz="sm">
          {t("onboarding.form.submit")}
        </Button>
      </div>
    </div>
  );
};
