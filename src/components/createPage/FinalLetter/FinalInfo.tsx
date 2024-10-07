import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import EditImg from "../../../../public/assets/edit.svg";
import EditLetter from "../FinalLetter/EditLetter";
import CoverModal from "./CoverModal";
import CompleteModal from "./CompleteModal";
import bright from "../../../../public/assets/border.svg";
import shadow from "../../../../public/assets/shadow2.svg";

interface Props {
  myName: string;
  setMyName: React.Dispatch<React.SetStateAction<string>>;
  receiverName: string;
  setReceiverName: React.Dispatch<React.SetStateAction<string>>;
  deliverDay: Date | null;
  setDeliverDay: React.Dispatch<React.SetStateAction<Date | null>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  selectfont: string;
  setSelectfont: React.Dispatch<React.SetStateAction<string>>;
  croppedImage: string;
  backgroundImage: string;
  setCroppedImage: React.Dispatch<React.SetStateAction<string>>;
  setBackgroundImage: React.Dispatch<React.SetStateAction<string>>;
  selectedImageIndex: number;
  setSelectedImageIndex: React.Dispatch<React.SetStateAction<number>>;
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
  backgroundImage,
  setCroppedImage,
  setBackgroundImage,
  selectfont,
  setSelectfont,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) {
  const [viewEdit, setViewEdit] = useState<boolean>(false);
  const [coverOpen, setCoveropen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [complete, setComplete] = useState(false);

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
                  style={{ width: "11px", height: "11px" }}
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
                    {`${format(deliverDay, "yyyy")}.`}
                    {`${format(deliverDay, "M")}.`}
                    {`${format(deliverDay, "d")}`}
                    {` (${format(deliverDay, "E", { locale: ko })})`}
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
                  console.log("커버모달오픈");
                }}
              >
                <img
                  src={EditImg}
                  alt="Edit Icon"
                  style={{ width: "11px", height: "11px" }}
                />
              </EditBtn>
              {croppedImage === "" || selectedImageIndex === 4 ? (
                <Book backgroundImage={backgroundImage}>
                  <BookTitle font={selectfont}>{title}</BookTitle>
                </Book>
              ) : (
                <Book backgroundImage={backgroundImage}>
                  <BookTitle font={selectfont}>{title}</BookTitle>
                  <Bright src={bright} />
                  <Shadow src={shadow} />
                  <BtnImgContainer bgimg={croppedImage}></BtnImgContainer>
                </Book>
              )}
            </Cover>
          </Container>
          <Button>
            <ButtonTxt onClick={handleComplete}>확인했어요</ButtonTxt>
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
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
          selectfont={selectfont}
          setSelectfont={setSelectfont}
          setViewEdit={setViewEdit}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
      )}
      {coverOpen && (
        <CoverModal
          title={title}
          setTitle={setTitle}
          croppedImage={croppedImage}
          backgroundImage={backgroundImage}
          setCroppedImage={setCroppedImage}
          setBackgroundImage={setBackgroundImage}
          selectfont={selectfont}
          setSelectfont={setSelectfont}
          setIsModalOpen={setCoveropen}
          setKeyboardVisible={setKeyboardVisible}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
        />
      )}
      {complete && (
        <CompleteModal
          setKeyboardVisible={setKeyboardVisible}
          receiverName={receiverName}
          deliverDay={deliverDay}
          title={title}
          croppedImage={croppedImage}
          backgroundImage={backgroundImage}
          selectfont={selectfont}
          setIsModalOpen={setComplete}
          selectedImageIndex={selectedImageIndex}
        />
      )}
    </BackGround>
  );
}

const BackGround = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 99;
`;
const Header = styled.div`
  display: flex;
  margin-top: 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.span`
  color: #243348;
  text-align: center;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  margin-bottom: 10px;
`;
const SubTitle = styled.span`
  color: #495057;
  text-align: center;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Container = styled.div`
  margin-top: 1.5rem;
  display: flex;
  width: 272px;
  box-sizing: border-box;
  padding: 16px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(36, 51, 72, 0.08);
  z-index: 0;
`;
const Info = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0px 12px 20px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--Border-Radius-radius_300, 8px);
  //align-self: stretch;
`;
const TitleTxt = styled.span`
  display: block;
  color: #21529;
  padding: 6px 0px;
  text-align: left;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
  align-self: flex-start;
`;
const EditBtn = styled.div`
  position: absolute;
  cursor: pointer;
  right: 12px;
  display: flex;
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: 50px;
  background: #fff2e8;
`;
const InfoBlock = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  position: relative;
  margin-bottom: 0.8rem;
`;
const InfoTitle = styled.span`
  color: #868e96;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const InfoTxt = styled.span`
  position: absolute;
  right: 0;
  color: #21529;
  padding: 6px 0px;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const Cover = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0px 12px 20px 12px;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  align-self: stretch;
  border-radius: 8px;
  background: #f8f9fa;
  align-items: center;
`;
const Book = styled.div<{ backgroundImage: string }>`
  width: 120px;
  height: 157px;
  position: relative;
  border-radius: 2.143px 6.429px 6.429px 2.143px;
  background-image: url(${(props) => props.backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: contain; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
`;
const Bright = styled.img`
  width: 78px;
  height: 78px;
  margin-left: 3px;
  margin-top: 45px;
  position: absolute;
  z-index: 0;
  flex-shrink: 0;
`;
const Shadow = styled.img`
  margin-left: 2.5px;
  margin-top: 40px;
  position: absolute;
  z-index: 1;
  flex-shrink: 0;
`;
const BtnImgContainer = styled.div<{ bgimg: string }>`
  z-index: 0;
  width: 73px;
  height: 73px;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 10px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 21px;
  margin-left: 2.7px;
  border: 1px rgba(255, 255, 255, 0.7);
`;
const BookTitle = styled.div<{ font: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 13.5px;
  color: #fff;
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.font};
  font-size: ${(props) =>
    props.font === "Ownglyph_UNZ-Rg" ? "12px" : "8.571px"};
`;
const Button = styled.button`
  position: absolute;
  overflow: hidden;
  background: #ffa256;
  width: 288px;
  cursor: pointer;
  display: flex;
  height: 48px;
  padding: 14px 20px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 50px;
  bottom: 16px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  z-index: 1;
`;
const ButtonTxt = styled.div`
  color: #fff;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
