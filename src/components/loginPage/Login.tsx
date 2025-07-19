import { useNavigate } from 'react-router';
import styled from 'styled-components';

import CloseIconOfficial from '@/assets/btn_close_official.svg?react';
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
        <StyledCloseIcon aria-label="닫기" />
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
  display: flex;

  flex-direction: column;

  justify-content: space-between;

  height: 100%;

  font-family: var(--Typography-family-title);

  background-color: white;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 48px;
  height: 48px;

  padding: 12px;

  cursor: pointer;

  background: transparent;
  border: none;

  &:hover svg {
    color: var(--Color-grayscale-gray600);
  }
`;

const StyledCloseIcon = styled(CloseIconOfficial)`
  width: 24px;
  height: 24px;

  color: var(--Color-grayscale-gray600);
`;

const LogoArea = styled.div`
  display: flex;

  flex: 1;
  flex-direction: column;

  gap: 12px;
  align-items: center;
  justify-content: center;

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
  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;
  justify-content: center;

  padding-bottom: 40px;
  margin: 0 16px;
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
  height: 48px;

  padding: 0 20px;

  font-size: 14px;
  font-weight: bold;

  color: black;

  background-color: #fee500;
  border: none;
  border-radius: 2rem;
`;

const LoginDesc = styled.div`
  font-size: 12px;

  color: var(--Color-grayscale-gray600);

  a {
    font-weight: 600;

    color: var(--Color-grayscale-gray600);

    text-decoration: underline;

    cursor: pointer;
  }
  a:hover {
    font-weight: 700;

    color: var(--Color-grayscale-gray700);
  }
`;
