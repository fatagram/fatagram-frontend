import React from "react";
import Button from "../../../../components/common/Button/Button";
import Textbox from "../../../../components/common/Textbox/Textbox";
import Logo from "../../../../components/common/Logo/Logo";
import Checkbox from "../../../../components/common/Checkbox/Checkbox";
import Link from "../../../../components/common/Link/Link";
import { useNavigate } from "react-router-dom";
import { RegisterValidator } from "../../services/Register/RegisterValidator";
import RegisterDto from "../../interfaces/RegisterDto";
import { ErrorKey, ErrorMessages } from "../../interfaces/RegisterDto";
import { RegisterService } from "../../services/Register/RegisterService";
import PasswordBox from "../../../../components/common/Textbox/PasswordBox";
import OverlayLoading from "../../../../components/common/OverlayLoading/OverlayLoading";

interface RegisterFormProps {
  showLogo?: boolean;
  showClose?: boolean;
  onClose?: () => void;
}


const RegisterForm: React.FC<RegisterFormProps> = ({showLogo=true, showClose=false,onClose}) => {

  // useState hooks
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [phone, setPhone] = React.useState<string>("");
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
  
  
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  // useNavigate hook
  const navigate = useNavigate();

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
    PHONE_NOT_CORRECT_FORMAT: setPhoneError,
    UNKNOWN_ERROR: setUnknownError,
    INTERNAL_SERVER_ERROR: setUnknownError,
    REGISTER_USERNAME_EXISTED: setUsernameError,
  };

  // validateInput function
  // This function validates the input fields.
  const validateInput = (): boolean => {
    const registerDto: RegisterDto = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      phone: phone,
    };
    const errorCodes = RegisterValidator.validate(registerDto);
    errorCodes.forEach((code) => {
      errorMap[code]?.(ErrorMessages[code]);
    });
    return errorCodes.length === 0;
  };

  // handleRegister function
  // This function handles the registration process.
  const handleRegister = async () => {
    resetErrors();
    if (!validateInput()) return;
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    const registerDto: RegisterDto = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      phone: phone,
    };
    const authService = new RegisterService();
    setIsLoading(true);
    const result = await authService.register(registerDto);

    if (result.success) {
      navigate("/login", { replace: true });
    }
    else {
      result.errorCodes?.forEach((code) => {
        errorMap[code]?.(ErrorMessages[code]);
      });
    }
    setIsLoading(false);
  };

  // JSX
  return (
    <form
      className="relative flex flex-col items-center sm:gap-[13px] gap-[13px] w-full
                sm:max-w-[420px] max-w-[380px] p-[20px] sm:p-[30px]
                bg-[var(--bg-color-secondary)] shadow-md rounded-lg
                animate-fade-in">
      
      {/* Overlay Loading */}
      {isLoading && <OverlayLoading />}
      {/* Logo Fatagram */}
      {isShowLogo && <Logo /> }
      <h2 className="uppercase sm:text-[45px] text-[45px] text-[var(--third-single-color)] font-bold font-jua select-none">
        Sign up
      </h2>
      <div className="flex gap-[10px] w-full">
        <div className="w-full">
          <Textbox
            className="text-[13px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
            placeholder="First name"
            onChange={(e) => setFirstName(e.target.value)}
            isWrong={firstNameError ? true : false}
          />
          <span
            className={`${firstNameError ? "" : "hidden"
              } text-[13px] px-[5px] text-red-400`}
          >
            {firstNameError}
          </span>
        </div>
        <div className="w-full">
          <Textbox
            className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
            placeholder="Last name"
            onChange={(e) => setLastName(e.target.value)}
            isWrong={lastNameError ? true : false}
          />
          <span
            className={`${lastNameError ? "" : "hidden"
              } text-[13px] px-[5px] text-red-400`}
          >
            {lastNameError}
          </span>
        </div>
      </div>
      <div className="w-full">
        <Textbox
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          isWrong={usernameError ? true : false}
        />
        <span
          className={`${usernameError ? "" : "hidden"
            } text-[13px] px-[5px] text-red-400`}
        >
          {usernameError}
        </span>
      </div>
      <div className="w-full">
        <PasswordBox
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          isWrong={passwordError ? true : false}
        />
        <span
          className={`${passwordError ? "" : "hidden"
            } text-[13px] px-[5px] text-red-400`}
        >
          {passwordError}
        </span>
      </div>
      <div className="w-full">
        <PasswordBox
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          isWrong={confirmPasswordError ? true : false}
        />
        <span
          className={`${confirmPasswordError ? "" : "hidden"
            } text-[13px] px-[5px] text-red-400`}
        >
          {confirmPasswordError}
        </span>
      </div>
      <div className="w-full">
        <Textbox
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          isWrong={emailError ? true : false}
        />
        <span
          className={`${emailError ? "" : "hidden"
            } text-[13px] px-[5px] text-red-400`}
        >
          {emailError}
        </span>
      </div>
      <div className="w-full">
        <Textbox
          className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[5px] py-[10px] shadow-sm"
          placeholder="Phone"
          onChange={(e) => setPhone(e.target.value)}
          isWrong={phoneError ? true : false}
        />
        <span
          className={`${phoneError ? "" : "hidden"
            } text-[13px] px-[5px] text-red-400`}
        >
          {phoneError}
        </span>
      </div>
      <Checkbox
        className={`
            text-[15px] text-[var(--third-single-color)] gap-[8px]
        `}
        label={
          <label>
            I agree to the{" "}
            <Link className={"sm:text-[15px]"} to="/terms">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link className={"sm:text-[15px]"} to="/policy">
              Privacy Policy
            </Link>
            .
          </label>
        }
      />
      <span
        className={`${unknownError ? "" : "hidden"
          } text-[13px] px-[5px] text-red-400`}
      >
        {unknownError}
      </span>
      <Button type="button" size="medium"
        className={`sm:text-[17px] text-[20px] w-full sm:py-[5px] py-[7px] font-montserrat`}
        onClick={handleRegister}
      >
        Sign up
      </Button>
      <div>
        <Link className={"sm:text-[14px]"} to="/login">
          Login
        </Link>
      </div>

      { isShowClose && <span className={`absolute top-3 right-5 text-[20px] text-gradient-main hover:text-[var(--main-single-color)] cursor-pointer`}
                onClick={onClose}><i className="fa-solid fa-xmark"></i></span> }
    </form>
  );
};

export default RegisterForm;
