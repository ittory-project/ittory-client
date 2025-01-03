import { Home } from "../../components/homePage/Home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/", { replace: true });
  };
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.history.replaceState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.history.replaceState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, [navigate]);

  useEffect(() => {
    // 현재 페이지를 히스토리에 추가하여 뒤로가기 할 수 없게 함
    window.history.pushState(null, "", window.location.href);
    window.history.replaceState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, [location]);

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
    <>
      <Home />
    </>
  );
};
