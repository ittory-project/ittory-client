import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiveLetter } from "../../components/receivePage/ReceiveLetter";

export const ReceiveLetterPage = () => {
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
      <ReceiveLetter />
    </div>
  );
};
