import React, { useEffect, useState } from 'react';

import styled from 'styled-components';
import { Mousewheel } from 'swiper/modules';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';

import photo from '@/assets/photo.svg';
import X from '@/assets/x.svg';

const SWIPER_CLASSNAME = 'counter-swiper';

interface CountWheelPickerProps {
  onSubmit: (selectNumber: number) => Promise<void>;
  setViewCount: React.Dispatch<React.SetStateAction<boolean>>;
  numOfParticipants: number;
}

interface SlideContentProps {
  $isActive: boolean;
  $index: number;
  $activeIndex: number;
  $totalSlides: number;
}

export const CountWheelPicker = ({
  onSubmit,
  setViewCount,
  numOfParticipants,
}: CountWheelPickerProps) => {
  const length = Math.floor(50 / numOfParticipants);
  const list = Array.from({ length }, (_, index) => index + 1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectNumber, setSelectNumber] = useState<number>(1);

  useEffect(() => {
    setSelectNumber(activeIndex + 1);
  }, [activeIndex]);

  const handleCancel = () => {
    setViewCount(false);
  };

  const onSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  };

  // NOTE: slideToClickedSlide + loop 사용 시 슬라이드가 사라지는 이슈가 있어 slideToClickedSlide 기능을 직접 구현
  // @see https://github.com/nolimits4web/swiper/issues/7148
  const moveSlidesOnClick = (event: React.MouseEvent) => {
    const swiperEl = document.querySelector(
      `.${SWIPER_CLASSNAME}`,
    ) as HTMLElement & {
      swiper?: SwiperClass;
    };
    if (!swiperEl?.swiper) {
      return;
    }

    const { swiper } = swiperEl;
    const clickedSlide = (event.target as HTMLElement).closest('.swiper-slide');
    const swiperContainer = swiperEl.querySelector('.swiper-wrapper');

    if (clickedSlide && swiperContainer) {
      const slides = Array.from(swiperContainer.children);
      const activeSlideIndex = slides.findIndex((slide) =>
        slide.classList.contains('swiper-slide-active'),
      );
      const clickedSlideIndex = slides.indexOf(clickedSlide);

      if (clickedSlideIndex > activeSlideIndex) {
        swiper.slideNext();
      } else if (clickedSlideIndex < activeSlideIndex) {
        swiper.slidePrev();
      }
    }
  };

  return (
    <ModalContainer>
      <Header>
        <Title>{numOfParticipants}명이서 몇 번씩 이어 쓸까요?</Title>
        <Cancel onClick={handleCancel}>
          <img
            src={X}
            alt="X Icon"
            style={{
              width: '14px',
              height: '14px',
            }}
          />
        </Cancel>
      </Header>
      <Contents>
        <List>
          <Select>&nbsp;번씩</Select>
          <Picker>
            <div
              style={{ width: '280px', height: '186px', overflow: 'hidden' }}
            >
              <Swiper
                className={SWIPER_CLASSNAME}
                direction="vertical"
                slidesPerView={5}
                loop={true}
                mousewheel={{
                  sensitivity: 2,
                }}
                centeredSlides={true}
                modules={[Mousewheel]}
                onSlideChange={onSlideChange}
                style={{ height: '100%' }}
              >
                {list.map((no, index) => (
                  <SwiperSlide key={no} style={{ height: 'calc(15rem / 4)' }}>
                    <SlideContent
                      $isActive={index === activeIndex}
                      $index={index}
                      $activeIndex={activeIndex}
                      $totalSlides={list.length}
                      onClick={moveSlidesOnClick}
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
              style={{ width: '14px', height: '14px' }}
            />
          </IconImg>
          <TitleTxt>만들어질 그림 개수</TitleTxt>
          <TotalTxt>
            <span style={{ fontFamily: 'GmarketSans', marginTop: '2.8px' }}>
              {selectNumber * numOfParticipants}
            </span>
            <span style={{ fontFamily: 'SUIT' }}>개</span>
          </TotalTxt>
        </Notice>
      </Contents>
      <Button onClick={() => onSubmit(selectNumber)}>
        <ButtonTxt>시작하기</ButtonTxt>
      </Button>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  padding: 0px 16px 20px 16px;

  background: #fff;
  border-radius: 20px 20px 0px 0px;
`;
const Header = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 24px;
  align-items: center;
  align-self: stretch;

  width: 100%;

  padding: 16px 0px 16px 0px;
`;
const Title = styled.div`
  flex: 1 0 0;

  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;
`;
const Cancel = styled.span`
  box-sizing: border-box;
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  padding: 4.175px 4.167px 3.825px 3.833px;

  cursor: pointer;
`;
const Contents = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;

  padding: 0px 16px 20px 16px;

  cursor: grab;
`;
const List = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 288px;
  height: 200px;

  padding: 8px 0px 16px 0px;

  background: #f1f3f5;
  border-radius: 16px;
`;
const Picker = styled.div`
  position: relative;
  z-index: 1;

  margin-right: 35px;
`;
const Select = styled.div`
  position: absolute;
  bottom: 83.5px;
  z-index: 1;

  box-sizing: border-box;
  display: flex;

  gap: 2px;
  align-items: center;
  justify-content: center;

  width: 240px;
  height: 40px;

  padding: 8px 0px;
  padding-left: 36px;

  font-family: SUIT;
  font-size: 20px;
  font-style: normal;
  font-weight: 500;

  line-height: 32px;

  color: #ffa256;

  letter-spacing: -0.5px;

  background: #fff;
  border-radius: 50px;
`;
const SlideContent = styled.div<SlideContentProps>`
  display: flex;

  align-items: center;
  justify-content: center;

  height: calc(14rem / 5);

  font-family: 'GmarketSans';
  font-size: ${(props) => {
    const { $index, $activeIndex, $totalSlides } = props;
    const distance = Math.abs(
      ($index - $activeIndex + $totalSlides) % $totalSlides,
    );

    if (distance === 0) {
      return '24px';
    } else if (distance === 1 || distance === $totalSlides - 1) {
      return '22px';
    }
    return '20px';
  }};
  font-style: normal;
  font-weight: 400;

  line-height: normal;

  color: ${(props) => (props.$isActive ? '#ffa256' : '#CED4DA')};

  text-align: center;
  letter-spacing: -0.096px;
  letter-spacing: ${(props) => {
    const { $index, $activeIndex, $totalSlides } = props;
    const distance = Math.abs(
      ($index - $activeIndex + $totalSlides) % $totalSlides,
    );

    if (distance === 0) {
      return '-0.096px';
    } else if (distance === 1 || distance === $totalSlides - 1) {
      return '-0.088px';
    }
    return '-0.08px';
  }};

  cursor: pointer;

  opacity: ${(props) => {
    const { $index, $activeIndex, $totalSlides } = props;
    const distance = Math.abs(
      ($index - $activeIndex + $totalSlides) % $totalSlides,
    );

    if (distance === 0) {
      return '1';
    } else if (distance === 1 || distance === $totalSlides - 1) {
      return '1';
    }
    return '0.5';
  }};

  transition:
    color 0.11s ease,
    opacity 0.11s ease,
    letter-spacing 0.11s ease,
    font-size 0.11s ease; /* 부드러운 전환 효과 */
`;
const Notice = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  align-items: center;

  width: 288px;

  padding: 2px 4px 8px 4px;
  margin-top: 16px;
`;
const IconImg = styled.div`
  position: relative;
  left: 0;

  display: flex;
`;
const TitleTxt = styled.div`
  display: flex;

  gap: 6px;
  align-items: center;

  margin-top: 2px;
  margin-left: 5px;

  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #868e96;

  text-align: center;
  letter-spacing: -0.5px;
`;
const TotalTxt = styled.div`
  position: absolute;
  right: 0;

  display: flex;

  gap: 2px;
  align-items: center;

  margin-bottom: 2px;

  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: #495057;

  text-align: center;
  letter-spacing: -0.5px;
`;

const Button = styled.button`
  position: relative;

  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 288px;
  height: 48px;

  padding: 14px 0px;

  background: #ffa256;
  border-radius: 50px;
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

  color: #fff;

  letter-spacing: -0.5px;
`;
