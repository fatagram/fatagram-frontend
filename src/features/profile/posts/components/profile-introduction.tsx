import { useGetUserProfileDetails, useUpdateProfile } from "@/features/hooks/use-user-profile";
import Card from "@/components/ui/card";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import EditableTextArea from "@/features/settings/components/editable-textarea";
import { useProfilePage } from "../../hooks/use-profile-page";
import { Text } from "@/components/atoms";
import { useAuth } from "@/contexts";

interface ProfileIntroductionProps {
  className?: string;
}

const ProfileIntroduction: React.FC<ProfileIntroductionProps> = ({ className }) => {
  const [isEditBio, setIsEditBio] = React.useState<boolean>(false);
  const [isEditDescription, setIsEditDescription] = React.useState<boolean>(false);

  const { t } = useTranslation() as { t: (key: string) => string };

  const { isAuthenticated, userId } = useAuth();
  const { isOwner, targetId } = useProfilePage();

  const updateProfileMutation = useUpdateProfile(userId!);

  const canEdit = useMemo(() => (isAuthenticated && isOwner) ?? false, [isAuthenticated, isOwner]);

  const { data } = useGetUserProfileDetails(targetId ?? "");
  const userProfile = data?.infos;

  // Handle save bio
  const handleSaveBio = (value: string | undefined) => {
    updateProfileMutation.fetch(
      { bio: value },
      {
        onSuccess: () => {
          setIsEditBio(false);
        },
        onError: () => {
          console.error("Failed to update bio");
        },
      },
    );
  };

  // Handle save description
  const handleSaveDescription = (value: string | undefined) => {
    updateProfileMutation.fetch(
      { description: value },
      {
        onSuccess: () => {
          setIsEditDescription(false);
        },
        onError: () => {
          console.error("Failed to update description");
        },
      },
    );
  };

  const handleOnChangeBio = (isOpen: boolean) => {
    setIsEditBio(isOpen);
  };

  const handleOnChangeDescription = (isOpen: boolean) => {
    setIsEditDescription(isOpen);
  };

  return (
    <Card
      title={t("user:profilePosts.overview")}
      titleClassName="text-2xl font-bold !mb-0"
      childrenClassName="flex flex-col gap-4"
      className={className}
    >
      {(userProfile?.bio || canEdit) && (
        <EditableTextArea
          editableMode="inline"
          isEdit={isEditBio}
          placeholder={t("user:profilePosts.bioPlaceholder")}
          value={userProfile?.bio || ""}
          title="Bio"
          showTitle={false}
          onSaveClick={(value) => handleSaveBio(value)}
          onOpenChange={handleOnChangeBio}
          valueClassName="text-[1.2rem] font-semibold"
          canEdit={canEdit}
          isLoading={updateProfileMutation.isFetching}
          btnChildren={
            <Text sz="sm">
              <i className="fas fa-pencil-alt"></i> &nbsp; {t("user:profilePosts.bioBtn")}
            </Text>
          }
        />
      )}

      {userProfile?.description && (
        <Text sz="lg" weight="bold">
          {t("user:profilePosts.description")}
        </Text>
      )}
      {(userProfile?.description || canEdit) && (
        <EditableTextArea
          editableMode="inline"
          isEdit={isEditDescription}
          placeholder={t("user:profilePosts.descriptionPlaceholder")}
          title={t("user:profilePosts.description")}
          showTitle={false}
          value={userProfile?.description || ""}
          canEdit={canEdit}
          valueClassName="text-[1.1rem]"
          isLoading={updateProfileMutation.isFetching}
          onSaveClick={(value) => handleSaveDescription(value)}
          onOpenChange={handleOnChangeDescription}
          btnChildren={
            <Text sz="sm">
              <i className="fas fa-pencil-alt"></i> &nbsp; {t("user:profilePosts.descriptionBtn")}
            </Text>
          }
        />
      )}

      {(userProfile?.bio || userProfile?.description) && (
        <hr className="border-[var(--border-color)] w-full opacity-10" />
      )}
    </Card>
  );
};

export default ProfileIntroduction;
