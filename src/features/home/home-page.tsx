import { Button } from "@/components/atoms";
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const handleRedirectToAdminProfile = () => {
    navigate("/zzz");
  };
  return (
    <div className="h-full">
      <Button onClick={handleRedirectToAdminProfile}>Go to Fat Profile</Button>
    </div>
  );
};

export default HomePage;
