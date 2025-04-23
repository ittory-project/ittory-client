import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Swiper, SwiperClass, SwiperRef, SwiperSlide } from 'swiper/react';

import bg1 from '../../../../public/assets/connect/bg1.png';
import bg2 from '../../../../public/assets/connect/bg2.png';
import bg3 from '../../../../public/assets/connect/bg3.png';
import bg4 from '../../../../public/assets/connect/bg4.png';
import bg5 from '../../../../public/assets/connect/bg5.png';
import photo from '../../../../public/assets/photo.svg';
import X from '../../../../public/assets/x.svg';
import { postRepeatCount } from '../../../api/service/LetterService';
import { postRandom } from '../../../api/service/ParticipantService';
import { startLetterWs } from '../../../api/service/WsService';

interface Props {
  setViewCount: React.Dispatch<React.SetStateAction<boolean>>;
  member: number;
  letterId: number;
  coverId: number;
}

interface SlideContentProps {
  $isActive: boolean;
  $index: number;
  $activeIndex: number;
  $totalSlides: number;
}

export const Count = ({ setViewCount, member, letterId, coverId }: Props) => {
  const length = Math.floor(50 / member);
  const list = Array.from({ length }, (_, index) => index + 1);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [selectNumber, setSelectNumber] = useState<number>(1);
  const navigate = useNavigate();
  const backgroundImages: { [key: number]: string } = {
    1: bg1,
    2: bg2,
    3: bg3,
    4: bg4,
    5: bg5,
  };
  const [background, setBackground] = useState<string | null>(
    backgroundImages[coverId] || null,
  );

  useEffect(() => {
    setSelectNumber(activeIndex + 1);
  }, [activeIndex]);

  const handleCancel = () => {
    setViewCount(false);
  };

  useEffect(() => {
    if (!background) {
      switch (coverId) {
        case 1:
          setBackground(bg1);
          break;
        case 2:
          setBackground(bg2);
          break;
        case 3:
          setBackground(bg3);
          break;
        case 4:
          setBackground(bg4);
          break;
        case 5:
          setBackground(bg5);
          break;
      }
    }
  }, []);

  const handleSubmit = async () => {
    const count = Number(selectNumber);
    const id = letterId;
    const coverid = coverId;

    const requestBody = { letterId: id, repeatCount: count };
    await postRepeatCount(requestBody);
    await postRandom({ letterId: id });

    startLetterWs(letterId);
    navigate('/Connection', {
      state: {
        letterId: letterId,
        coverId: coverid,
        bg: background,
      },
    });
  };

  // Swiper 참조를 위한 useRef
  const swiperRef = useRef<SwiperRef | null>(null);

  // 디바운스를 위한 타이머 변수
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 스크롤 이벤트를 통해 슬라이드 이동
  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();

    // 이미 타이머가 설정되어 있으면 현재 이벤트는 무시
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // 타이머를 설정해서 디바운스 적용
    scrollTimeoutRef.current = setTimeout(() => {
      if (event.deltaY > 0) {
        // 아래로 스크롤 (다음 슬라이드)
        if (swiperRef.current) {
          swiperRef.current.swiper.slideNext();
        }
      } else {
        // 위로 스크롤 (이전 슬라이드)
        if (swiperRef.current) {
          swiperRef.current.swiper.slidePrev();
        }
      }
    }, 12);
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너 추가
    window.addEventListener('wheel', handleScroll, { passive: false });

    // 컴포넌트가 unmount될 때 이벤트 리스너 제거
    return () => {
      window.removeEventListener('wheel', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Swiper 슬라이드 변경 시 호출되는 함수
  const onSlideChange = (swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  };

  /*useEffect(() => {
    // activeIndex가 변경될 때 Swiper로 이동
    if (swiperRef.current) {
      swiperRef.current.swiper.slideTo(activeIndex);
    }
  }, [activeIndex]);*/

  /*useEffect(() => {
    // activeIndex가 변경될 때만 Swiper로 이동하도록 조건 추가
    if (
      swiperRef.current &&
      swiperRef.current.swiper.realIndex !== activeIndex
    ) {
      swiperRef.current.swiper.slideTo(activeIndex);
    }
  }, [activeIndex]);*/

  useEffect(() => {
    // activeIndex가 변경될 때만 Swiper로 이동하도록 조건 추가
    if (
      swiperRef.current &&
      swiperRef.current.swiper.realIndex !== activeIndex
    ) {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        if (swiperRef.current) {
          swiperRef.current.swiper.slideTo(activeIndex);
        }
      }, -50); // 지연 후 슬라이드 이동
    }
  }, [activeIndex]);

  return (
    <ModalContainer>
      <Header>
        <Title>{member}명이서 몇 번씩 이어 쓸까요?</Title>
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
                direction={'vertical'}
                slidesPerView={5}
                loop={true}
                loopAdditionalSlides={5}
                slideToClickedSlide={true}
                centeredSlides={true}
                onSlideChange={onSlideChange}
                //onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                style={{ height: '100%' }}
                ref={swiperRef}
                speed={129.5}
              >
                {list.map((no, index) => (
                  <SwiperSlide key={no} style={{ height: 'calc(15rem / 4)' }}>
                    <SlideContent
                      $isActive={index === activeIndex}
                      $index={index}
                      $activeIndex={activeIndex}
                      $totalSlides={list.length}
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
              {selectNumber * member}
            </span>
            <span style={{ fontFamily: 'SUIT' }}>개</span>
          </TotalTxt>
        </Notice>
      </Contents>
      <Button onClick={handleSubmit}>
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
