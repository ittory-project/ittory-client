import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import EditImg from "../../../../public/assets/edit.svg";
import calender from "../../../../public/assets/calendar.svg";
import BottomSheet from "../EnterInfo/BotttomSheet";
import CoverModal from "../FinalLetter/CoverModal";
import shadow from "../../../../public/assets/shadow2.svg";
import bright from "../../../../public/assets/border.svg";
import { CoverType } from "../../../api/model/CoverType";
import { getCoverTypes } from "../../../api/service/CoverService";

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
  const [calenderOpen, setCalenderOpen] = useState<boolean>(false);
  const [coverOpen, setCoveropen] = useState<boolean>(false);
  const [, setKeyboardVisible] = useState<boolean>(false);
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);

  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
        console.log(types);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCoverTypes();
  }, []);

  const openCalender = () => {
    setCalenderOpen(true);
  };
  const closeEditview = () => {
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
                if (e.target.value.length > 12) {
                  e.target.value = e.target.value.slice(0, 12);
                }
                setReceiverName(e.target.value);
              }}
              minLength={1}
              maxLength={12}
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
                if (e.target.value.length > 5) {
                  e.target.value = e.target.value.slice(0, 5);
                }
                setMyName(e.target.value);
              }}
              minLength={1}
              maxLength={5}
            />
          </InputBox>
          <InputBox>
            <InputLogo>전달 날짜</InputLogo>
            <InputBoxRow>
              {deliverDay === null ? (
                <></>
              ) : (
                <SelectDate style={{ color: "#212529" }}>
                  {`${format(deliverDay, "yyyy")}.`}
                  {`${format(deliverDay, "M")}.`}
                  {format(deliverDay, "d")}
                  {` (${format(deliverDay, "E", { locale: ko })})`}
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
                  style={{ width: "24px", height: "24px" }}
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
              console.log("커버모달오픈");
            }}
          >
            <img
              src={EditImg}
              alt="Edit Icon"
              style={{ width: "11px", height: "11px" }}
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
    </BackGround>
  );
}

const BackGround = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  overflow: hidden;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 50;
`;
const Container = styled.div`
  margin-top: 3rem;
  display: flex;
  width: 272px;
  padding: 16px 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
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
const CompleteBtn = styled.span`
  position: absolute;
  cursor: pointer;
  right: 12px;
  display: flex;
  border-radius: 4px;
  background: #000;
  padding: var(--Border-Radius-radius_100, 4px) 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
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

const Cover = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  padding: 0px 12px 20px 12px;
  flex-direction: column;
  align-self: stretch;
  border-radius: 8px;
  background: #f8f9fa;
  align-items: center;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  width: 120px;
  height: 156.429px;
  position: relative;
  margin-top: 15px;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.$backgroundImage});
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
  margin-top: 44px;
  position: absolute;
  z-index: 0;
  flex-shrink: 0;
`;
const Shadow = styled.img`
  margin-left: 2.6px;
  margin-top: 39.8px;
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
  margin-top: 24.3px;
  margin-left: 2.3px;
  border: 1px rgba(255, 255, 255, 0.7);
`;
const BookTitle = styled.div<{ $font: string }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-top: 10px;
  color: #fff;
  text-align: center;
  text-overflow: ellipsis;
  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === "Ownglyph_UNZ-Rg" ? "12px" : "8.571px"};
`;
const InputBox = styled.div`
  display: flex;
  width: 16rem;
  flex-direction: column;
  justify-content: center;
  height: 3.5rem;
  gap: 6px;
  margin-top: 0;
  border-bottom: 1px dashed #dee2e6;
  margin-bottom: 1.8px;
  background-color: #fff;
`;
const InputLogo = styled.div`
  color: #868e96;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 11px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Input = styled.input`
  width: 232px;
  height: 24px;
  border: 0;
  padding-left: 0;
  background-color: #fff;
  &::placeholder {
    color: #adb5bd;
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    letter-spacing: -0.5px;
  }
  &:valid {
    color: #212529;
    font-family: var(--Typography-family-title, SUIT);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
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
`;
const SelectDate = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Calender = styled.span`
  position: absolute;
  cursor: pointer;
  right: 1rem;
`;
