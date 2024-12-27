import { Home } from "../../components/homePage/Home";
import { useEffect } from "react";

export const HomePage = () => {
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
