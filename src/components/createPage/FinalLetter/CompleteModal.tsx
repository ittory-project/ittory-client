import React, { useEffect, useRef, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import Player from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import animation from '../../../../public/assets/confetti.json';
import letter from '../../../../public/assets/letter.svg';
import shadow from '../../../../public/assets/shadow2.svg';
import { LetterRequestBody } from '../../../api/model/LetterModel';
import { coverQuery } from '../../../api/queries';
import { postLetter } from '../../../api/service/LetterService';
import { postEnter } from '../../../api/service/LetterService';
import { formatDeliverDate } from './formatDeliverDate';

interface Props {
  myName: string;
  title: string;
  selectedImageIndex: number;
  receiverName: string;
  deliverDay: Date | null | string;
  croppedImage: string;
  backgroundImage: number;
  selectfont: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectFid: number;
}

export default function CompleteModal({
  title,
  myName,
  receiverName,
  deliverDay,
  croppedImage,
  backgroundImage,
  selectfont,
  setIsModalOpen,
  selectedImageIndex,
  setKeyboardVisible,
  selectFid,
}: Props) {
  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());

  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);
  const [, setGuideOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [adjustDay, setAdjustDay] = useState<string>('');

  useEffect(() => {
    const changeType = () => {
      if (deliverDay) {
        // 로컬 타임존에서 날짜를 조정하여 UTC로 변환
        const adjustedDeliverDay = new Date(deliverDay);
        adjustedDeliverDay.setMinutes(
          adjustedDeliverDay.getMinutes() -
            adjustedDeliverDay.getTimezoneOffset(),
        );

        // UTC로 변환된 날짜를 출력 (하루 전 문제 해결)
        setAdjustDay(adjustedDeliverDay.toISOString());
        console.log(adjustDay);
      }
    };
    changeType();
  }, [deliverDay]);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (
        modalBackground.current &&
        !modalBackground.current.contains(e.target as Node)
        //컴포넌트 특정 영역 외 클릭 감지
      ) {
        setKeyboardVisible(false);
        closeModal();
      } else setKeyboardVisible(true);
    }
    document.addEventListener('mousedown', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
    };
  }, [modalBackground]);

  const fetchEnter = async (letterId: number) => {
    const nickname = myName;
    const enterresponse = await postEnter(Number(letterId), { nickname });
    if (enterresponse.enterStatus === true) {
      navigate(`/invite/${letterId}?guideOpen=true`);
    }
  };

  const navigateToInvite = async () => {
    setGuideOpen(true);

    const requestBody: LetterRequestBody = {
      coverTypeId: selectedImageIndex + 1,
      fontId: selectFid,
      receiverName: receiverName,
      deliveryDate: adjustDay,
      title: title,
      coverPhotoUrl: croppedImage,
    };

    const response = await postLetter(requestBody);
    const letterId = response.letterId;

    localStorage.setItem('guideOpen', String(true));
    localStorage.setItem('userName', myName);

    fetchEnter(letterId);
  };

  return (
    <>
      <Player
        animationData={animation}
        loop={false}
        autoplay
        style={{
          height: '320px',
          width: '100%',
          margin: '0 auto',
          top: '-450px',
          position: 'relative',
          zIndex: '101',
        }}
      />
      <ModalContainer ref={modalBackground}>
        <Header>
          <Title>{myName}님,</Title>
          <Title>편지가 만들어졌어요!</Title>
        </Header>
        <MainContainer>
          <Receiver>
            To.{receiverName} <LetterImg $img={letter} />
          </Receiver>
          <Book $backgroundImage={coverTypes[backgroundImage]?.confirmImageUrl}>
            <TitleContainer $font={selectfont}>{title}</TitleContainer>
            <DeliverDay>{formatDeliverDate(deliverDay)}</DeliverDay>
            <>
              <Shadow src={shadow} />
              <BtnImgContainer $bgimg={croppedImage} />
            </>
          </Book>
        </MainContainer>
        <Button onClick={navigateToInvite}>
          <ButtonTxt>맘에 들어요!</ButtonTxt>
        </Button>
      </ModalContainer>
    </>
  );
}
const ModalContainer = styled.div`
  position: absolute;
  bottom: 1px;
  z-index: 100;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;

  padding: 24px 24px 20px 24px;

  background: #fff;
  border-radius: 24px 24px 0px 0px;
  box-shadow: -4px 0px 14px 0px rgba(0, 0, 0, 0.05);
`;
const Header = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  gap: 6px;
  align-items: center;
  align-self: stretch;
  justify-content: center;
`;
const Title = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;
const MainContainer = styled.div`
  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: center;

  width: 220px;

  margin-top: 24px;
`;
const Receiver = styled.div`
  position: relative;

  display: flex;

  align-items: center;

  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;
const LetterImg = styled.div<{ $img: string }>`
  width: 19px;
  height: 14px;

  margin-left: 2px;

  background-image: url(${(props) => props.$img});
  background-repeat: no-repeat;
  background-size: cover;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 224px;
  height: 292px;

  background-image: url(${(props) => props.$backgroundImage});
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  margin-botom: 24px;
`;
const TitleContainer = styled.div<{ $font: string }>`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 224px;

  padding: 16px 0px 12px 0px;
  margin-top: 8px;

  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === 'Ownglyph_UNZ-Rg' ? '21px' : '16px'};
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: #fff;

  letter-spacing: -0.5px;
`;
const DeliverDay = styled.div`
  margin-top: -14px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 10px;
  font-style: normal;
  font-weight: 700;

  line-height: 14px;

  color: rgba(255, 255, 255, 0.8);

  text-align: center;
  letter-spacing: -0.5px;
`;
const Shadow = styled.img`
  position: absolute;
  z-index: 3;

  flex-shrink: 0;

  width: 175px;
  height: 161px;

  margin-top: 72px;
  margin-left: 0px;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  z-index: 2;

  flex-shrink: 0;

  gap: 4px;

  width: 137px;
  height: 137px;

  margin-top: 26.59px;
  margin-left: 1.8px;

  background-image: url(${(props) => props.$bgimg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 20px;
`;

const Button = styled.button`
  position: relative;
  left: 50%;
  z-index: 200;

  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  align-self: stretch;
  justify-content: center;

  width: 288px;
  height: 48px;

  padding: var(--Typography-size-s, 14px) 20px;
  margin-top: 24px;

  background: #ffa256;
  border: none;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;

  transform: translateX(-50%);
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
