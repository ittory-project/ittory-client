import { useEffect } from "react";
import { LetterBox } from "../../components/letterboxPage/LetterBox";
import { useNavigate } from "react-router-dom";

export const LetterBoxPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // 페이지 URL에 "page" 파라미터가 있을 경우, "/letterbox"로 리디렉션
    if (new URLSearchParams(location.search).has("page")) {
      navigate("/letterbox", { replace: true });
    } else {
      // "/letterbox" 페이지에서 뒤로가기를 눌렀을 경우 홈 페이지로 리디렉션
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    // 현재 페이지를 히스토리에 추가하여 뒤로가기 할 수 없게 함
    window.history.pushState(null, "", window.location.href);

    window.addEventListener("popstate", handleGoBack);

    return () => {
      window.removeEventListener("popstate", handleGoBack);
    };
  }, [location]);

  return (
    <div>
      <LetterBox />
    </div>
  );
};
