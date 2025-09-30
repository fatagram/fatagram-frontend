import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterValidator } from "@/api/user/validate/register.validator";
import RegisterDto from "@/api/user/dto/register.dto";
import { ErrorKey, ErrorCodes } from "@/api/user/dto/register.dto";
import { RegisterService } from "@/api/user/register.api";
import OverlayLoading from "@/components/organisms/overlay-loading/overlay-loading";
import { useTranslation } from "react-i18next";
import { Result } from "@/api/common/result";
import Textbox, { PasswordBox } from "@/components/atoms/textbox";
import Logo from "@/components/atoms/logo";
import Text from "@/components/atoms/text";
import Checkbox from "@/components/atoms/checkbox";
import Link from "@/components/atoms/link";
import Button from "@/components/atoms/button";

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
  // useState hooks
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // States
  const [firstNameError, setFirstNameError] = React.useState<string>("");
  const [lastNameError, setLastNameError] = React.useState<string>("");
  const [usernameError, setUsernameError] = React.useState<string>("");
  const [passwordError, setPasswordError] = React.useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = React.useState<string>("");
  const [emailError, setEmailError] = React.useState<string>("");
  const [phoneError, setPhoneError] = React.useState<string>("");
  const [unknownError, setUnknownError] = React.useState<string>("");
  const [isShowClose] = React.useState<boolean>(showClose);
  const [isShowLogo] = React.useState<boolean>(showLogo);
  const [isFirstStep, setIsFirstStep] = React.useState<boolean>(true);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // Refs
  const btnNextStrepRef = React.useRef<HTMLButtonElement>(null);
  const btnRegisterRef = React.useRef<HTMLButtonElement>(null);
  const btnBackStepRef = React.useRef<HTMLLabelElement>(null);
  const firstStepRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for the first step inputs
  const secondStepRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for the second step inputs
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const setRef = (
    stepRefs: React.RefObject<(HTMLInputElement | null)[]>,
    el: HTMLInputElement | null,
    index: number,
  ) => {
    stepRefs.current[index] = el;
  };

  // Other hooks
  const { t } = useTranslation() as { t: (key: string) => string };

  // useNavigate hook
  const navigate = useNavigate();

  // Update formData function
  const updateFormData = (field: string, value: string) =>
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

  // resetErrors function
  // This function resets all the error messages.
  const resetErrors = (): void => {
    setFirstNameError("");
    setLastNameError("");
    setUsernameError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setEmailError("");
    setPhoneError("");
  };

  // errorMap object
  // This object maps the error codes to the corresponding error state.
  const errorMap: Record<ErrorKey, React.Dispatch<React.SetStateAction<string>>> = {
    USERNAME_NOT_CORRECT_FORMAT: setUsernameError,
    PASSWORD_NOT_CORRECT_FORMAT: setPasswordError,
    EMAIL_NOT_CORRECT_FORMAT: setEmailError,
    FIRSTNAME_NOT_CORRECT_FORMAT: setFirstNameError,
    LASTNAME_NOT_CORRECT_FORMAT: setLastNameError,
    PHONE_NUMBER_NOT_CORRECT_FORMAT: setPhoneError,
    UNKNOWN_ERROR: setUnknownError,
    INTERNAL_SERVER_ERROR: setUnknownError,
    REGISTER_USERNAME_EXISTED: setUsernameError,
    EMAIL_EXISTED: setEmailError,
  };

  // validateInput function
  // This function validates the input fields.
  const validateInput = (): boolean => {
    const registerDto: RegisterDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
    };
    const errorCodes = RegisterValidator.validate(registerDto).filter(
      (code): code is ErrorKey => code in ErrorCodes,
    );

    errorCodes.forEach((code) => {
      errorMap[code]?.(t(ErrorCodes[code]));
    });
    return errorCodes.length === 0;
  };

  // handleRegister function
  // This function handles the registration process.
  const handleRegister = async () => {
    resetErrors();
    if (!validateInput()) return;
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    const registerDto: RegisterDto = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      username: formData.username,
      password: formData.password,
      email: formData.email,
      phone: formData.phone,
    };
    const authService = new RegisterService();
    setIsLoading(true);
    const result: Result<void> = await authService.register(registerDto);

    if (result.success) {
      navigate("/login", { replace: true });
    } else {
      if (result.errorCodes) {
        const errCodes = result.errorCodes?.filter((code): code is ErrorKey => code in ErrorCodes);
        errCodes?.forEach((code) => {
          errorMap[code]?.(t(ErrorCodes[code]));
        });
      } else if (result.errorCode) {
        var code = result.errorCode as ErrorKey;
        errorMap[code]?.(t(ErrorCodes[code]));
      }
      if (lastNameError || firstNameError || emailError || phoneError) {
        setIsFirstStep(true);
      }
    }
    setIsLoading(false);
  };

  // Next step function: this function handles the next step button click event.
  const handleNextStep = () => {
    setIsFirstStep(!isFirstStep);
  };

  // Back step function: this function handles the back step button click event.
  useEffect(() => {
    if (isFirstStep) {
      firstStepRefs.current[0]?.focus();
    } else {
      secondStepRefs.current[0]?.focus();
    }
    setCurrentIndex(0);
  }, [isFirstStep]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        if (isFirstStep) btnNextStrepRef.current?.click();
        else btnRegisterRef.current?.click();
      } else if (event.key === "ArrowUp") {
        const index = currentIndex - 1 >= 0 ? currentIndex - 1 : currentIndex;
        if (isFirstStep) firstStepRefs.current[index]?.focus();
        else secondStepRefs.current[index]?.focus();
        setCurrentIndex(index);
      } else if (event.key === "ArrowDown") {
        if (isFirstStep) {
          const index =
            currentIndex + 1 < firstStepRefs.current.length ? currentIndex + 1 : currentIndex;
          firstStepRefs.current[index]?.focus();
          setCurrentIndex(index);
        } else {
          const index =
            currentIndex + 1 < secondStepRefs.current.length ? currentIndex + 1 : currentIndex;
          secondStepRefs.current[index]?.focus();
          setCurrentIndex(index);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFirstStep, currentIndex]);

  return (
    <form
      className={`relative flex flex-col justify-center
             animate-fade-in rounded-lg p-[20px] 
             sm:p-[30px] bg-[var(--second-bg-color)] gap-5
            ${className}`}
    >
      {/* Overlay Loading */}
      {isLoading && <OverlayLoading />}
      {/* Logo Fatagram */}
      {isShowLogo && <Logo />}

      <Text
        sz="xl-2"
        weight="extrabold"
        className="uppercase sm:text-[45px] text-[45px] text-single-third select-none text-center"
      >
        {t("user:register.title")}
      </Text>

      {isFirstStep ? (
        <div className="animate-left-to-right relative flex flex-col items-center sm:gap-[20px] gap-[15px] w-full">
          <div className="flex gap-[10px] w-full">
            <div className="w-full">
              <Textbox
                value={formData.firstName}
                ref={(el) => setRef(firstStepRefs, el, 0)}
                className="text-[13px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
                placeholder={t("user:register.firstName")}
                onChange={(e) => updateFormData("firstName", e.target.value)}
                isWrong={firstNameError ? true : false}
              />
              <Text
                sz="sm-1"
                color="danger"
                className={`${firstNameError ? "" : "hidden"} px-[5px]`}
              >
                {firstNameError}
              </Text>
            </div>
            <div className="w-full">
              <Textbox
                value={formData.lastName}
                ref={(el) => setRef(firstStepRefs, el, 1)}
                className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
                placeholder={t("user:register.lastName")}
                onChange={(e) => updateFormData("lastName", e.target.value)}
                isWrong={lastNameError ? true : false}
              />
              <Text
                sz="sm-1"
                color="danger"
                className={`${lastNameError ? "" : "hidden"} px-[5px]`}
              >
                {lastNameError}
              </Text>
            </div>
          </div>

          <div className="w-full">
            <Textbox
              value={formData.email}
              ref={(el) => setRef(firstStepRefs, el, 2)}
              className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
              placeholder={t("user:register.email")}
              onChange={(e) => updateFormData("email", e.target.value)}
              isWrong={emailError ? true : false}
            />
            <Text sz="sm-1" color="danger" className={`${emailError ? "" : "hidden"} px-[5px] `}>
              {emailError}
            </Text>
          </div>
          <div className="w-full">
            <Textbox
              value={formData.phone}
              ref={(el) => setRef(firstStepRefs, el, 3)}
              className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
              placeholder={t("user:register.phone")}
              onChange={(e) => updateFormData("phone", e.target.value)}
              isWrong={phoneError ? true : false}
            />
            <Text sz="sm-1" color="danger" className={`${phoneError ? "" : "hidden"} px-[5px] `}>
              {phoneError}
            </Text>
          </div>

          <Text sz="sm-1" color="danger" className={`${unknownError ? "" : "hidden"} px-[5px] `}>
            {unknownError}
          </Text>
          <Button
            ref={btnNextStrepRef}
            type="button"
            sz="md-1"
            className={`w-full`}
            onClick={handleNextStep}
          >
            <Text>{t("user:register.nextButton")}</Text>
          </Button>
        </div>
      ) : (
        <div className="animate-right-to-left relative flex flex-col items-center sm:gap-[20px] gap-[15px] w-full">
          <div className="w-full">
            <Textbox
              value={formData.username}
              autoComplete="username"
              ref={(el) => setRef(secondStepRefs, el, 0)}
              className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
              placeholder={t("user:register.username")}
              onChange={(e) => updateFormData("username", e.target.value)}
              isWrong={usernameError ? true : false}
            />
            <Text
              sz="sm-1"
              color="danger"
              className={`${usernameError ? "" : "hidden"} px-[5px] `}
            >
              {usernameError}
            </Text>
          </div>
          <div className="w-full">
            <PasswordBox
              value={formData.password}
              ref={(el) => setRef(secondStepRefs, el, 1)}
              className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
              placeholder={t("user:register.password")}
              onChange={(e) => updateFormData("password", e.target.value)}
              isWrong={passwordError ? true : false}
            />
            <Text
              sz="sm-1"
              color="danger"
              className={`${passwordError ? "" : "hidden"} px-[5px] `}
            >
              {passwordError}
            </Text>
          </div>
          <div className="w-full">
            <PasswordBox
              value={formData.confirmPassword}
              ref={(el) => setRef(secondStepRefs, el, 2)}
              className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
              placeholder={t("user:register.confirmPassword")}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              isWrong={confirmPasswordError ? true : false}
            />
            <Text
              sz="sm-1"
              color="danger"
              className={`${confirmPasswordError ? "" : "hidden"} px-[5px]`}
            >
              {confirmPasswordError}
            </Text>
          </div>
          <Checkbox
            className="text-[15px] text-single-third gap-[8px]"
            label={
              <div className="flex items-center flex-wrap">
                {t("user:register.agree")}&nbsp;
                <Link className="sm:text-[15px]" to="/terms">
                  {t("user:register.termsOfService")}
                </Link>
                &nbsp;
                {t("user:register.and")}&nbsp;
                <Link className="sm:text-[15px]" to="/policy">
                  {t("user:register.privacyPolicy")}
                </Link>
                .
              </div>
            }
          />

          <Button
            ref={btnRegisterRef}
            type="button"
            sz="md-1"
            className={`w-full`}
            onClick={handleRegister}
          >
            <Text>{t("user:register.registerButton")}</Text>
          </Button>
          <Text
            ref={btnBackStepRef}
            className="flex gap-1 items-center text-single-second hover:text-single-main"
            onClick={handleNextStep}
          >
            <i className="fa-solid fa-arrow-left"></i>
            {t("user:register.gobackButton")}
          </Text>
        </div>
      )}
      <div className="relative flex justify-center">
        <Link className={"sm:text-[15px] font-bold"} to="/login">
          {t("user:register.loginButton")}
        </Link>
      </div>

      {isShowClose && (
        <Text
          sz="lg-1"
          className={`absolute z-50 top-3 right-5 text-gradient-main hover:text-single-main cursor-pointer`}
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </Text>
      )}
    </form>
  );
};

export default RegisterForm;
