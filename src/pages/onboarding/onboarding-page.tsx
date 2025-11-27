import { Logo, Text } from "@/components/atoms";
import { OnboardingForm } from "@/features/onboarding/components/onboarding-form";
import clsx from "clsx";
import { useAuth } from "@/hooks/contexts/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import LoadingPage from "../loading/loading-page";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { isOnBoarding } = useAuth();
  useEffect(() => {
    if (isOnBoarding) {
      navigate("/", { replace: true });
    }
  }, [isOnBoarding]);

  if (isOnBoarding) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-primary-500/10 via-bg-main to-primary-600/10 p-6">
      <div
        className={clsx(
          "relative flex flex-col items-center gap-8 w-full max-w-[700px]",
          "bg-bg-second/80 backdrop-blur-xl rounded-3xl shadow-2xl",
          "p-10 animate-fade-in border border-border-main/50",
        )}
      >
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl" />

        <div className="flex flex-col items-center gap-3 z-10">
          <Logo sz="lg-1" />
          <Text
            sz="xl-2"
            weight="extrabold"
            className="mt-2 !text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-primary-600 font-inter"
          >
            Chào bạn!
          </Text>
          <Text sz="md-2" className="text-text-secondary text-center max-w-[400px]">
            Hãy hoàn tất thông tin cần thiết
          </Text>
        </div>

        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border-main to-transparent" />

        <OnboardingForm />

        <div className="flex items-center gap-2 text-text-third">
          <i className="fa-solid fa-shield-halved text-primary-500" />
          <Text sz="sm-2">Thông tin của bạn được bảo mật tuyệt đối</Text>
        </div>
      </div>
    </div>
  );
}
