import React, { useEffect } from "react";
import { LoginValidator } from "@/api/auth/validate/login.validator";
import LoginDto, { ErrorCodes, ErrorKey, LoginResponse } from "@/api/auth/dto/login.dto";
import { useTranslation } from "react-i18next";
import { Result } from "@/api/common/result";
import { Button, Logo, Textbox, Text, PasswordBox, Checkbox, Link } from "@/components/atoms";
import clsx from "clsx";
import { useAuth } from "@/hooks/utilities/use-auth";
import { OverlayLoading } from "@/components/organisms/overlay-loading";

interface LoginFormProps {
  switchForgotPassword?: () => void;
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}

// LoginForm component
const LoginForm: React.FC<LoginFormProps> = ({
  switchForgotPassword,
  showLogo = true,
  showClose = false,
  onClose,
}) => {
  // states
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [unknownError, setUnknownError] = React.useState<string>("");
  const [isRememberMe, setIsRememberMe] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isShowClose] = React.useState<boolean>(showClose);
  const [isShowLogo] = React.useState<boolean>(showLogo);

  const btnRef = React.useRef<HTMLButtonElement>(null);
  const inputUsernameRef = React.useRef<HTMLInputElement>(null);
  const inputPasswordRef = React.useRef<HTMLInputElement>(null);

  const { t } = useTranslation() as { t: (key: string) => string };
  const { logIn } = useAuth();

  const resetErrors = (): void => {
    setUsernameError("");
    setPasswordError("");
    setUnknownError("");
  };

  const errorMap: Record<ErrorKey, React.Dispatch<React.SetStateAction<string>>> = {
    USERNAME_NOT_CORRECT_FORMAT: setUsernameError,
    PASSWORD_NOT_CORRECT_FORMAT: setPasswordError,
    UNKNOWN_ERROR: setUnknownError,
    ACCOUNT_NOT_FOUND: setUsernameError,
    WRONG_PASSWORD: setPasswordError,
    INTERNAL_SERVER_ERROR: setUnknownError,
  };

  const validateInput = (): boolean => {
    const loginDto: LoginDto = {
      username: username,
      password: password,
    };
    const errorCodes = LoginValidator.validate(loginDto).filter(
      (code): code is ErrorKey => code in ErrorCodes,
    );

    errorCodes.forEach((code) => {
      errorMap[code]?.(t(ErrorCodes[code]));
    });

    return errorCodes.length === 0;
  };

  const handleLogin = async () => {
    resetErrors();
    if (!validateInput()) return;

    const loginDto: LoginDto = {
      username: username,
      password: password,
    };
    localStorage.setItem("isRememberMe", isRememberMe.toString());
    setIsLoading(true);
    const result: Result<LoginResponse> = await logIn?.(loginDto);

    if (!result.success) {
      if (result.errorCodes) {
        const errCodes = result.errorCodes?.filter((code): code is ErrorKey => code in ErrorCodes);
        errCodes?.forEach((code) => {
          errorMap[code]?.(t(ErrorCodes[code]));
        });
      } else {
        var code = result.errorCode as ErrorKey;
        errorMap[code]?.(t(ErrorCodes[code]));
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    inputUsernameRef.current?.focus();
    const handleArrowDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowDown") {
        inputPasswordRef.current?.focus();
      } else if (event.key === "ArrowUp") {
        inputUsernameRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleArrowDown);
    return () => {
      document.removeEventListener("keydown", handleArrowDown);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        btnRef.current?.click();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      className={clsx(
        "relative flex flex-col items-center justify-center gap-5 w-[450px] h-[550px]",
        "bg-bg-main rounded-2xl",
        "p-16 animate-fade-in overflow-hidden",
      )}
    >
      {isLoading && <OverlayLoading />}

      {isShowLogo && <Logo />}
      <Text
        sz="xl-1"
        weight="extrabold"
        className={clsx("uppercase text-primary-500", "font-bold font-inter select-none")}
      >
        {t("auth:login.title")}
      </Text>
      <div className="flex flex-col gap-3 w-full">
        <div className="w-full">
          <Textbox
            className={clsx("text-[14px] w-[100%] px-[20px]", "sm:py-[7px] py-[10px] shadow-sm")}
            ref={inputUsernameRef}
            autoComplete="username"
            placeholder={t("auth:login.username")}
            onChange={(e) => setUsername(e.target.value)}
            isWrong={usernameError !== ""}
          />
          <Text
            sz="sm-1"
            className={clsx(usernameError === "" && "hidden", "px-[5px] text-red-400")}
          >
            {usernameError}
          </Text>
        </div>
        <div className="w-full">
          <PasswordBox
            ref={inputPasswordRef}
            className={clsx("text-[14px] w-[100%] px-[20px]", "sm:py-[7px] py-[10px] shadow-sm")}
            placeholder={t("auth:login.password")}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            isWrong={passwordError !== ""}
            autoComplete="current-password"
          />
          <Text
            sz="sm-1"
            className={clsx(passwordError === "" && "hidden", "px-[5px] text-red-400")}
          >
            {passwordError}
          </Text>
        </div>
      </div>
      <div className="flex justify-between w-[95%] items-center gap-[50px]">
        <Checkbox
          className=""
          label={t("auth:login.rememberMe")}
          checked={isRememberMe}
          onChange={(e) => {
            setIsRememberMe(e.target.checked);
          }}
        />
        {switchForgotPassword && (
          <Text
            sz="sm-2"
            className={clsx(
              "text-primary-700 hover:text-primary-600",
              "hover:cursor-pointer transition-all duration-100 active:scale-95 select-none",
            )}
            onClick={switchForgotPassword}
          >
            {t("auth:login.forgotPassword")}
          </Text>
        )}
      </div>
      <Text className={clsx(unknownError === "" && "hidden", "px-[5px] text-red-400")}>
        {unknownError}
      </Text>
      <Button
        type="button"
        className="w-full font-montserrat"
        onClick={handleLogin}
        ref={btnRef}
        sz="md-1"
      >
        {t("auth:login.loginButton")}
      </Button>
      <div className="flex gap-1 items-center">
        <Text sz="sm-2" className="text-text-main">
          {t("auth:login.registerAnswer")}
        </Text>
        <Link className="font-bold" to="/register">
          {t("auth:login.registerButton")}
        </Link>
      </div>

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
    </form>
  );
};

export default LoginForm;
