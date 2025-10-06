import Card from "@/components/molecules/card";
import ProfileOverview from "./components/profile-introduction";
import clsx from "clsx";

const PostsPage = () => {
  return (
    <div className={clsx("grid grid-cols-golden gap-2 w-full")}>
      <ProfileOverview className={clsx("bg-bg-main rounded-md rounded-l-2xl mt-2")} />
      <Card className={clsx("bg-bg-main rounded-md rounded-r-2xl mt-2")}></Card>
    </div>
  );
};

export default PostsPage;
