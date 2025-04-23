import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import MainLogo from '../../../public/img/main_logo.svg';
import { getKakaoCode } from '../../api/config/setToken';

const 개인정보처리방침URL =
  'https://sequoia-corn-388.notion.site/6ca28b84d08e4b8d8a6bd0ddd6e94ce5';
const 서비스이용약관URL =
  'https://sequoia-corn-388.notion.site/359541399ee44755883d3d192a07fc47';

export const Login = () => {
  const navigate = useNavigate();

  const handleCloseBtn = () => {
    navigate('/');
  };

  const kakaoLogin = () => {
    getKakaoCode();
  };

  return (
    <LoginContainer>
      <CloseBtn onClick={handleCloseBtn}>
        <span className="visually-hidden">닫기</span>
      </CloseBtn>
      <LogoArea>
        <LogoImage src={MainLogo} alt="Logo" />
        <LogoDescription>마음을 표현하는 새로운 방법!</LogoDescription>
      </LogoArea>
      <BottomArea>
        <LoginBtn onClick={kakaoLogin}>
          <Icon src="/assets/login/kakao_bubble.svg" alt="" />
          카카오로 시작하기
        </LoginBtn>
        <LoginDesc>
          로그인 하시면{' '}
          <a
            href={개인정보처리방침URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            개인정보처리방침
          </a>
          과{' '}
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

const CloseBtn = styled.button`
  height: 20px;
  width: 20px;

  position: absolute;
  top: 12px;
  right: 16px;

  background: url('/assets/btn_close.svg') no-repeat center;
  padding: 0;
  border: none;
  background-size: contain;
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

    &:hover {
      color: #495057;
    }
  }
`;
