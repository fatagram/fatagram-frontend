import { AvatarSkeletonLoading } from "@/components/atoms/avatar"
import TextSkeletionLoading from "@/components/atoms/text/text.skeleton";

const NotificationSkeleton = () => {

    return (
        <div className="flex items-center">
            <AvatarSkeletonLoading alt="Avatar" size="small_2"/>
            <div className="flex flex-col w-full flex-1 gap-2 ml-2">
                <TextSkeletionLoading className="w-full" size="sm-1"/>
                <TextSkeletionLoading className="w-[50%]" size="sm-1"/>
            </div>
        </div>
    )
}

export default NotificationSkeleton;