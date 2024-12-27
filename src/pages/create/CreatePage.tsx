import { Create } from "../../components/createPage/Create";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const CreatePage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };

  useEffect(() => {
    if (localStorage.getItem("load")) {
      localStorage.removeItem("load");
    }
    if (localStorage.getItem("userName")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("letterId");
      localStorage.removeItem("guideOpen");
    }

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
