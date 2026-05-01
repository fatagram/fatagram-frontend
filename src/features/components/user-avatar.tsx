import { Avatar } from "@/components/atoms";
import { useGetUserAvatar } from "../hooks/use-user-profile";
import { ComponentProps } from "@/components/common/component-type";

interface Props extends ComponentProps {
  userId: string;
}

export const UserAvatar = ({ userId, className }: Props) => {
  const { data } = useGetUserAvatar(userId);
  console.log(data);
  return <Avatar src={data?.infos?.avatar} alt="Avatar" sz="sm" className={className} />;
};
