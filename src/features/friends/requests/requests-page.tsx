import React from "react";
import FriendRequests from "./components/friend-request";
import { SidebarPage } from "@/features/components/sidebar-page-layout";

interface RequestsPageProps {}

const RequestsPage: React.FC<RequestsPageProps> = () => {
  return (
    <SidebarPage>
      <FriendRequests />
    </SidebarPage>
  );
};

export default React.memo(RequestsPage);
