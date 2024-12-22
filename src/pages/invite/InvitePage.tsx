import { Invite } from "../../components/InvitePage/Invite";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const InvitePage = () => {
  const navigate = useNavigate();

  //뒤로가기 막기
  const handleGoBack = () => {
    navigate("/");
  };
  useEffect(() => {
    history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, []);

  return (
    <div>
      <Invite />
    </div>
  );
};
