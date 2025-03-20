import styled from "styled-components";
import { getKakaoCode } from "../../api/config/setToken";
import MainLogo from "../../../public/img/main_logo.svg";
import { useNavigate } from "react-router-dom";

const 개인정보처리방침URL =
  "https://sequoia-corn-388.notion.site/6ca28b84d08e4b8d8a6bd0ddd6e94ce5";
const 서비스이용약관URL =
  "https://sequoia-corn-388.notion.site/359541399ee44755883d3d192a07fc47";

export const Login = () => {
  const navigate = useNavigate();

  const handleCloseBtn = () => {
    navigate("/");
  };

  const kakaoLogin = () => {
    getKakaoCode();
  };

  return (
    <LoginContainer>
      <CloseBtn
        onClick={handleCloseBtn}
        src="/assets/btn_close.svg"
        role="button"
      />
      <LogoArea>
        <LogoImage src={MainLogo} alt="Logo" />
        <LogoDescription>마음을 표현하는 새로운 방법!</LogoDescription>
      </LogoArea>
      <BottomArea>
        <LoginBtn onClick={kakaoLogin}>
          <Icon src="/assets/kakao_logo.png" alt="Login Icon" />
          카카오로 시작하기
        </LoginBtn>
        <LoginDesc>
          로그인 하시면{" "}
          <a
            href={개인정보처리방침URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침
          </a>
          과{" "}
          <a href={서비스이용약관URL} target="_blank" rel="noopener noreferrer">
            서비스이용약관
          </a>
          에 동의하게 됩니다.
        </LoginDesc>
      </BottomArea>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  height: 100%;
  background-color: white;
  position: relative;

  font-family: var(--Typography-family-title);
`;

// TODO: svg icon 사용
// TODO: stylelint 사용? (스타일 속성 간 정렬)
const CloseBtn = styled.img`
  height: 20px;
  width: 20px;

  position: absolute;
  top: 12px;
  right: 16px;
`;

const LogoArea = styled.div`
  position: absolute;
  top: 128px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
`;

const LogoImage = styled.img`
  width: 236px;
  height: 90px;
`;

const LogoDescription = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: var(--Color-grayscale-gray600);
`;

const BottomArea = styled.div`
  position: absolute;
  bottom: 40px;
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

// TODO: button 컴포넌트 공통화
const LoginBtn = styled.button`
  height: 48px;
  width: 100%;
  max-width: 288px;

  background-color: #fee500;

  font-weight: bold;
  font-size: 16px;
  color: black;

  border: none;
  border-radius: 2rem;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoginDesc = styled.div`
  width: 100%;
  max-width: 288px;

  font-size: 12px;
  color: var(--Color-grayscale-gray600);

  a {
    color: var(--Color-grayscale-gray600);

    text-decoration: underline;
    cursor: pointer;

    // Q. 로그인 페이지 디자인에 hover 색상이 없던 것 같은데 정의된 위치(Figma URL)?
    &:hover {
      color: #495057;
    }
  }
`;
