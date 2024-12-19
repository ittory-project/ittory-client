import styled from "styled-components";
import { getKakaoCode } from "../../api/config/setToken";
import MainLogo from "../../../public/img/main_logo.svg";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate()

  const handleCloseBtn = () => {
    navigate('/')
  }

  const kakaoLogin = () => {
    getKakaoCode();
  };

  return (
    <Container>
      <LoginContainer>
        <CloseBtn onClick={handleCloseBtn} src="/assets/btn_close.svg" />
        <Logo src={MainLogo} alt="Logo" />
        <Desc>{"마음을 표현하는 새로운 방법!"}</Desc>
        <LoginBtn onClick={kakaoLogin}>
          <Icon src="/assets/kakao_logo.png" alt="Login Icon" />
          {"카카오로 시작하기"}
        </LoginBtn>
        <LoginDesc>
          {"로그인 하시면 "}
          <a
            href="https://sequoia-corn-388.notion.site/6ca28b84d08e4b8d8a6bd0ddd6e94ce5"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"개인정보처리방침"}
          </a>{" "}
          {"과 "}
          <a
            href="https://sequoia-corn-388.notion.site/359541399ee44755883d3d192a07fc47"
            target="_blank"
            rel="noopener noreferrer"
          >
            {"서비스이용약관"}
          </a>{" "}
          {"에 동의하게 됩니다."}
        </LoginDesc>
      </LoginContainer>
    </Container>
  );
};

const Container = styled.div`
  height: calc(var(--vh, 1vh) * 100);
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 12px 10px;
  box-sizing: border-box;
  background-color: white;
  position: relative;
`;

const CloseBtn = styled.img`
  height: 20px;
  width: 20px;
  position: absolute;
  top: 20px;
  right: 20px;
`;

const Logo = styled.img`
  width: 236px;
  height: 90px;
  margin: 50px 0px 16px;
`;

const Desc = styled.div`
  font-size: 14px;
  color: #868e96;
  margin-bottom: 200px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

const LoginBtn = styled.button`
  width: 288px;
  max-width: 400px;
  height: 48px;
  background-color: #fee500;
  color: black;
  border: none;
  border-radius: 5rem;
  padding: 0 20px;
  cursor: pointer;
  font-size: 16px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginDesc = styled.div`
  font-size: 12px;
  color: #868E96;
  max-width: 300px;
  margin-top: 10px;

  a {
    color: #868E96;
    text-decoration: underline;
    cursor: pointer;
  
    &:hover {
    color: #495057;
  }
`;
