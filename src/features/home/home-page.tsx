import { FullFooter } from "@/components/ui/full-footer";
import { Button, Text, Logo } from "@/components/atoms";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBolt,
  faShieldHalved,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("home");

  const handleStartChatting = () => {
    navigate("/fatalk");
  };

  return (
    <div className="relative min-h-[calc(100dvh-var(--header-height))] w-full overflow-hidden bg-bg-main flex flex-col items-center justify-center pt-20">
      {/* Enhanced Background Decor */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Animated glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/20 blur-[130px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-pink-500/10 blur-[90px] animate-pulse [animation-delay:4s]" />
      </div>

      {/* Scattered Floating Images */}
      <div className="absolute top-0 left-0 w-full h-[calc(100%-450px)] z-0 overflow-hidden pointer-events-none hidden md:block">
        <div
          className="absolute top-[10%] left-[8%] opacity-0 animate-pop-in"
          style={{ animationDelay: "0.2s" }}
        >
          <img
            src="/images/landing/moment_travel_1778853146394.png"
            alt="Travel Moment"
            className="w-48 h-64 object-cover rounded-2xl shadow-xl rotate-[-12deg] border-[6px] border-bg-main animate-float-image-delayed"
          />
        </div>
        <div
          className="absolute bottom-[10%] right-[8%] opacity-0 animate-pop-in"
          style={{ animationDelay: "0.4s" }}
        >
          <img
            src="/images/landing/moment_friends_1778853184337.png"
            alt="Friends Moment"
            className="w-56 h-56 object-cover rounded-3xl shadow-xl rotate-[8deg] border-[6px] border-bg-main animate-float-image"
          />
        </div>
        <div
          className="absolute top-[15%] right-[12%] opacity-0 animate-pop-in"
          style={{ animationDelay: "0.6s" }}
        >
          <img
            src="/images/landing/moment_cafe_1778853167692.png"
            alt="Cafe Moment"
            className="w-40 h-40 object-cover rounded-full shadow-xl rotate-[15deg] border-[6px] border-bg-main animate-float-image"
          />
        </div>
        <div
          className="absolute bottom-[15%] left-[12%] opacity-0 animate-pop-in"
          style={{ animationDelay: "0.8s" }}
        >
          <img
            src="/images/landing/moment_sunset_1778853202792.png"
            alt="Sunset Moment"
            className="w-48 h-48 object-cover rounded-2xl shadow-xl rotate-[-8deg] border-[6px] border-bg-main animate-float-image-delayed"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl w-full px-6 flex flex-col items-center gap-10 text-center flex-1 pb-20">
        {/* Hero Content */}
        <div className="flex flex-col items-center gap-6 opacity-0 animate-pop-in">
          <div className="p-3 bg-bg-main/80 backdrop-blur-xl rounded-3xl shadow-lg mb-2 border border-bg-third hover:scale-105 transition-transform duration-300">
            <Logo sz="lg" hasSlogan={false} />
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-text-main leading-[1.15]">
            {t("hero.title1")} <span className="text-gradient-main">{t("hero.title2")}</span>
            <br />
            {t("hero.title3")} <span className="text-gradient-second">{t("hero.title4")}</span>
          </h1>

          <Text
            sz="lg"
            wrap="whitespace-normal"
            className="max-w-2xl text-text-second leading-relaxed mt-2 backdrop-blur-md bg-bg-main/50 p-5 rounded-3xl border border-bg-third shadow-sm"
          >
            {t("hero.subtitle")}
          </Text>
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4 opacity-0 animate-pop-in"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            sz="xl"
            variant="primary"
            className="group px-10 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50"
            onClick={handleStartChatting}
          >
            <span className="font-semibold text-lg">{t("hero.cta")}</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="ml-3 group-hover:translate-x-1 transition-transform"
            />
          </Button>

          {!isAuthenticated && (
            <Button
              sz="xl"
              variant="secondary"
              className="px-10 bg-bg-main/80 backdrop-blur-md border-2 border-bg-third hover:border-primary-500/50 hover:bg-bg-second transition-colors"
              onClick={() => navigate("/login")}
            >
              <span className="font-semibold text-lg">{t("hero.login")}</span>
            </Button>
          )}
        </div>

        {/* Feature Preview (Abstract) */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-12 opacity-0 animate-pop-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            { icon: faBolt, title: t("features.speed.title"), desc: t("features.speed.desc") },
            {
              icon: faShieldHalved,
              title: t("features.security.title"),
              desc: t("features.security.desc"),
            },
            {
              icon: faWandMagicSparkles,
              title: t("features.ui.title"),
              desc: t("features.ui.desc"),
            },
          ].map((feature, i) => (
            <div
              key={i}
              className={clsx(
                "p-6 flex flex-col items-center text-center rounded-3xl bg-bg-main/60 border border-bg-third backdrop-blur-md",
                "hover:bg-bg-main hover:shadow-xl hover:border-primary-500/30 transition-all duration-300 hover:-translate-y-2 group",
              )}
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 text-2xl mb-4 group-hover:scale-110 group-hover:bg-primary-500/20 group-hover:rotate-3 transition-all duration-300">
                <FontAwesomeIcon icon={feature.icon} />
              </div>
              <h3 className="text-xl font-bold text-text-main mb-3">{feature.title}</h3>
              <Text sz="sm" wrap="whitespace-normal" className="text-text-third leading-relaxed">
                {feature.desc}
              </Text>
            </div>
          ))}
        </div>
      </div>

      {/* Full Premium Footer */}
      <FullFooter />
    </div>
  );
};

export default HomePage;
