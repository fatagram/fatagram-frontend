import React from "react";
import { Button, Logo, Textbox, Text, Checkbox, Link } from "@/components/atoms";
import clsx from "clsx";
import { useAuth } from "@/hooks/contexts/use-auth";
import { OverlayLoading } from "@/components/organisms/overlay-loading";
import { loginInitialValues, loginValidationSchema } from "@/types/entities";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { SocialButton } from "./social-button";
import { ComponentProps } from "@/components/common/types/component-type";
import { SocialButtons } from "./social-buttons";

interface LoginFormProps extends ComponentProps {
  switchForgotPassword?: () => void;
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

// LoginForm component
export const LoginForm: React.FC<LoginFormProps> = ({
  switchForgotPassword,
  showLogo = true,
  showClose = false,
  onClose,
  className,
}) => {
  const { t } = useTranslation();
  // states
  const [isShowClose] = React.useState<boolean>(showClose);
  const [isShowLogo] = React.useState<boolean>(showLogo);
  const { logIn } = useAuth();
  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginValidationSchema,
    onSubmit: async (values) => {
      await logIn({
        usernameOrEmail: values.usernameOrEmail,
        password: values.password,
      });
    },
  });

  return (
    <div
      className={clsx(
        "relative flex flex-col items-center justify-center gap-5 w-[450px] h-[550px]",
        "bg-bg-second rounded-2xl",
        "p-12 animate-fade-in overflow-hidden",
        className,
      )}
    >
      {formik.isSubmitting && <OverlayLoading />}

      {isShowLogo && <Logo sz="md-1" />}
      <Text
        sz="xl-1"
        weight="extrabold"
        className={clsx("uppercase !text-primary-500", "font-bold font-inter select-none")}
      >
        {t("auth:login.title")}
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <Textbox
          className={clsx("text-[14px] w-[100%] px-[20px]", "sm:py-[7px] py-[10px] shadow-sm")}
          autoComplete="username"
          placeholder={t("auth:login.username")}
          onChange={(e) => formik.setFieldValue("usernameOrEmail", e.target.value)}
          isWrong={formik.touched.usernameOrEmail && Boolean(formik.errors.usernameOrEmail)}
          wrongMessage={t(formik.errors.usernameOrEmail || "")}
        />
        <Textbox
          type="password"
          className={clsx("text-[14px] w-[100%] px-[20px]", "sm:py-[7px] py-[10px] shadow-sm")}
          placeholder={t("auth:login.password")}
          onChange={(e) => formik.setFieldValue("password", e.target.value)}
          isWrong={formik.touched.password && Boolean(formik.errors.password)}
          wrongMessage={t(formik.errors.password || "")}
          autoComplete="current-password"
        />
      </div>
      <div className="flex justify-between w-[98%] items-center gap-[50px]">
        <Checkbox
          label={t("auth:login.rememberMe")}
          onChange={(e) => {
            formik.setFieldValue("rememberMe", e.target.checked);
          }}
        />
        {switchForgotPassword && (
          <Text
            sz="sm-3"
            className={clsx(
              "!text-primary-500 hover:!text-primary-600",
              "hover:cursor-pointer transition-all duration-100 active:scale-95 select-none",
            )}
            onClick={switchForgotPassword}
          >
            {t("auth:login.forgotPassword")}
          </Text>
        )}
      </div>
      <Button
        type="button"
        className="w-full font-montserrat"
        onClick={formik.submitForm}
        sz="md-1"
      >
        {t("auth:login.loginButton")}
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
      <Text>
        {t("auth:login.dontHaveAccount")}
        &nbsp;
        <Link className="font-bold" to="/register">
          {t("auth:login.registerButton")}
        </Link>
      </Text>

      {isShowClose && (
        <Text
          className={clsx(
            "absolute top-3 right-5 text-[20px] text-gradient-main hover:text-single-main cursor-pointer",
          )}
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </Text>
      )}
    </div>
  );
};
