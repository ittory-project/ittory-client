import { useNavigate } from "react-router-dom";
import { Create } from "../../components/createPage/Create";
import { useEffect } from "react";

export const CreatePage = () => {

  const navigate = useNavigate();

  const goHome = () => {
    navigate('/')
  }

  useEffect(() => {
    const handlePopState = () => {
      const confirmLeave = window.confirm("이 페이지를 떠나시겠습니까?");
      if (confirmLeave) {
        goHome();
      } else {
        history.pushState(null, "", window.location.href); 
      }
    };
  
    history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);
  
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);
  
  return (
    <div>
      <Create />
    </div>
  );
};
