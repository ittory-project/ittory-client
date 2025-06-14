import React, { Suspense, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

import bright from '@/assets/border.svg';
import calender from '@/assets/calendar.svg';
import EditImg from '@/assets/edit.svg';
import shadow from '@/assets/shadow2.svg';
import { Policies } from '@/constants';
import { sliceStringWithEmoji } from '@/utils';

import { coverQuery } from '../../../api/queries';
import BottomSheet from '../EnterInfo/BotttomSheet';
import CoverModal from '../FinalLetter/CoverModal';

interface Props {
  myName: string;
  setMyName: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  deliverDay: Date | null | string;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null | string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  selectfont: string;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  setViewEdit: React.Dispatch<React.SetStateAction<boolean>>;
  croppedImage: string;
  backgroundimage: number;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundimage: React.Dispatch<React.SetStateAction<number>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  selectFid: number;
}

export default function EditLetter({
  myName,
  setMyName,
  receiverName,
  setReceiverName,
  deliverDay,
  setDeliverDay,
  title,
  setTitle,
  croppedImage,
  backgroundimage,
  setCroppedImage,
  setBackgroundimage,
  selectfont,
  setSelectfont,
  setViewEdit,
  selectedImageIndex,
  setSelectedImageIndex,
  setSelectFid,
  selectFid,
}: Props) {
  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());

  const [calenderOpen, setCalenderOpen] = useState<boolean>(false);
  const [coverOpen, setCoveropen] = useState<boolean>(false);
  const [, setKeyboardVisible] = useState<boolean>(false);

  const openCalender = () => {
    setCalenderOpen(true);
  };
  const closeEditview = () => {
    localStorage.setItem('receiver', receiverName);
    localStorage.setItem('myName', myName);
    localStorage.setItem('Date', String(deliverDay));
    setViewEdit(false);
  };
  const openCoveredit = () => {
    setCoveropen(true);
  };

  return (
    <BackGround>
      {calenderOpen && <Overlay />}
      {coverOpen && <Overlay />}

      <Container>
        <Info>
          <TitleTxt>편지 정보 수정하기</TitleTxt>
          <CompleteBtn onClick={closeEditview}>완료</CompleteBtn>
          <InputBox>
            <InputLogo>받는 사람</InputLogo>
            <Input
              required
              placeholder="12자까지 입력할 수 있어요"
              type="text"
              value={receiverName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const validated = sliceStringWithEmoji(
                  e.target.value.trim(),
                  Policies.RECEIVER_MAX_LENGTH,
                );
                setReceiverName(validated.value);
              }}
              minLength={1}
            />
          </InputBox>
          <InputBox>
            <InputLogo>내 이름</InputLogo>
            <Input
              required
              placeholder="5자까지 입력할 수 있어요"
              type="text"
              value={myName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const validated = sliceStringWithEmoji(
                  e.target.value.trim(),
                  Policies.NICKNAME_MAX_LENGTH,
                );
                setMyName(validated.value);
              }}
              minLength={1}
            />
          </InputBox>
          <InputBox>
            <InputLogo>전달 날짜</InputLogo>
            <InputBoxRow>
              {deliverDay === null ? (
                <></>
              ) : (
                <SelectDate style={{ color: '#212529' }}>
                  {`${format(deliverDay, 'yyyy')}.`}
                  {`${format(deliverDay, 'M')}.`}
                  {format(deliverDay, 'd')}
                  {` (${format(deliverDay, 'E', { locale: ko })})`}
                </SelectDate>
              )}
              <Calender
                onClick={() => {
                  openCalender();
                }}
              >
                <img
                  src={calender}
                  alt="calender Icon"
                  style={{ width: '18px', height: '19px' }}
                />
              </Calender>
            </InputBoxRow>
          </InputBox>
        </Info>
        <Cover>
          <TitleTxt>표지 꾸미기</TitleTxt>
          <EditBtn
            onClick={() => {
              openCoveredit();
            }}
          >
            <img
              src={EditImg}
              alt="Edit Icon"
              style={{ width: '11px', height: '11px' }}
            />
          </EditBtn>
          {coverTypes && (
            <Book
              $backgroundImage={coverTypes[backgroundimage]?.confirmImageUrl}
            >
              <BookTitle $font={selectfont}>{title}</BookTitle>
              <Bright src={bright} />
              <Shadow src={shadow} />
              <BtnImgContainer $bgimg={croppedImage}></BtnImgContainer>
            </Book>
          )}
        </Cover>
      </Container>
      {calenderOpen && (
        <BottomSheet
          deliverDay={deliverDay}
          setDeliverDay={setDeliverDay}
          setIsModalOpen={setCalenderOpen}
        />
      )}
      {coverOpen && (
        <Suspense>
          <CoverModal
            title={title}
            setTitle={setTitle}
            croppedImage={croppedImage}
            backgroundimage={backgroundimage}
            setCroppedImage={setCroppedImage}
            setBackgroundimage={setBackgroundimage}
            selectfont={selectfont}
            setSelectfont={setSelectfont}
            setIsModalOpen={setCoveropen}
            setKeyboardVisible={setKeyboardVisible}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            setSelectFid={setSelectFid}
            selectFid={selectFid}
          />
        </Suspense>
      )}
    </BackGround>
  );
}

const BackGround = styled.div`
  position: relative;
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  overflow: hidden;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.6);

  transition: background 0.3s ease;
`;
const Container = styled.div`
  z-index: 0;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: flex-start;

  width: calc(100% - 48px);

  padding: 22px 12px 16px 12px;
  margin-top: 32px;
  margin-right: 24px;
  margin-left: 24px;

  background: #fff;
  border-radius: 12px;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
`;
const Info = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: flex-start;

  width: 100%;

  padding: 0px 12px 20px 12px;

  background-color: #fff;
`;
const TitleTxt = styled.div`
  display: block;

  align-self: flex-start;

  padding: 6px 0px;
  margin-bottom: 0.5rem;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #212529;

  text-align: left;
  letter-spacing: -0.5px;
`;
const CompleteBtn = styled.span`
  position: absolute;
  right: 12px;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_100, 4px) 12px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #fff;

  letter-spacing: -0.5px;

  cursor: pointer;

  background: #000;
  border-radius: 4px;
`;
const EditBtn = styled.div`
  position: absolute;
  right: 12px;

  display: flex;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  cursor: pointer;

  background: #fff2e8;
  border-radius: 50px;
`;

const Cover = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;
  align-self: stretch;

  width: 100%;

  padding: 12px 12px 20px 12px;

  background: #f8f9fa;
  border-radius: 8px;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 120px;
  height: 156.429px;

  margin-top: 15px;

  background-image: url(${(props) => props.$backgroundImage});
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
  background-size: contain; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  border-radius: 3.833px 11.5px 11.5px 3.833px;
`;
const Bright = styled.img`
  position: absolute;
  z-index: 0;

  flex-shrink: 0;

  width: 78px;
  height: 78px;

  margin-top: 44px;
  margin-left: 3px;
`;
const Shadow = styled.img`
  position: absolute;
  z-index: 1;

  flex-shrink: 0;

  margin-top: 39px;
  margin-left: 01px;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  z-index: 0;

  flex-shrink: 0;

  gap: 4px;

  width: 74px;
  height: 74px;

  margin-top: 23.5px;
  margin-left: 2.26px;

  background-image: url(${(props) => props.$bgimg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border: 1px rgba(255, 255, 255, 0.7);
  border-radius: 10px;
`;
const BookTitle = styled.div<{ $font: string }>`
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  margin-top: 10px;

  text-overflow: ellipsis;

  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === 'Ownglyph_UNZ-Rg' ? '12px' : '8.571px'};

  color: #fff;

  text-align: center;
`;
const InputBox = styled.div`
  display: flex;

  flex-direction: column;

  gap: 8px;
  justify-content: center;

  width: 100%;

  margin-top: 0;

  background-color: #fff;
  border-bottom: 1px dashed #dee2e6;
`;
const InputLogo = styled.div`
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #868e96;

  letter-spacing: -0.5px;
`;
const Input = styled.input`
  width: 232px;
  height: 20px;

  padding: 0;
  margin-bottom: 4px;

  cursor: pointer;

  background-color: #fff;
  border: 0;
  &::placeholder {
    font-family: var(--Typography-family-title, SUIT);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;

    line-height: 20px;

    color: #adb5bd;

    letter-spacing: -0.5px;
  }
  &:valid {
    font-family: var(--Typography-family-title, SUIT);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;

    line-height: 20px;

    color: #212529;

    letter-spacing: -0.5px;
  }
  &:focus {
    outline: none;
  }
`;
const InputBoxRow = styled.div`
  display: flex;

  flex-direction: row;

  align-items: center;

  margin-bottom: 4px;
`;
const SelectDate = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;

  line-height: 24px;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const Calender = styled.span`
  position: absolute;
  right: 1rem;

  cursor: pointer;
`;
