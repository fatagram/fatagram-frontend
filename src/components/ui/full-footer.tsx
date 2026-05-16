import React from "react";
import { Logo, Text, Button } from "@/components/atoms";
import { useAuth } from "@/contexts";
import { useTranslation } from "react-i18next";

export const FullFooter: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation("home");

  const footerLinks = [
    {
      title: t("footer.categories.products"),
      links: [
        t("footer.links.features"),
        t("footer.links.security"),
        t("footer.links.mobile"),
        t("footer.links.integrations"),
        t("footer.links.updates"),
      ],
    },
    {
      title: t("footer.categories.company"),
      links: [
        t("footer.links.about"),
        t("footer.links.careers"),
        t("footer.links.blog"),
        t("footer.links.press"),
        t("footer.links.partners"),
      ],
    },
    {
      title: t("footer.categories.support"),
      links: [
        t("footer.links.help"),
        t("footer.links.community"),
        t("footer.links.guides"),
        t("footer.links.status"),
        t("footer.links.contact"),
      ],
    },
    {
      title: t("footer.categories.legal"),
      links: [
        t("footer.links.terms"),
        t("footer.links.privacy"),
        t("footer.links.cookies"),
        t("footer.links.copyright"),
        t("footer.links.privacySettings"),
      ],
    },
  ];

  const socialLinks = [
    { icon: "fa-brands fa-twitter", link: "#" },
    { icon: "fa-brands fa-facebook-f", link: "#" },
    { icon: "fa-brands fa-instagram", link: "#" },
    { icon: "fa-brands fa-linkedin-in", link: "#" },
    { icon: "fa-brands fa-github", link: "#" },
  ];

  return (
    <footer className="w-full bg-bg-second/40 border-t border-bg-third backdrop-blur-lg pt-16 pb-8 relative z-10 overflow-hidden">
      {/* Decorative blurred background elements inside footer */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Top Section: CTA or Newsletter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-bg-third/50">
          <div className="flex flex-col gap-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-bold text-text-main">{t("footer.cta.title")}</h3>
            <Text sz="md" wrap="whitespace-normal" className="text-text-third">
              {t("footer.cta.desc")}
            </Text>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            {!isAuthenticated && (
              <Button
                variant="primary"
                sz="lg"
                className="w-full md:w-auto px-8 shadow-lg shadow-primary-500/20"
              >
                {t("footer.cta.signup")}
              </Button>
            )}
            <Button
              variant="secondary"
              sz="lg"
              className="w-full md:w-auto px-8 bg-bg-main border-bg-third"
            >
              {t("footer.cta.learnMore")}
            </Button>
          </div>
        </div>

        {/* Middle Section: Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 py-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2 flex flex-col items-start gap-6">
            <Logo sz="lg" hasSlogan={false} />
            <Text
              sz="sm"
              wrap="whitespace-normal"
              className="text-text-third leading-relaxed max-w-xs text-left"
            >
              {t("footer.branding")}
            </Text>
            {/* Social Icons */}
            <div className="flex gap-4 mt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.link}
                  className="w-10 h-10 rounded-full bg-bg-main border border-bg-third flex items-center justify-center text-text-third hover:text-primary-500 hover:border-primary-500/50 hover:bg-primary-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((column, idx) => (
            <div key={idx} className="flex flex-col gap-5">
              <h4 className="font-bold text-text-main text-lg">{column.title}</h4>
              <ul className="flex flex-col gap-3">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a
                      href="#"
                      className="text-text-third text-sm hover:text-primary-500 transition-colors duration-200 flex items-center group"
                    >
                      <span className="relative overflow-hidden">
                        {link}
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Copyright & Legal */}
        <div className="pt-8 border-t border-bg-third/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <Text sz="sm" className="text-text-fourth">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </Text>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-2 text-text-fourth text-sm cursor-pointer hover:text-text-main transition-colors">
              <i className="fa-solid fa-globe" />
              <span>{t("footer.language")}</span>
              <i className="fa-solid fa-chevron-down text-xs ml-1" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
