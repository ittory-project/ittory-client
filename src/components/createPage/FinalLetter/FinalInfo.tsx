import React, { useState, useEffect, ReactNode } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import EditImg from "../../../../public/assets/edit.svg";
import EditLetter from "../FinalLetter/EditLetter";
import CoverModal from "./CoverModal";
import CompleteModal from "./CompleteModal";
import UserFinishModal from "./UserFinishModal";
import shadow from "../../../../public/assets/shadow2.svg";
import { CoverType } from "../../../api/model/CoverType";
import { getCoverTypes } from "../../../api/service/CoverService";
import { getVisitUser } from "../../../api/service/MemberService";

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
  const [viewEdit, setViewEdit] = useState<boolean>(false);
  const [coverOpen, setCoveropen] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [complete, setComplete] = useState<boolean>(false);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [visit, setVisit] = useState<boolean>(false);

  console.log(selectFid);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
        const user = await getVisitUser();
        setVisit(user.isVisited);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleEditview = () => {
    setViewEdit(true);
  };
  const openCoveredit = () => {
    setCoveropen(true);
  };

  const handleComplete = () => {
    setComplete(true);
  };
  const Book: React.FC<BookProps> = ({ backgroundImage, children }) => {
    return (
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "120px",
          height: "157px",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    );
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
              {croppedImage === "" ? (
                <Book
                  backgroundImage={coverTypes[backgroundimage]?.confirmImageUrl}
                >
                  <BookTitle $font={selectfont}>{title}</BookTitle>
                </Book>
              ) : (
                <Book
                  backgroundImage={coverTypes[backgroundimage]?.confirmImageUrl}
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
    </BackGround>
  );
}

const BackGround = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100);
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 50;
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
  background-color: #fff;
  //align-self: stretch;
`;
const TitleTxt = styled.span`
  display: block;
  color: #212529;
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
  background-color: #fff;
`;
const InfoTitle = styled.span`
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
  background-color: #fff;
  color: #868e96;
`;
const InfoTxt = styled.span`
  position: absolute;
  right: 0;
  padding: 6px 0px;
  text-align: center;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.5px;
  background-color: #fff;
  color: #212529;
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
const Shadow = styled.img`
  margin-left: 17.1px;
  margin-top: 12.5px;
  position: absolute;
  z-index: 1;
  flex-shrink: 0;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  z-index: 0;
  width: 73px;
  height: 73px;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 10px;
  background-image: url(${(props) => props.$bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 20.8px;
  margin-left: 24px;
  border: 1px rgba(255, 255, 255, 0.7);
`;
const BookTitle = styled.div<{ $font: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 13.5px;
  color: #fff;
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === "Ownglyph_UNZ-Rg" ? "12px" : "8.571px"};
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
