import { userInfoService } from "@/api/user/user-info.api";
import Text from "@/components/atoms/text";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ProfileAboutSection from "./profile-about-section";
import Button from "@/components/atoms/button";
import { useProfilePage } from "../../context/profile-page-context";
import clsx from "clsx";

type ProfileOverviewProps = {};

const ProfileOverview: React.FC<ProfileOverviewProps> = ({}) => {
  const [emails, setEmails] = useState<string[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  const { targetId, isOwner } = useProfilePage();

  useEffect(() => {
    const fetchData = async () => {
      const response = await userInfoService.GetUserInfoOverview(
        targetId ?? ""
      );
      if (response) {
        if (response.data?.email) {
          setEmails([...emails, response.data.email]);
        }
        if (response.data?.phone) {
          setPhoneNumbers([...phoneNumbers, response.data.phone]);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <ProfileAboutSection title="Liên hệ" className={clsx("mb-4", "w-full")}>
        {emails.length > 0 && (
          <div className={clsx("flex", "items-start", "w-full", "gap-4", "mb-6", "mt-4")}>
            <Text sz="lg-3" className={clsx("opacity-50")}>
              <i className="fa-solid fa-envelope"></i>
            </Text>
            <div>
              {emails.map((email, index) => (
                <div className={clsx("flex", "flex-col")}>
                  <Text key={index} weight="bold">
                    {email}
                  </Text>
                  <Text sz="sm-3" className={clsx("opacity-50")}>
                    Email
                  </Text>
                </div>
              ))}
            </div>
            {isOwner && (
              <div className={clsx("ml-auto")}>
                <Button
                  variant="secondary"
                  className={clsx("!rounded-full", "!p-0", "w-10", "h-10")}
                >
                  <i className="fa-solid fa-pencil-alt"></i>
                </Button>
              </div>
            )}
          </div>
        )}
        {phoneNumbers.length > 0 && (
          <div className={clsx("flex", "items-start", "gap-4")}>
            <Text sz="lg-3" className={clsx("opacity-50")}>
              <i className="fa-solid fa-phone"></i>
            </Text>
            <div>
              {phoneNumbers.map((phone, index) => (
                <div className={clsx("flex", "flex-col")}>
                  <Text key={index} weight="bold">
                    {phone}
                  </Text>
                  <Text sz="sm-3" className={clsx("opacity-50")}>
                    Di động
                  </Text>
                </div>
              ))}
            </div>
            {isOwner && (
              <div className={clsx("ml-auto")}>
                <Button
                  variant="secondary"
                  className={clsx("!rounded-full", "!p-0", "w-10", "h-10")}
                >
                  <i className="fa-solid fa-pencil-alt"></i>
                </Button>
              </div>
            )}
          </div>
        )}
      </ProfileAboutSection>
    </div>
  );
};

export default ProfileOverview;
