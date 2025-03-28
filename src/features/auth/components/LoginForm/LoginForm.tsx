import React from "react";
import Button from "../../../../components/common/Button/Button";
import Textbox from "../../../../components/common/Textbox/Textbox";
import Logo from  "../../../../components/common/Logo/Logo";
import Checkbox from  "../../../../components/common/Checkbox/Checkbox";
import Link from  "../../../../components/common/Link/Link";
import { useNavigate } from "react-router-dom";
import { LoginValidator } from "../../services/LoginValidator";
import LoginDto, { ErrorMessages, ErrorKey } from "../../interfaces/LoginDto";
import AuthService from "../../services/AuthService";
import ServerResponse from "../../../../interfaces/ServerResponse";
import PasswordBox from "../../../../components/common/Textbox/PasswordBox";
import { useAuth } from "../../../../contexts/AuthContext";

interface LoginFormProps {
    switchForgotPassword: () => void;
}

// LoginForm component
const LoginForm: React.FC<LoginFormProps> = ({switchForgotPassword}) => 
 {
    const [username, setUsername] = React.useState<string>("");
    const [password, setPassword] = React.useState<string>("");
    const [usernameError, setUsernameError] = React.useState<string>("");
    const [passwordError, setPasswordError] = React.useState<string>("");
    const [unknownError, setUnknownError] = React.useState<string>("");
    const [isRememberMe, setIsRememberMe] = React.useState<boolean>(true);

    const navigate = useNavigate();
    const { setAuthenticated } = useAuth();

    const resetErrors = (): void => {
        setUsernameError("");
        setPasswordError("");
        setUnknownError("");
    }

    const errorMap: Record<ErrorKey, React.Dispatch<React.SetStateAction<string>>> = {
        USERNAME_NOT_CORRECT_FORMAT : setUsernameError,
        PASSWORD_NOT_CORRECT_FORMAT : setPasswordError,
        UNKNOWN_ERROR : setUnknownError,
        ACCOUNT_NOT_FOUND : setUsernameError,
        WRONG_PASSWORD : setPasswordError,
        INTERNAL_SERVER_ERROR : setUnknownError
    }

    const validateInput = (): boolean => {
        const loginDto: LoginDto = {
            username: username,
            password: password
        }
        const errorCodes = LoginValidator.validate(loginDto);
        errorCodes.forEach((code) => {
            errorMap[code]?.(ErrorMessages[code]);
        })

        return errorCodes.length === 0;
    }

    // handleLogin function
    // This function handles the login process.
    // It calls the login API and handles the response.
    const handleLogin = async () => {
        resetErrors();
        if (!validateInput()) return;
        
        const authService = new AuthService();
        // Call the login API
        const loginDto: LoginDto = {
            username: username,
            password: password
        };
        localStorage.setItem("isRememberMe", isRememberMe.toString());
        const result: ServerResponse = await authService.login(loginDto);

        console.log(result.success);

        if (result.success) {
            setAuthenticated?.(true);
            navigate("/", { replace: true });
        }
        else {
            result.errorCodes?.forEach(code => {
                errorMap[code]?.(ErrorMessages[code]);
            })
        }
    }

    return <form className="flex flex-col items-center gap-[20px] w-[95%]  max-w-[380px] 
        p-[20px] bg-[var(--bg-color-secondary)] shadow-md rounded-lg 
        sm:max-w-[380px] sm:p-[25px] animate-fade-in">

    <Logo/>
    <h2 className="uppercase sm:text-[45px] text-[50px] text-[var(--third-single-color)] font-bold font-jua select-none">Log in</h2>
    <div className="w-full">
        <Textbox className="text-[14px] sm:text-[20px] w-[100%] px-[20px] sm:py-[7px] py-[10px] shadow-sm" placeholder="Username"
            onChange={(e) => setUsername(e.target.value)} isWrong={usernameError !== "" }/>
        <span className={`${usernameError === "" ? "hidden" : ""} text-[13px] px-[5px] text-red-400`}>{usernameError}</span>
    </div>
    <div className="w-full">
        <PasswordBox className="text-[14px] w-[100%] px-[20px] sm:py-[7px] py-[10px] shadow-sm" placeholder="Password"
            onChange={(e) => { setPassword(e.target.value)}} isWrong={passwordError !== ""} autoComplete="current-password"/>
        <span className={`${passwordError === "" ? "hidden" : ""} text-[13px] px-[5px] text-red-400`}>{passwordError}</span>
    </div>
    <div className="flex justify-between w-[95%] items-center gap-[50px]">     
        <Checkbox className="text-[15px] text-[#00230e]" label="Remember me" checked={isRememberMe}
            onChange={(e) => {setIsRememberMe(e.target.checked)}}/>
        <span className="sm:text-[15px] text-[15px] text-[var(--second-single-color)] hover:text-[var(--main-single-color)] hover:cursor-pointer
            transition-all duration-100 active:scale-95 select-none"
            onClick={switchForgotPassword}>Forget password?</span>
    </div>
    <span className={`${unknownError === "" ? "hidden" : ""} text-[13px] px-[5px] text-red-400`}>{unknownError}</span>
    <Button type="button" className={`sm:text-[18px] text-[20px] w-full sm:py-[7px] py-[7px] font-montserrat`}
            onClick={handleLogin}
        >Log in</Button>
    <div>
        <span className="sm:text-[14px] text-[15px] text-[var(--third-single-color)]">Don't have an account yet? </span>
        <Link className={"sm:text-[14px]"} to="/register">Sign up</Link>
    </div>
</form>
}

export default LoginForm;