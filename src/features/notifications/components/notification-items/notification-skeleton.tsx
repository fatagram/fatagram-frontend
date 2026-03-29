import { Skeleton } from "@/components/atoms";
import clsx from "clsx";

const NotificationSkeleton = () => {
  return (
    <div className={clsx("flex items-center")}>
      <Skeleton sz="md" variant="circle" />
      <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
        <Skeleton className={clsx("w-full")} sz="sm" />
        <Skeleton className={clsx("w-[50%]")} sz="sm" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
