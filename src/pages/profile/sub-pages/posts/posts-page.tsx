import Card from "@/components/molecules/card";
import ProfileOverview from "../../../../features/user/components/profile-body/profile-posts/profile-introduction";

const PostsPage = () => {

    return (
        <div className="flex gap-2 lg:flex-row flex-col ">
            <ProfileOverview className="flex-[4] bg-[var(--second-bg-color)] rounded-md mt-2"/>
            <Card className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[8]">

            </Card>
        </div>
    )
}

export default PostsPage;