import { useState, useEffect, useRef, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import logo from "../../../public/assets/home/logo.png";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import divider from "../../../public/assets/home/bar.svg";
import twitter from "../../../public/assets/home/twitter.svg";
import insta from "../../../public/assets/home/insta.svg";
import animation from "../../../public/assets/home/animation.json";
import Player, { LottieRefCurrentProps } from "lottie-react";
import { Menu } from "../../layout/Menu";
import { useSwipeable } from "react-swipeable";

const bg1 = "/assets/home/main.jpg";
const bg8 = "/assets/home/07.jpg";
const body = "/assets/home/body.jpg";

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
        console.log("스와이프로 메뉴 열음");
        setIsMenuOpen(true);
      }
    },
    //onSwipedLeft: () => setIsMenuOpen(true),
  });

  const handleButton = () => {
    if (localStorage.jwt) {
      navigate("/create");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.indexOf(
            entry.target as HTMLDivElement
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
      { threshold: 0.15 } // 요소가 50% 이상 보일 때 감지
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
        behavior: "smooth", // 부드럽게 스크롤
        block: "start", // 섹션의 시작 부분을 맞춤
      });
    }
  };

  const handleTermsClick = () => {
    window.location.href =
      "https://sequoia-corn-388.notion.site/359541399ee44755883d3d192a07fc47";
  };

  const handlePrivacyPolicyClick = () => {
    window.location.href =
      "https://sequoia-corn-388.notion.site/6ca28b84d08e4b8d8a6bd0ddd6e94ce5";
  };
  const handleInstaClick = () => {
    window.location.href =
      "https://www.instagram.com/ittory.official/?igsh=dWI4NXo4OTd5d2Mw&utm_source=qr";
  };
  const handleTwtClick = () => {
    window.location.href = "https://x.com/ittoryofficial";
  };

  return (
    <>
      <div {...swipeHandlers}>
        <>
          <MenuOverlay $isOpen={isMenuOpen} onClick={handleOverlayClick} />
          <MenuContainer $isOpen={isMenuOpen}>
            <Menu onClose={closeMenu} />
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
                  height: "70px",
                  width: "70px",
                  margin: "0 auto",
                  top: "65.5%",
                  position: "relative",
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
                    style={{ marginRight: "8px", cursor: "pointer" }}
                    onClick={handleTermsClick}
                  >
                    이용약관
                  </span>
                  <img src={divider} alt="divider" style={{ height: "9px" }} />
                  <span
                    style={{ marginLeft: "8px", cursor: "pointer" }}
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
                    style={{ cursor: "pointer" }}
                    onClick={handleInstaClick}
                  />
                  <SnsIcon
                    src={twitter}
                    alt="twitter"
                    style={{ cursor: "pointer" }}
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
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: rgba(0, 0, 0, 0.8);
  opacity: ${(props) => (props.$isOpen ? 1 : 0)};
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transition:
    opacity 0.3s ease,
    visibility 0.3s ease;
  z-index: 10;
`;
const MenuContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 260px;
  height: calc(var(--vh, 1vh) * 100);
  background: #fff;
  visibility: ${(props) => (props.$isOpen ? "visible" : "hidden")};
  transform: translateX(${(props) => (props.$isOpen ? "0" : "100%")});
  transition: transform 0.3s ease;
  z-index: 20;
`;
const Container = styled.div`
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  z-index: 2;
  overflow-y: scroll;
  //scroll-snap-type: y mandatory;
  //scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: hidden;
  background: #fff;

  /* 스크롤바 숨기기 */
  &::-webkit-scrollbar {
    display: none;
  }
`;
const BodySection = styled.div`
  width: 100%; /* 화면 크기만큼 차지 */
  min-height: 100vh; /* 최소한 화면 크기만큼 차지 */
  display: flex;
  justify-content: center; /* 이미지를 가운데 정렬 */
  align-items: flex-start; /* 이미지를 위쪽에 정렬 */
`;

const Image = styled.img`
  width: 100%; /* 이미지를 화면 너비에 맞게 */
  height: auto; /* 비율을 유지하여 높이를 자동으로 조정 */
  display: block; /* 불필요한 여백 제거 */
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
  width: 170px;
  height: 94px;
  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-size: contain;
  position: relative;
  margin: 0 auto;
  top: 10%;
  animation: ${fadeInDown} 1.7s ease-out;
  pointer-events: none;
`;

const FirstSection = styled.div<$Props>`
  height: calc(var(--vh, 1vh) * 100);
  width: 100%; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  //scroll-snap-align: start;
  background-position: center;
`;
const Section = styled.div<$Props>`
  height: calc(var(--vh, 1vh) * 100);
  width: 100%; /* 화면 크기만큼 차지 */
  background: ${(props) => `url(${props.$img}) no-repeat center center`};
  background-size: cover; /* 이미지가 전체 화면을 덮도록 */
  //scroll-snap-align: start;
  overflow-x: hidden;
`;
const FinalButton = styled.button`
  display: flex;
  width: 288px;
  height: 48px;
  padding: 8px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: #243348;
  box-sizing: border-box;
  box-shadow:
    -1.5px -1.5px 1.5px 0px var(--Color-secondary-navy, #1c2231) inset,
    -3.5px -1.5px 12px 0px var(--Color-secondary-navy, #1c2231) inset;
  margin: 0 auto;
  position: relative;
  top: 89.6%;
`;
const ButtonContainer = styled.button`
  display: flex;
  width: 138px;
  padding: 8px 20px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 50px;
  background: #243348;
  box-sizing: border-box;
  box-shadow:
    -1.5px -1.5px 1.5px 0px var(--Color-secondary-navy, #1c2231) inset,
    -3.5px -1.5px 12px 0px var(--Color-secondary-navy, #1c2231) inset;
  margin: 0 auto;
  position: relative;
  top: 12%;
  animation: ${fadeIn} 1.8s ease-out;
  opacity: 0; /* 초기에는 숨김 */
  animation-fill-mode: forwards; /* 애니메이션이 끝난 후 상태 유지 */
`;
const ButtonTxt = styled.div`
  color: var(--color-black-white-white, #fff);
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 142.857% */
  letter-spacing: -0.5px;
`;
const LastSection = styled.div`
  width: 100vw;
  display: flex;
  width: 100%;
  padding: 40px 24px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  background: #2f3641;
  scroll-snap-align: start;
  overflow-x: hidden;
`;
const SectionBox = styled.div`
  display: flex;
  width: 272px;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
`;
const Title = styled.div`
  color: #adb5bd;
  font-family: var(--Typography-family-body, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px; /* 142.857% */
  letter-spacing: -0.5px;
  margin-bottom: 20px;
`;
const SubTitle = styled.div`
  color: #adb5bd;
  font-family: var(--Typography-family-body, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 142.857% */
  letter-spacing: -0.5px;
  margin-bottom: 8px;
`;
const SnsContainer = styled.div`
  margin-top: 16px;
`;

const SnsIcon = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 16px;
`;
