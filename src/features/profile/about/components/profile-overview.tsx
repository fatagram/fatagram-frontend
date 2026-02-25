import { Button, Text } from "@/components/atoms";
import ProfileAboutSection from "./profile-about-section";
import clsx from "clsx";
import { useProfilePage } from "../../hooks/use-profile-page";
import { useGetUserProfileDetails } from "@/features/hooks/use-user-profile";

type ProfileOverviewProps = {};

const ProfileOverview: React.FC<ProfileOverviewProps> = ({}) => {
  const { targetId, isOwner } = useProfilePage();
  const { data: userProfile } = useGetUserProfileDetails(targetId ?? "");

  const emails = userProfile?.email ? [userProfile.email] : [];
  const phoneNumbers = userProfile?.phone ? [userProfile.phone] : [];

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
                <div key={index} className={clsx("flex", "flex-col")}>
                  <Text weight="bold">{email}</Text>
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
                <div key={index} className={clsx("flex", "flex-col")}>
                  <Text weight="bold">{phone}</Text>
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
