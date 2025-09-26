import Card from "@/components/molecules/card";
import ProfileAboutNavbar from "./components/profile-about-navbar";
import { Outlet, useOutletContext } from "react-router-dom";

const ProfileAboutPage = () => {

  return (
    <div className="flex gap-2 lg:flex-row flex-col ">
      <ProfileAboutNavbar className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[4]" />
      <Card className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[8] pt-0">
        <Outlet />
      </Card>
    </div>
  );
};

export default ProfileAboutPage;
