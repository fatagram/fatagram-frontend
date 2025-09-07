import Card from "@/components/common/container/Card";
import ProfileOverview from "../../../../features/user/components/ProfileBody/ProfilePosts/ProfileOverview";
import { useOutletContext } from "react-router-dom";
import { AuthStatus } from "../../AuthStatus";

const PostsPage = () => {
    const authStatus = useOutletContext<AuthStatus>();

    return (
        <div className="flex gap-2">
            <ProfileOverview className="flex-[4]" authStatus={authStatus}/>
            <Card className="bg-[var(--second-bg-color)] rounded-md mt-2 flex-[8]">

            </Card>
        </div>
    )
}

export default PostsPage;