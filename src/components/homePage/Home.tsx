import { Suspense, useCallback, useEffect, useRef, useState } from 'react';

import Player, { LottieRefCurrentProps } from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import styled, { keyframes } from 'styled-components';

import animation from '@/assets/home/animation.json';
import divider2 from '@/assets/home/bar.png';
import insta from '@/assets/home/insta.svg';
import logo from '@/assets/home/logo.png';
import twitter from '@/assets/home/twitter.svg';

import { accessTokenRepository } from '../../api/config/AccessTokenRepository';
import { Menu } from '../../layout/Menu';
import { SessionLogger } from '../../utils/SessionLogger';
import Header from './Header';

const logger = new SessionLogger('home');

const bg1 = '/assets/home/main.jpg';
const bg8 = '/assets/home/07.jpg';
const body = '/assets/home/body.jpg';

interface $Props {
  $img: string;
}

export const Home = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<HTMLDivElement[]>([]);
  const [headerBgColor, setHeaderBgColor] = useState<boolean>(false);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);
  const handleOverlayClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (!isMenuOpen) {
        logger.debug('스와이프로 메뉴 열음');
        setIsMenuOpen(true);
      }
    },
  });

  const handleButton = () => {
    if (accessTokenRepository.isLoggedIn()) {
      navigate('/create');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.indexOf(
            entry.target as HTMLDivElement,
          );
          if (entry.isIntersecting) {
            if (index === 0) {
              setHeaderBgColor(false);
            } else if (index === 1) {
              setHeaderBgColor(true);
            } else {
              setHeaderBgColor(true);
            }
          }
        });
      },
      { threshold: 0.15 }, // 요소가 50% 이상 보일 때 감지
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (lottieRef.current) {
      lottieRef.current.setSpeed(0.5); // 속도 느리게
    }
  }, []);

  const handleLottieClick = () => {
    if (sectionRefs.current[1]) {
      sectionRefs.current[1].scrollIntoView({
        behavior: 'smooth', // 부드럽게 스크롤
        block: 'start', // 섹션의 시작 부분을 맞춤
      });
    }
  };

  const handleTermsClick = () => {
    window.location.href =
      'https://sequoia-corn-388.notion.site/359541399ee44755883d3d192a07fc47';
  };

  const handlePrivacyPolicyClick = () => {
    window.location.href =
      'https://sequoia-corn-388.notion.site/6ca28b84d08e4b8d8a6bd0ddd6e94ce5';
  };
  const handleInstaClick = () => {
    window.location.href =
      'https://www.instagram.com/ittory.official/?igsh=dWI4NXo4OTd5d2Mw&utm_source=qr';
  };
  const handleTwtClick = () => {
    window.location.href = 'https://x.com/ittoryofficial';
  };

  return (
    <>
      <div {...swipeHandlers}>
        <>
          <MenuOverlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />
          <MenuContainer $isOpen={isMenuOpen}>
            <Suspense>
              <Menu onClose={closeMenu} />
            </Suspense>
          </MenuContainer>
        </>
        <Container ref={containerRef}>
          <Header
            backgroundColor={headerBgColor}
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
          <>
            <FirstSection
              $img={bg1}
              ref={(el) => el && (sectionRefs.current[0] = el)}
            >
              <Logo $img={logo} />
              <ButtonContainer onClick={handleButton}>
                <ButtonTxt>편지 쓰러 가기</ButtonTxt>
              </ButtonContainer>
              <Player
                animationData={animation}
                lottieRef={lottieRef}
                loop
                autoplay
                onClick={handleLottieClick}
                style={{
                  height: '70px',
                  width: '70px',
                  margin: '0 auto',
                  top: '65.5%',
                  position: 'relative',
                }}
              />
            </FirstSection>
            <BodySection ref={(el) => el && (sectionRefs.current[1] = el)}>
              <Image src={body} alt="Long Image" />
            </BodySection>
            <Section
              $img={bg8}
              ref={(el) => el && (sectionRefs.current[2] = el)}
            >
              <FinalButton onClick={handleButton}>
                <ButtonTxt>편지 쓰러 가기</ButtonTxt>
              </FinalButton>
            </Section>
            <LastSection ref={(el) => el && (sectionRefs.current[3] = el)}>
              <SectionBox>
                <Title>잇토리</Title>
                <SubTitle>문의&nbsp;&nbsp;&nbsp;ittory.team@gmail.com</SubTitle>
                <SubTitle>
                  <span
                    style={{ marginRight: '8px', cursor: 'pointer' }}
                    onClick={handleTermsClick}
                  >
                    이용약관
                  </span>
                  <img src={divider2} alt="divider" style={{ height: '9px' }} />
                  <span
                    style={{ marginLeft: '8px', cursor: 'pointer' }}
                    onClick={handlePrivacyPolicyClick}
                  >
                    개인정보&nbsp;&nbsp;처리방침
                  </span>
                </SubTitle>
                <SubTitle>© ITTORY. All rights reserved.</SubTitle>
                <SnsContainer>
                  <SnsIcon
                    src={insta}
                    alt="insta"
                    style={{ cursor: 'pointer' }}
                    onClick={handleInstaClick}
                  />
                  <SnsIcon
                    src={twitter}
                    alt="twitter"
                    style={{ cursor: 'pointer' }}
                    onClick={handleTwtClick}
                  />
                </SnsContainer>
              </SectionBox>
            </LastSection>
          </>
        </Container>
      </div>
    </>
  );
};
const MenuOverlay = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  z-index: 10;

  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: rgb(0 0 0 / 80%);

  opacity: ${(props) => (props.$isOpen ? 1 : 0)};

  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
`;
const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 20;

  visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};

  width: 260px;
  height: calc(var(--vh, 1vh) * 100);

  background: #fff;

  transform: translateX(${(props) => (props.$isOpen ? '0' : '100%')});

  transition: transform 0.3s ease;
`;
const Container = styled.div`
  z-index: 2;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  overflow: hidden scroll;

  scrollbar-width: none;

  background: #fff;
  -ms-overflow-style: none;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;
const BodySection = styled.div`
  display: flex;

  align-items: flex-start; /* 이미지를 위쪽에 정렬 */
  justify-content: center; /* 이미지를 가운데 정렬 */

  width: 100%; /* 화면 크기만큼 차지 */
  min-height: 100vh; /* 최소한 화면 크기만큼 차지 */
`;

const Image = styled.img`
  display: block; /* 불필요한 여백 제거 */

  width: 100%; /* 이미지를 화면 너비에 맞게 */
  height: auto; /* 비율을 유지하여 높이를 자동으로 조정 */
`;
const fadeIn = keyframes`
  from {
    opacity: 0; /* 처음에 투명 */
  }
  to {
    opacity: 1; /* 서서히 보이게 */
  }
`;

const fadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px); /* 아래에서 위로 */
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;
const Logo = styled.div<$Props>`
  position: relative;
  top: 10%;

  width: 170px;
  height: 94px;

  margin: 0 auto;

  pointer-events: none;

  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-size: contain;

  animation: ${fadeInDown} 1.7s ease-out;
`;

const FirstSection = styled.div<$Props>`
  width: 100%; /* 화면 크기만큼 차지 */
  height: calc(var(--vh, 1vh) * 100);

  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-position: center;
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
`;
const Section = styled.div<$Props>`
  width: 100%; /* 화면 크기만큼 차지 */
  height: calc(var(--vh, 1vh) * 100);

  overflow-x: hidden;

  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
`;
const FinalButton = styled.button`
  position: relative;
  top: 89.6%;

  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: calc(100% - 32px);
  height: 48px;

  padding: 8px 20px;
  margin: 0 auto;
  margin-right: 16px;
  margin-left: 16px;

  background: #243348;
  border-radius: 50px;
  box-shadow:
    -1.5px -1.5px 1.5px 0 var(--Color-secondary-navy, #1c2231) inset,
    -3.5px -1.5px 12px 0 var(--Color-secondary-navy, #1c2231) inset;
`;
const ButtonContainer = styled.button`
  position: relative;
  top: 12%;

  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 138px;

  padding: 8px 20px;
  margin: 0 auto;

  background: #243348;
  border-radius: 50px;
  box-shadow:
    -1.5px -1.5px 1.5px 0 var(--Color-secondary-navy, #1c2231) inset,
    -3.5px -1.5px 12px 0 var(--Color-secondary-navy, #1c2231) inset;

  opacity: 0; /* 초기에는 숨김 */

  animation: ${fadeIn} 1.8s ease-out;
  animation-fill-mode: forwards; /* 애니메이션이 끝난 후 상태 유지 */
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px; /* 142.857% */

  color: var(--color-black-white-white, #fff);

  letter-spacing: -0.5px;
`;
const LastSection = styled.div`
  box-sizing: border-box;
  display: flex;

  align-items: center;

  width: 100%;

  padding: 40px 24px;

  overflow-x: hidden;

  scroll-snap-align: start;

  background: #2f3641;
`;
const SectionBox = styled.div`
  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  align-items: flex-start;
`;
const Title = styled.div`
  margin-bottom: 20px;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;

  line-height: 16px; /* 142.857% */

  color: #adb5bd;

  letter-spacing: -0.5px;
`;
const SubTitle = styled.div`
  margin-bottom: 8px;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px; /* 142.857% */

  color: #adb5bd;

  letter-spacing: -0.5px;
`;
const SnsContainer = styled.div`
  margin-top: 16px;
`;

const SnsIcon = styled.img`
  width: 24px;
  height: 24px;

  margin-right: 16px;
`;
