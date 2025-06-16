import { AvatarSkeletonLoading } from "@/components/common/display/Avatar"
import TextSkeletionLoading from "@/components/common/ui/Text/TextSkeletionLoading";

const NotificationSkeletonLoading = () => {

    return (
        <div className="flex items-center">
            <AvatarSkeletonLoading alt="Avatar" size="small_2"/>
            <div className="flex flex-col w-full flex-1 gap-2 ml-2">
                <TextSkeletionLoading className="w-full" size="small"/>
                <TextSkeletionLoading className="w-[50%]" size="small"/>
            </div>
        </div>
    )
}

export default NotificationSkeletonLoading;