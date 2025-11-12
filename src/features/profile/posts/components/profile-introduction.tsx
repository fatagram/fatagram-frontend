import { userInfoService } from "@/api/user/user-info.api";
import { userProfileService } from "@/api/user/user-profile.api";
import Card from "@/components/molecules/card";
import React, { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import EditableTextArea from "@/features/settings/components/editable-textarea";
import clsx from "clsx";
import { useAuth } from "@/hooks/utilities/use-auth";
import { useProfilePage } from "../../hooks/use-profile-page";
import { Text } from "@/components/atoms";

interface ProfileIntroductionProps {
  className?: string;
}

const ProfileIntroduction: React.FC<ProfileIntroductionProps> = ({ className }) => {
  const [bio, setBio] = React.useState<string | undefined>(undefined);
  const [isEditBio, setIsEditBio] = React.useState<boolean>(false);
  const [description, setDescription] = React.useState<string | undefined>(undefined);
  const [isEditDescription, setIsEditDescription] = React.useState<boolean>(false);
  const [email, setEmail] = React.useState<string | undefined>(undefined);
  const [phone, setPhone] = React.useState<string | undefined>(undefined);

  const { t } = useTranslation() as { t: (key: string) => string };

  const { isAuthenticated } = useAuth();
  const { isOwner, targetId } = useProfilePage();

  const canEdit = useMemo(() => isAuthenticated && isOwner, [isAuthenticated, isOwner]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await userInfoService.GetUserInfoOverview(targetId ?? "");
      if (response) {
        setBio(response.data?.bio);
        setDescription(response.data?.description);
        setEmail(response.data?.email);
        setPhone(response.data?.phone);
      }
    };
    fetchData();
  }, [targetId]);

  // Handle save bio
  const handleSaveBio = async (value: string | undefined) => {
    var res = await userProfileService.UpdateProfile({ bio: value });
    if (res.success) {
      setBio(value);
      setIsEditBio(false);
    }
  };

  // Handle save description
  const handleSaveDescription = async (value: string | undefined) => {
    var res = await userProfileService.UpdateProfile({ description: value });
    if (res.success) {
      setDescription(value);
      setIsEditDescription(false);
    }
  };

  return (
    <Card
      title={t("user:profilePosts.overview")}
      className={clsx("flex-col gap-4", className)}
      titleClassName="text-2xl font-bold !mb-0"
    >
      {(bio || canEdit) && (
        <EditableTextArea
          editableMode="inline"
          isEdit={isEditBio}
          placeholder={t("user:profilePosts.bioPlaceholder")}
          value={bio}
          onChangeClick={() => setIsEditBio(true)}
          onSaveClick={(value) => handleSaveBio(value)}
          valueClassName="text-[1.2rem] font-semibold"
          canEdit={canEdit || false}
          onCancelClick={() => setIsEditBio(false)}
          btnChildren={
            <Text sz="sm-2">
              <i className="fas fa-pencil-alt"></i> &nbsp; {t("user:profilePosts.bioBtn")}
            </Text>
          }
        />
      )}

      {description && (
        <Text sz="lg-1" weight="bold">
          {t("user:profilePosts.description")}
        </Text>
      )}
      {(description || canEdit) && (
        <EditableTextArea
          editableMode="inline"
          isEdit={isEditDescription}
          placeholder={t("user:profilePosts.descriptionPlaceholder")}
          value={description}
          canEdit={canEdit || false}
          valueClassName="text-[1.1rem]"
          onChangeClick={() => setIsEditDescription(true)}
          onSaveClick={(value) => handleSaveDescription(value)}
          onCancelClick={() => setIsEditDescription(false)}
          btnChildren={
            <Text sz="sm-2">
              <i className="fas fa-pencil-alt"></i> &nbsp; {t("user:profilePosts.descriptionBtn")}
            </Text>
          }
        />
      )}

      {(bio || description) && <hr className="border-[var(--border-color)] w-full" />}

      {email && (
        <div>
          <Text className="hover:text-primary-500">
            <i className="fas fa-envelope" /> &nbsp; {email}
          </Text>
        </div>
      )}
      {phone && (
        <div>
          <Text className="hover:text-primary-500">
            <i className="fas fa-phone"></i> &nbsp; {phone}
          </Text>
        </div>
      )}
    </Card>
  );
};

export default ProfileIntroduction;
