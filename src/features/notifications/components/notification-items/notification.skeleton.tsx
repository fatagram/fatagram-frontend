import { AvatarSkeletonLoading } from "@/components/atoms/avatar";
import TextSkeletionLoading from "@/components/atoms/text/text.skeleton";

const NotificationSkeleton = () => {
  return (
    <div className="flex items-center">
      <AvatarSkeletonLoading alt="Avatar" sz="sm-1" />
      <div className="flex flex-col w-full flex-1 gap-2 ml-2">
        <TextSkeletionLoading className="w-full" sz="sm-1" />
        <TextSkeletionLoading className="w-[50%]" sz="sm-1" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
