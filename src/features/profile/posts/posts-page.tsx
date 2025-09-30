import Card from "@/components/molecules/card";
import ProfileOverview from "./components/profile-introduction";
import Grid from "@/components/atoms/grid";

const PostsPage = () => {
  return (
    <Grid cols={22} gap={8} className="w-full">
      <Grid.Item colSpan={9}>
        <ProfileOverview className="bg-[var(--second-bg-color)] rounded-md mt-2" />
      </Grid.Item>
      <Grid.Item colSpan={13}>
        <Card className="bg-[var(--second-bg-color)] rounded-md mt-2"></Card>
      </Grid.Item>
    </Grid>
  );
};

export default PostsPage;
