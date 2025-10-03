import { AvatarSkeletonLoading } from "@/components/atoms/avatar";
import TextSkeletionLoading from "@/components/atoms/text/text.skeleton";
import clsx from "clsx";

const NotificationSkeleton = () => {
  return (
    <div className={clsx("flex items-center")}>
      <AvatarSkeletonLoading alt="Avatar" sz="sm-1" />
      <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
        <TextSkeletionLoading className={clsx("w-full")} sz="sm-1" />
        <TextSkeletionLoading className={clsx("w-[50%]")} sz="sm-1" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
