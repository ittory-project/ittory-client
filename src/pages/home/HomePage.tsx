import { Home } from "../../components/homePage/Home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/", { replace: true });
  };
  useEffect(() => {
    history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("load")) {
      localStorage.removeItem("load");
    }
    if (localStorage.getItem("userName")) {
      localStorage.removeItem("userName");
      localStorage.removeItem("letterId");
      localStorage.removeItem("guideOpen");
    }
  }, []);
  return (
    <div>
      <Home />
    </div>
  );
};
