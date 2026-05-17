import React, { useEffect } from "react";
import clsx from "clsx";
import { RegisterForm } from "./components/register-form";

// RegisterPage - match layout with LoginPage (hero + form card)
function RegisterPage(): React.ReactElement {
  useEffect(() => {
    document.title = "Register - Fawe";
  }, []);

  return (
    <div
      className={clsx(
        "relative flex flex-col bg-bg-second flex-1 h-full lg:p-4",
        "justify-center items-center",
      )}
    >
      <div className="absolute hidden sm:block inset-0 filter blur-lg opacity-80 background-image" />
      <div
        className={clsx(
          "relative flex bg-bg-second w-full ",
          "flex-1 lg:w-[80%] lg:max-h-[800px]",
          "lg:rounded-3xl rounded-none overflow-hidden",
        )}
      >
        <div
          className={clsx(
            "sm:absolute inset-0 lg:relative hidden sm:flex",
            "flex-1 login-bg justify-center items-center z-0 flex-col gap-4 px-12 text-center",
          )}
        >
          <span
            className="text-[6.5rem] text-white filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.15)] tracking-wide select-none hidden lg:block leading-none transform hover:scale-[1.03] transition-all duration-700 ease-out cursor-default"
            style={{
              fontFamily: '"Playfair Display", serif',
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Feeling
          </span>
          <p
            className="text-sm text-white/95 filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)] tracking-widest max-w-[380px] leading-relaxed hidden lg:block select-none opacity-90 border-t border-white/20 pt-4 mt-2 uppercase font-semibold whitespace-normal break-words"
            style={{
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            Every dawn brings a new feeling, every sunset carries a story. Share your world.
          </p>
        </div>

        <div className="bg-bg-second px-[3rem] py-[1rem] flex-1 m-auto max-w-[500px] z-10 rounded-3xl lg:rounded-none">
          <RegisterForm className="m-auto" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
