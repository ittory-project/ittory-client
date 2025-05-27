import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import closeButton from '@/assets/btn_close.svg';
import kakaoBubble from '@/assets/login/kakao_bubble.svg';
import MainLogo from '@/assets/main_logo.svg';

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
          <Icon src={kakaoBubble} alt="" />
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
  position: relative;

  height: 100%;

  font-family: var(--Typography-family-title);

  background-color: white;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;

  width: 20px;
  height: 20px;

  padding: 0;

  background: url(${closeButton}) no-repeat center;
  background-size: contain;
  border: none;
`;

const LogoArea = styled.div`
  position: absolute;
  top: 128px;

  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: center;

  width: 100%;
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

  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;
  justify-content: center;

  width: 100%;
`;

const Icon = styled.img`
  width: 20px;
  height: 20px;

  margin-right: 8px;
`;

const LoginBtn = styled.button`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 288px;
  height: 48px;

  padding: 0 20px;

  font-size: 16px;
  font-weight: bold;

  color: black;

  background-color: #fee500;
  border: none;
  border-radius: 2rem;
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
