import React, { useEffect } from "react";
import Button from "@/components/common/ui/Button";
import Textbox from "@/components/common/ui/Textbox";
import Logo from "@/components/common/ui/Logo";
import Checkbox from "@/components/common/ui/Checkbox";
import Link from "@/components/common/ui/Link";
import { useNavigate } from "react-router-dom";
import { LoginValidator } from "@/api/auth/validate/login.dto.validate";
import LoginDto, { ErrorCodes, ErrorKey, LoginResponse } from "@/api/auth/dto/login.dto";
import PasswordBox from "@/components/common/ui/Textbox/PasswordBox";
import OverlayLoading from "@/components/common/widgets/OverlayLoading/OverlayLoading";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import Text from "@/components/common/ui/Text";
import { Result } from "@/api/common";

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
    const { login } = useAuth();
    // console.log("Login Function: ", login);


    // hooks
    const navigate = useNavigate();

    const resetErrors = (): void => {
        setUsernameError("");
        setPasswordError("");
        setUnknownError("");
    }

    const errorMap: Record<ErrorKey, React.Dispatch<React.SetStateAction<string>>> = {
        USERNAME_NOT_CORRECT_FORMAT: setUsernameError,
        PASSWORD_NOT_CORRECT_FORMAT: setPasswordError,
        UNKNOWN_ERROR: setUnknownError,
        ACCOUNT_NOT_FOUND: setUsernameError,
        WRONG_PASSWORD: setPasswordError,
        INTERNAL_SERVER_ERROR: setUnknownError
    }

    const validateInput = (): boolean => {
        const loginDto: LoginDto = {
            username: username,
            password: password
        }
        const errorCodes = LoginValidator.validate(loginDto)
            .filter((code): code is ErrorKey => code in ErrorCodes);

        errorCodes.forEach((code) => {
            errorMap[code]?.(t(ErrorCodes[code]));
        })

        return errorCodes.length === 0;
    }

    // handleLogin function
    // This function handles the login process.
    // It calls the login API and handles the response.
    const handleLogin = async () => {

        resetErrors();
        if (!validateInput()) return;

        // Call the login API
        const loginDto: LoginDto = {
            username: username,
            password: password
        };
        localStorage.setItem("isRememberMe", isRememberMe.toString());
        setIsLoading(true);
        const result: Result<LoginResponse> = await login(loginDto);

        if (result.success) {
            navigate("/", { replace: true });
        }
        else {
            if (result.errorCodes) {
                const errCodes = result.errorCodes?.filter((code): code is ErrorKey => code in ErrorCodes);
                errCodes?.forEach(code => {
                    errorMap[code]?.(t(ErrorCodes[code]));
                })
            }
            else 
            {
                var code = result.errorCode as ErrorKey;
                errorMap[code]?.(t(ErrorCodes[code]));
            }
        }
        setIsLoading(false);
    }

    useEffect(() => {
        inputUsernameRef.current?.focus();
        const handleArrowDown = (event: KeyboardEvent) => {
            if (event.key === "ArrowDown") 
            {
                inputPasswordRef.current?.focus();
            }
            else if (event.key === "ArrowUp") {
                inputUsernameRef.current?.focus();
            }
        }
        document.addEventListener("keydown", handleArrowDown);
        return () => {
            document.removeEventListener("keydown", handleArrowDown);
        }
    }, []) 

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                btnRef.current?.click();
            }
        }
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        } 
    }, []);


    return (
        <form className="relative flex flex-col items-center gap-[20px] min-w-[380px]
                        p-[20px] bg-[var(--second-bg-color)] rounded-lg
                        sm:p-[25px] animate-fade-in overflow-hidden">
            {isLoading && <OverlayLoading />}

            {isShowLogo && <Logo />}
            <Text size="xl-2" weight="extrabold" className="uppercase text-[var(--third-single-color)] 
                            font-bold font-inter select-none">{t("auth:login.title")}</Text>
            <div className="w-full">
                <Textbox className="text-[14px] w-[100%] px-[20px] sm:py-[7px] py-[10px] shadow-sm"
                        ref={inputUsernameRef}
                        placeholder={t("auth:login.username")}
                        onChange={(e) => setUsername(e.target.value)} 
                        isWrong={usernameError !== ""} />
                <Text size="sm-1" className={`${usernameError === "" ? "hidden" : ""} px-[5px] text-red-400`}>{usernameError}</Text>
            </div>
            <div className="w-full">
                <PasswordBox ref={inputPasswordRef}
                     className="text-[14px] w-[100%] px-[20px] sm:py-[7px] py-[10px] shadow-sm" 
                     placeholder={t("auth:login.password")}
                    onChange={(e) => { setPassword(e.target.value) }} isWrong={passwordError !== ""} autoComplete="current-password" />
                <Text size="sm-1" className={`${passwordError === "" ? "hidden" : ""} px-[5px] text-red-400`}>{passwordError}</Text>
            </div>
            <div className="flex justify-between w-[95%] items-center gap-[50px]">
                <Checkbox className="text-[15px] text-[#00230e]" label={t("auth:login.rememberMe")} checked={isRememberMe}
                    onChange={(e) => { setIsRememberMe(e.target.checked) }} />
                {switchForgotPassword &&
                    <Text size="sm-2" className="text-[var(--third-single-color)] hover:text-single-main 
                                    hover:cursor-pointer transition-all duration-100 active:scale-95 select-none"
                        onClick={switchForgotPassword}>{t("auth:login.forgotPassword")}
                    </Text>
                }
            </div>
            <Text className={`${unknownError === "" ? "hidden" : ""} px-[5px] text-red-400`}>{unknownError}</Text>
            <Button type="button" className={`w-full font-montserrat`}
                onClick={handleLogin} ref={btnRef}
                 size="md-1">
                {t("auth:login.loginButton")}
            </Button>
            <div className="flex gap-1 items-center">
                <Text size="sm-2" className="text-[var(--third-single-color)]">{t("auth:login.registerAnswer")}</Text>
                <Link className={"sm:text-[15px] font-bold"} to="/register">{t("auth:login.registerButton")}</Link>
            </div>

            {isShowClose &&
                <Text className={`absolute top-3 right-5 text-[20px] text-gradient-main hover:text-single-main cursor-pointer`}
                    onClick={onClose}><i className="fa-solid fa-xmark"></i>
                </Text>
            }
        </form>
    )
}

export default LoginForm;