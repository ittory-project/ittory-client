import { useEffect } from "react";
import { getJwt, getKakaoCode, getKakaoToken, setJwt } from "../../api/config/setToken";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../../api/service/LoginService";

export const LoginRedirect = () => {
  const code = new URL(window.location.href).searchParams.get("code");
  const navigate = useNavigate();
  
  const setLocalStorageJwt = async (code: string) => {
    try {
      const kakaoToken = getKakaoToken(code)
      const accessToken = kakaoToken?.accessToken
      const response = await postLogin(accessToken)
      setJwt(response.accessToken)
      console.log(getJwt())
      navigate('/')
    } catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (code) {
      setLocalStorageJwt(code)
    }
  }, [code])

  return (
    <div>
      로그인 중입니다
    </div>
  );
};