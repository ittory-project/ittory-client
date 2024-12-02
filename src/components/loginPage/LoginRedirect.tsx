import { useEffect } from "react";
import {
  getJwt,
  getKakaoToken,
  getUserId,
  setJwt,
  setUserId,
} from "../../api/config/setToken";
import { useNavigate, useLocation } from "react-router-dom";
import { postLogin } from "../../api/service/AuthService";

export const LoginRedirect = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();

  const setLocalStorageJwt = async (code: string) => {
    try {
      const kakaoToken = await getKakaoToken(code);
      if (kakaoToken) {
        const response = await postLogin(kakaoToken.accessToken);
        setJwt(response.accessToken);
        const jwt = getJwt();
        if (jwt) {
          setUserId(jwt);
          console.log(`유저 아이디: ${getUserId()}`);

          if (localStorage.letterId) {
            const letterId = localStorage.letterId;
            console.log(letterId);
            navigate(`/join/${letterId}`);
          } else {
            navigate("/");
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (code) {
      setLocalStorageJwt(code);
    }
  }, [code]);

  return <div>로그인 중입니다</div>;
};
