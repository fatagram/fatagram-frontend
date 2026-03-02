import { Skeleton } from "@/components/atoms";
import clsx from "clsx";

const NotificationSkeleton = () => {
  return (
    <div className={clsx("flex items-center")}>
      <Skeleton sz="md-2" variant="circle" />
      <div className={clsx("flex flex-col w-full flex-1 gap-2 ml-2")}>
        <Skeleton className={clsx("w-full")} sz="sm-2" />
        <Skeleton className={clsx("w-[50%]")} sz="sm-2" />
      </div>
    </div>
  );
};

export default NotificationSkeleton;
