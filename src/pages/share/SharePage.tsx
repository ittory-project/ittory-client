import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShareLetter } from "../../components/sharePage/ShareLetter";

export const ShareLetterPage = () => {
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
      <ShareLetter />
    </div>
  );
};
