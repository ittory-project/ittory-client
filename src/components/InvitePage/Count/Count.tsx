import React, { useEffect, useState } from "react";
import styled from "styled-components";
import X from "../../../../public/assets/x.svg";
import photo from "../../../../public/assets/photo.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";

interface Props {
  setViewCount: React.Dispatch<React.SetStateAction<boolean>>;
  member: number;
}

export const Count = ({ setViewCount, member }: Props) => {
  const list = Array.from({ length: 50 }, (_, index) => index + 1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectNumber, setSelectNumber] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectNumber(activeIndex + 1);
  }, [activeIndex]);

  const handleCancel = () => {
    setViewCount(false);
  };

  const navigateToConnection = () => {
    navigate("/Connection");
  };

  return (
    <ModalContainer>
      <Header>
        <Title>{member}명이서 몇 번씩 이어 쓸까요?</Title>
        <Cancel onClick={handleCancel}>
          <img src={X} alt="X Icon" style={{ width: "12px", height: "12px" }} />
        </Cancel>
      </Header>
      <Contents>
        <List>
          <Select>번씩</Select>
          <Picker>
            <div style={{ width: "100%", height: "14rem", overflow: "hidden" }}>
              <Swiper
                direction={"vertical"}
                slidesPerView={5}
                loop={true}
                loopAdditionalSlides={5}
                slideToClickedSlide={true}
                centeredSlides={true}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                style={{ height: "100%" }}
              >
                {list.map((no, index) => (
                  <SwiperSlide key={no} style={{ height: "calc(15rem / 4)" }}>
                    <SlideContent
                      isActive={index === activeIndex}
                      index={index}
                      activeIndex={activeIndex}
                      totalSlides={list.length}
                    >
                      {no}
                    </SlideContent>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </Picker>
        </List>
        <Notice>
          <IconImg>
            <img
              src={photo}
              alt="photo Icon"
              style={{ width: "14px", height: "14px" }}
            />
          </IconImg>
          <TitleTxt>만들어질 그림 개수</TitleTxt>
          <TotalTxt>{selectNumber * member}개</TotalTxt>
        </Notice>
      </Contents>
      <Button>
        <ButtonTxt onClick={navigateToConnection}>시작하기</ButtonTxt>
      </Button>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 27rem;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 16px 20px 16px;
`;
const Header = styled.div`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 16px 8px 16px 8px;
  align-items: center;
  align-self: stretch;
  gap: 24px;
`;
const Title = styled.div`
  flex: 1 0 0;
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Cancel = styled.span`
  display: flex;
  width: 20px;
  height: 20px;
  box-sizing: border-box;
  padding: 4.175px 4.167px 3.825px 3.833px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
const Contents = styled.div`
  display: flex;
  position: relative;
  width: 288px;

  overflow:
  padding: 0px 16px 0px 16px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const List = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 288px;
  height: 15rem;
  padding: var(--Border-Radius-radius_300, 8px) 0px 16px 0px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  background: #f1f3f5;
  position: relative;
`;
const Picker = styled.div`
  position: relative;
  z-index: 1;
  margin-top: 0.8rem;
`;
const Select = styled.div`
  display: flex;
  width: 244px;
  height: 40px;
  box-sizing: border-box;
  padding: var(--Border-Radius-radius_300, 8px) 0px;
  justify-content: center;
  align-items: center;
  gap: 2px;
  border-radius: 50px;
  background: #fff;
  color: #ffa256;
  padding-left: 4.5rem;
  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: -0.5px;
  position: absolute;
  bottom: 6.02rem;
  z-index: 1;
`;
const SlideContent = styled.div`
  height: calc(14rem / 5);
  display: flex;
  text-align: center;
  font-family: var(--Typography-family-number, "Gmarket Sans");
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -0.096px;
  align-items: center;
  justify-content: center;
  color: ${(props) => (props.isActive ? "#ffa256" : "#CED4DA")};
  opacity: ${(props) => {
    const { index, activeIndex, totalSlides } = props;
    const distance = Math.abs(
      (index - activeIndex + totalSlides) % totalSlides
    );

    if (distance === 0) {
      return "1";
    } else if (distance === 1 || distance === totalSlides - 1) {
      return "1";
    }
    return "0.5";
  }};
  letter-spacing: ${(props) => {
    const { index, activeIndex, totalSlides } = props;
    const distance = Math.abs(
      (index - activeIndex + totalSlides) % totalSlides
    );

    if (distance === 0) {
      return "-0.096px";
    } else if (distance === 1 || distance === totalSlides - 1) {
      return "-0.088px";
    }
    return "-0.08px";
  }};
  font-size: ${(props) => {
    const { index, activeIndex, totalSlides } = props;
    const distance = Math.abs(
      (index - activeIndex + totalSlides) % totalSlides
    );

    if (distance === 0) {
      return "24px";
    } else if (distance === 1 || distance === totalSlides - 1) {
      return "22px";
    }
    return "20px";
  }};
  transition:
    color 0.3s ease,
    opacity 0.3s ease,
    letter-spacing 0.3s ease,
    font-size 0.3s ease; /* 부드러운 전환 효과 */
`;
const Notice = styled.div`
  display: flex;
  width: 288px;
  position: relative;
  box-sizing: border-box;
  padding: 2px 4px 8px 4px;
  align-items: center;
  align-self: stretch;
  margin-top: 16px;
`;
const IconImg = styled.div`
  display: flex;
  position: relative;
  left: 0;
`;
const TitleTxt = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #868e96;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
  margin-top: 2px;
  margin-left: 5px;
`;
const TotalTxt = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #495057;
  text-align: center;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
  position: absolute;
  right: 0;
  margin-bottom: 2px;
`;

const Button = styled.button`
  box-sizing: border-box;
  width: 288px;
  display: flex;
  height: 48px;
  padding: 14px 0px;
  align-items: center;
  gap: 8px;
  position: absolute;
  bottom: 20px;
  justify-content: center;
  border-radius: 50px;
  background: #ffa256;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  color: #fff;
`;
