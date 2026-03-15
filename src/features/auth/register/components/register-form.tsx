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
import { OverlayLoading } from "@/components/ui";
import { SocialButtons } from "../../components/social-buttons";

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
  const [isShowClose] = React.useState<boolean>(showClose);
  const [isShowLogo] = React.useState<boolean>(showLogo);
  const navigate = useNavigate();

  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneNumberError, setPhoneNumberError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");

  const { fetch: register, isFetching } = useResultFetcher(authService.register, {
    onSuccess: () => {
      navigate("/login");
    },
    onError: (err?: any, _errs?: any[]) => {
      const errMap = registerErrorCodeMap[err?.code] ?? registerErrorCodeMap["UNKNOWN_ERROR"];
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
        }
      }
    },
  });

  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      console.log("Submitting registration form with values: ", values);
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
        "relative flex flex-col items-center justify-center gap-3 w-[450px]",
        "bg-bg-second rounded-2xl",
        "p-12 animate-fade-in overflow-hidden",
        className,
      )}
      onSubmit={formik.submitForm}
    >
      {/* Overlay Loading */}
      {(formik.isSubmitting || isFetching) && <OverlayLoading />}
      {/* Logo Fatagram */}
      {isShowLogo && <Logo />}

      <Text
        sz="xl-1"
        weight="extrabold"
        className="uppercase !text-primary-500 select-none text-center"
      >
        {t("auth:register.title")}
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <Textbox
          value={formik.values.username}
          autoComplete="username"
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.username")}
          onChange={(e) => formik.setFieldValue("username", e.target.value)}
          isWrong={
            (formik.touched.username && Boolean(formik.errors.username)) || Boolean(usernameError)
          }
          wrongMessage={t(usernameError || formik.errors.username || "")}
        />
        <Textbox
          value={formik.values.email}
          autoComplete="email"
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.email")}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          isWrong={(formik.touched.email && Boolean(formik.errors.email)) || Boolean(emailError)}
          wrongMessage={t(emailError || formik.errors.email || "")}
        />
        <Textbox
          value={formik.values.phoneNumber}
          autoComplete="tel"
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.phoneNumber")}
          onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
          isWrong={
            (formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)) ||
            Boolean(phoneNumberError)
          }
          wrongMessage={t(phoneNumberError || formik.errors.phoneNumber || "")}
        />
        <Textbox
          type="password"
          value={formik.values.password}
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.password")}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          isWrong={
            (formik.touched.password && Boolean(formik.errors.password)) || Boolean(passwordError)
          }
          wrongMessage={t(passwordError || formik.errors.password || "")}
        />
        <Textbox
          type="password"
          value={formik.values.confirmPassword}
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.confirmPassword")}
          onChange={(e) => formik.setFieldValue("confirmPassword", e.target.value)}
          isWrong={
            (formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)) ||
            Boolean(confirmPasswordError)
          }
          wrongMessage={t(confirmPasswordError || formik.errors.confirmPassword || "")}
        />
      </div>
      <Checkbox
        className="text-[15px] text-single-third gap-[8px]"
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
      <Button type="button" sz="md-1" className="w-full" onClick={formik.submitForm}>
        <Text>{t("auth:register.registerButton")}</Text>
      </Button>
      <div className="w-full flex flex-col items-center gap-3">
        <div className="flex items-center w-full gap-3">
          <div className="h-[1px] bg-border-main flex-1" />
          <Text sz="sm-2" className="text-text-third">
            OR
          </Text>
          <div className="h-[1px] bg-border-main flex-1" />
        </div>
        <SocialButtons />
      </div>
      <Link className="font-bold" to="/login">
        {t("auth:register.loginButton")}
      </Link>
      {isShowClose && (
        <Text
          sz="lg-1"
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
