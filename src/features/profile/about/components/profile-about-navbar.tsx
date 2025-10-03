import Card from "@/components/molecules/card";
import SubNavbar from "@/components/organisms/navigation/sub-navbar";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

type ProfileAboutNavbarProps = {
  className?: string;
};

const ProfileAboutNavbar: React.FC<ProfileAboutNavbarProps> = ({
  className,
}) => {
  const { t } = useTranslation() as { t: (key: string) => string };

  const aboutNavbarItems: {
    icon?: React.ReactNode;
    title: string;
    path: string;
  }[] = [
    { title: t("user:profileAbout.overview"), path: "" },
    {
      title: t("user:profileAbout.workAndEducation"),
      path: "work-and-education",
    },
    { title: t("user:profileAbout.placesLived"), path: "places-lived" },
  ];

  return (
    <Card title={t("user:profileAbout.title")} className={clsx(className)}>
      <SubNavbar className="w-full">
        {aboutNavbarItems.map((item, index) => (
          <SubNavbar.Item key={index} title={item.title} path={item.path} />
        ))}
      </SubNavbar>
    </Card>
  );
};

export default ProfileAboutNavbar;
