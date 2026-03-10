import Card from "@/components/ui/card";
import ProfileIntroduction from "./components/profile-introduction";
import clsx from "clsx";

const PostsPage = () => {
  return (
    <div className={clsx("sm:grid sm:grid-cols-golden flex flex-col gap-2 w-full")}>
      <ProfileIntroduction className={clsx("bg-bg-main rounded-md rounded-l-2xl mt-2")} />
      <Card className={clsx("bg-bg-main rounded-md rounded-r-2xl mt-2")}></Card>
    </div>
  );
};

export default PostsPage;
