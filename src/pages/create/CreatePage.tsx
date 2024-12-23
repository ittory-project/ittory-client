import { Create } from "../../components/createPage/Create";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CreatePage = () => {
  const navigate = useNavigate();
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
      <Create />
    </div>
  );
};
