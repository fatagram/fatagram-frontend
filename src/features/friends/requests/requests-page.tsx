import React from "react";
import FriendRequests from "./components/friend-request";
import { SidebarPage } from "@/features/components/sidebar-page-layout";

const RequestsPage: React.FC = () => {
  return (
    <SidebarPage>
      <FriendRequests />
    </SidebarPage>
  );
};

export default React.memo(RequestsPage);
