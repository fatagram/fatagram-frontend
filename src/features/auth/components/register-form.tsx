import React from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { OverlayLoading } from "@/components/organisms";
import { Button, Checkbox, Logo, Textbox, Text, Link } from "@/components/atoms";
import { useFormik } from "formik";
import { registerInitialValues, registerValidationSchema } from "@/types/entities";
import { authService } from "@/api/auth/auth.api";
import { SocialButtons } from "./social-buttons";

type RegisterFormProps = {
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
  className?: string;
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  className,
  showLogo = true,
  showClose = false,
  onClose,
}) => {
  // States
  const { t } = useTranslation();
  const [isShowClose] = React.useState<boolean>(showClose);
  const [isShowLogo] = React.useState<boolean>(showLogo);
  // Other hooks

  // useNavigate hook
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: registerInitialValues,
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      await authService.register({
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
      {formik.isSubmitting && <OverlayLoading />}
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
          isWrong={formik.touched.username && Boolean(formik.errors.username)}
          wrongMessage={t(formik.errors.username || "")}
        />
        <Textbox
          value={formik.values.email}
          autoComplete="email"
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.email")}
          onChange={(e) => formik.setFieldValue("email", e.target.value)}
          isWrong={formik.touched.email && Boolean(formik.errors.email)}
          wrongMessage={t(formik.errors.email || "")}
        />
        <Textbox
          value={formik.values.phoneNumber}
          autoComplete="tel"
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.phoneNumber")}
          onChange={(e) => formik.setFieldValue("phoneNumber", e.target.value)}
          isWrong={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
          wrongMessage={t(formik.errors.phoneNumber || "")}
        />
        <Textbox
          type="password"
          value={formik.values.password}
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.password")}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          isWrong={formik.touched.password && Boolean(formik.errors.password)}
          wrongMessage={t(formik.errors.password || "")}
        />
        <Textbox
          type="password"
          value={formik.values.confirmPassword}
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder={t("auth:register.confirmPassword")}
          onChange={(e) => formik.setFieldValue("confirmPassword", e.target.value)}
          isWrong={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
          wrongMessage={t(formik.errors.confirmPassword || "")}
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

export default RegisterForm;
