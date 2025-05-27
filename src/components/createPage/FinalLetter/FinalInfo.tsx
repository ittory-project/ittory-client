import React, { ReactNode, Suspense, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

import EditImg from '@/assets/edit.svg';
import shadow from '@/assets/shadow2.svg';

import { coverQuery, userQuery } from '../../../api/queries';
import EditLetter from '../FinalLetter/EditLetter';
import CompleteModal from './CompleteModal';
import CoverModal from './CoverModal';
import UserFinishModal from './UserFinishModal';

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
  croppedImage: string;
  backgroundimage: number;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundimage: React.Dispatch<React.SetStateAction<number>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectFid: React.Dispatch<React.SetStateAction<number>>;
  selectFid: number;
}

interface BookProps {
  backgroundImage: string;
  children: ReactNode;
}
export default function FinalInfo({
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
  selectedImageIndex,
  setSelectedImageIndex,
  setSelectFid,
  selectFid,
}: Props) {
  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());
  const { data: visit } = useSuspenseQuery(userQuery.visitUser());

  const [viewEdit, setViewEdit] = useState<boolean>(false);
  const [coverOpen, setCoveropen] = useState<boolean>(false);
  const [, setKeyboardVisible] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);

  const handleEditview = () => {
    setViewEdit(true);
  };
  const openCoveredit = () => {
    setCoveropen(true);
  };

  const handleComplete = () => {
    setComplete(true);
  };

  return (
    <BackGround>
      <Suspense>
        {coverOpen && <Overlay />}
        {complete && <Overlay />}
        {viewEdit === false ? (
          <>
            <Header>
              <Title>입력한 정보를 확인해 보세요</Title>
              <SubTitle>게임 시작하기 전, 마지막으로 수정할 수 있어요</SubTitle>
            </Header>
            <Container>
              <Info>
                <TitleTxt>편지 정보</TitleTxt>
                <EditBtn onClick={handleEditview}>
                  <img
                    src={EditImg}
                    alt="Edit Icon"
                    style={{ width: '11px', height: '11px' }}
                  />
                </EditBtn>
                <InfoBlock>
                  <InfoTitle>받는 사람</InfoTitle>
                  <InfoTxt>{receiverName}</InfoTxt>
                </InfoBlock>
                <InfoBlock>
                  <InfoTitle>내 이름</InfoTitle>
                  <InfoTxt>{myName}</InfoTxt>
                </InfoBlock>
                <InfoBlock>
                  <InfoTitle>전달 날짜</InfoTitle>
                  {deliverDay ? (
                    <InfoTxt>
                      {`${format(deliverDay, 'yyyy')}.`}
                      {`${format(deliverDay, 'M')}.`}
                      {`${format(deliverDay, 'd')}`}
                      {` (${format(deliverDay, 'E', { locale: ko })})`}
                    </InfoTxt>
                  ) : (
                    <></>
                  )}
                </InfoBlock>
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
                {croppedImage === '' ? (
                  <Book
                    backgroundImage={
                      coverTypes[backgroundimage]?.confirmImageUrl
                    }
                  >
                    <BookTitle $font={selectfont}>{title}</BookTitle>
                  </Book>
                ) : (
                  <Book
                    backgroundImage={
                      coverTypes[backgroundimage]?.confirmImageUrl
                    }
                  >
                    <BookTitle $font={selectfont}>{title}</BookTitle>
                    <Shadow src={shadow} />
                    <BtnImgContainer $bgimg={croppedImage}></BtnImgContainer>
                  </Book>
                )}
              </Cover>
            </Container>
            <Button onClick={handleComplete}>
              <ButtonTxt>확인했어요</ButtonTxt>
            </Button>
          </>
        ) : (
          <EditLetter
            myName={myName}
            receiverName={receiverName}
            deliverDay={deliverDay}
            setReceiverName={setReceiverName}
            setMyName={setMyName}
            setDeliverDay={setDeliverDay}
            title={title}
            setTitle={setTitle}
            croppedImage={croppedImage}
            setCroppedImage={setCroppedImage}
            backgroundimage={backgroundimage}
            setBackgroundimage={setBackgroundimage}
            selectfont={selectfont}
            setSelectfont={setSelectfont}
            setViewEdit={setViewEdit}
            selectedImageIndex={selectedImageIndex}
            setSelectedImageIndex={setSelectedImageIndex}
            setSelectFid={setSelectFid}
            selectFid={selectFid}
          />
        )}
        {coverOpen && (
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
        )}
        {complete &&
          (visit ? (
            <UserFinishModal
              setKeyboardVisible={setKeyboardVisible}
              myName={myName}
              receiverName={receiverName}
              deliverDay={deliverDay}
              title={title}
              croppedImage={croppedImage}
              backgroundimage={backgroundimage}
              selectfont={selectfont}
              setIsModalOpen={setComplete}
              selectedImageIndex={selectedImageIndex}
              selectFid={selectFid}
            />
          ) : (
            <CompleteModal
              setKeyboardVisible={setKeyboardVisible}
              myName={myName}
              receiverName={receiverName}
              deliverDay={deliverDay}
              title={title}
              croppedImage={croppedImage}
              backgroundImage={backgroundimage}
              selectfont={selectfont}
              setIsModalOpen={setComplete}
              selectedImageIndex={selectedImageIndex}
              selectFid={selectFid}
            />
          ))}
      </Suspense>
    </BackGround>
  );
}

const Book: React.FC<BookProps> = ({ backgroundImage, children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        width: '120px',
        height: '157px',
        boxSizing: 'border-box',
        marginBottom: '8px',
      }}
    >
      {children}
    </div>
  );
};

const BackGround = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 50;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: rgba(0, 0, 0, 0.6);

  transition: background 0.3s ease;
`;
const Header = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  margin-top: 2rem;
`;
const Title = styled.span`
  margin-bottom: 8px;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #243348;

  text-align: center;
  letter-spacing: -0.5px;
`;
const SubTitle = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #495057;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  z-index: 0;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-start;
  justify-content: center;

  width: calc(100% - 48px);

  padding: 16px 12px;
  margin-top: 1.5rem;
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

  align-items: flex-start;

  width: 100%;

  padding: 0px 12px 6px 12px;

  background-color: #fff;
`;
const TitleTxt = styled.span`
  display: block;

  align-self: flex-start;

  padding: 6px 0px;
  margin-bottom: 0.5rem;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #212529;

  text-align: left;
  letter-spacing: -0.5px;
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
const InfoBlock = styled.div`
  position: relative;

  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: flex-start;

  margin-bottom: 10px;

  background-color: #fff;
`;
const InfoTitle = styled.span`
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #868e96;

  letter-spacing: -0.5px;

  background-color: #fff;
`;
const InfoTxt = styled.span`
  position: absolute;
  right: 0;

  padding: 6px 0px;

  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;

  line-height: 20px;

  color: #212529;

  text-align: center;
  letter-spacing: -0.5px;

  background-color: #fff;
`;
const Cover = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: flex-start;
  align-items: center;
  align-self: stretch;

  width: 100%;
  width: 100%;

  padding: 12px 12px 12px 12px;

  background: #f8f9fa;
  border-radius: 8px;
`;
const Shadow = styled.img`
  position: absolute;
  z-index: 1;

  flex-shrink: 0;

  width: 90px;

  margin-top: 12.5px;
  margin-left: 16px;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  z-index: 0;

  flex-shrink: 0;

  gap: 4px;

  width: 74px;
  height: 74px;

  margin-top: 20.8px;
  margin-left: 23.78px;

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

  margin-top: 13.5px;

  text-overflow: ellipsis;

  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === 'Ownglyph_UNZ-Rg' ? '12px' : '8.571px'};

  color: #fff;

  text-align: center;
`;
const Button = styled.button`
  position: absolute;
  bottom: 12px;
  z-index: 1;

  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: calc(100% - 32px);
  height: 48px;

  padding: 14px 20px;
  margin-right: 16px;
  margin-left: 16px;

  overflow: hidden;

  cursor: pointer;

  background: #ffa256;
  border: none;
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
