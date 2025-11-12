import Card from "@/components/molecules/card";
import ProfileAboutNavbar from "./components/profile-about-navbar";
import { Outlet } from "react-router-dom";
import clsx from "clsx";

const ProfileAboutPage = () => {
  return (
    <div className={clsx("grid grid-cols-golden gap-2 lg:flex-row flex-col")}>
      <ProfileAboutNavbar className={clsx("rounded-r-lg mt-2")} />
      <Card className={clsx("rounded-l-lg mt-2 pt-0")}>
        <Outlet />
      </Card>
    </div>
  );
};

export default ProfileAboutPage;
