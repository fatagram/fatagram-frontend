import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { Button, Checkbox, Logo, Textbox, Text, Link } from "@/components/atoms";
import { useFormik } from "formik";
import { authService } from "@/api/auth/auth.api";
import { useResultFetcher } from "@/hooks/use-fetcher";
import {
  registerErrorCodeMap,
  registerInitialValues,
  registerValidationSchema,
} from "../validations/register.validation";
import { SocialButtons } from "../../components/social-buttons";
import { Error } from "@/api/common/result";

type RegisterFormProps = {
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

export const RegisterForm: React.FC<RegisterFormProps> = ({
  className,
  showLogo = true,
  showClose = false,
  onClose,
}) => {
  const { t } = useTranslation();
  const [isShowClose] = useState<boolean>(showClose);
  const [isShowLogo] = useState<boolean>(showLogo);
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const { fetch: register } = useResultFetcher(authService.register, {
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err?: Error, errs?: Error[]) => {
      const handleError = (err?: Error) => {
        if (!err) return;
        const errMap = registerErrorCodeMap[err?.code];
        if (errMap) {
          switch (errMap.type) {
            case "username":
              setUsernameError(errMap.message);
              break;
            case "email":
              setEmailError(errMap.message);
              break;
            case "phoneNumber":
              setPhoneNumberError(errMap.message);
              break;
            case "password":
              setPasswordError(errMap.message);
              break;
            case "confirmPassword":
              setConfirmPasswordError(errMap.message);
              break;
            default:
              break;
          }
        }
      };

      [err, ...(errs ?? [])].forEach((err) => handleError(err));
    },
  });

  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      setUsernameError("");
      setEmailError("");
      setPhoneNumberError("");
      setPasswordError("");
      setConfirmPasswordError("");

      await register({
        username: values.username,
        password: values.password,
        confirmPassword: values.confirmPassword,
        email: values.email,
        phoneNumber: values.phoneNumber,
      });
    },
  });

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-center gap-3",
        "rounded-2xl",
        "animate-fade-in ",
        className,
      )}
      onSubmit={formik.submitForm}
    >
      {isShowLogo && <Logo sz="lg" />}

      <Text
        weight="extrabold"
        className="!text-3xl uppercase !text-primary-500 select-none text-center"
      >
        {t("auth:register.title")}
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <Textbox
          value={formik.values.username}
          sz="sm"
          className="w-full"
          placeholder={t("auth:register.username")}
          onChange={(e) => formik.setFieldValue("username", e.target.value)}
          isWrong={
            (formik.touched.username && Boolean(formik.errors.username)) || Boolean(usernameError)
          }
          wrongMessage={t(usernameError || formik.errors.username || "")}
          disabled={formik.isSubmitting}
          type="text"
          autoComplete="username"
        />
        <Textbox
          value={formik.values.email}
          sz="sm"
          className="w-full"
          placeholder={t("auth:register.email")}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          isWrong={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(emailError)}
          wrongMessage={t(emailError || formik.errors.email || "")}
          disabled={formik.isSubmitting}
          type="email"
          autoComplete="email"
        />
        <Textbox
          value={formik.values.phoneNumber}
          sz="sm"
          className="w-full"
          placeholder={t("auth:register.phoneNumber")}
          onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
          isWrong={
            (formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)) ||
            Boolean(phoneNumberError)
          }
          wrongMessage={t(phoneNumberError || formik.errors.phoneNumber || "")}
          disabled={formik.isSubmitting}
          type="text"
          autoComplete="tel"
        />
        <Textbox
          type="password"
          value={formik.values.password}
          sz="sm"
          className="w-full"
          placeholder={t("auth:register.password")}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          isWrong={
            (formik.touched.password && Boolean(formik.errors.password)) || Boolean(passwordError)
          }
          wrongMessage={t(passwordError || formik.errors.password || "")}
          disabled={formik.isSubmitting}
          autoComplete="new-password"
        />
        <Textbox
          type="password"
          value={formik.values.confirmPassword}
          sz="sm"
          className="w-full"
          placeholder={t("auth:register.confirmPassword")}
          onChange={(e) => formik.setFieldValue("confirmPassword", e.target.value)}
          isWrong={
            (formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)) ||
            Boolean(confirmPasswordError)
          }
          wrongMessage={t(confirmPasswordError || formik.errors.confirmPassword || "")}
          disabled={formik.isSubmitting}
          autoComplete="new-password"
        />
      </div>
      <Checkbox
        className="text-[15px] text-single-third gap-[8px] w-full"
        label={
          <Text className="flex items-center flex-wrap">
            {t("auth:register.agree")}&nbsp;
            <Link className="sm:text-[15px]" to="/terms">
              {t("auth:register.termsOfService")}
            </Link>
            &nbsp;
            {t("auth:register.and")}&nbsp;
            <Link className="sm:text-[15px]" to="/policy">
              {t("auth:register.privacyPolicy")}
            </Link>
            .
          </Text>
        }
      />
      <Button
        type="button"
        sz="md"
        className="flex justify-center w-full"
        onClick={formik.submitForm}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting && (
          <div className="flex items-center justify-center mr-2">
            <div className="w-3 h-3 aspect-square animate-spin rounded-full border-[1.5px] border-gray-300 border-t-transparent"></div>
          </div>
        )}
        <Text>{t("auth:register.registerButton")}</Text>
      </Button>
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center w-full gap-3">
          <div className="h-[1px] bg-border-main flex-1" />
          <Text sz="sm" className="text-text-third">
            OR
          </Text>
          <div className="h-[1px] bg-border-main flex-1" />
        </div>
        <SocialButtons disabled={formik.isSubmitting} />
      </div>
      <Link className="font-bold" to="/login">
        {t("auth:register.loginButton")}
      </Link>
      {isShowClose && (
        <Text
          sz="lg"
          className={clsx(
            "absolute z-50 top-3 right-5 text-gradient-main hover:text-single-main cursor-pointer",
          )}
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </Text>
      )}
    </div>
  );
};
