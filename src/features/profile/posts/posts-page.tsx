import Card from "@/components/ui/card";
import ProfileIntroduction from "./components/profile-introduction";
import clsx from "clsx";

const PostsPage = () => {
  return (
    <div className={clsx("sm:grid sm:grid-cols-golden flex flex-col sm:gap-2 w-full")}>
      <ProfileIntroduction
        className={clsx("bg-bg-main sm:rounded-md sm:rounded-l-2xl rounded-none sm:mt-2")}
      />
      <Card
        className={clsx("bg-bg-main sm:rounded-md sm:rounded-r-2xl rounded-none sm:mt-2")}
      ></Card>
    </div>
  );
};

export default PostsPage;
