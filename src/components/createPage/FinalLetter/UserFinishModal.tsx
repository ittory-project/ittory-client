import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import letter from "../../../../public/assets/letter.svg";
import { useNavigate } from "react-router-dom";
import shadow from "../../../../public/assets/shadow2.svg";
import { getCoverTypes } from "../../../api/service/CoverService";
import { CoverType } from "../../../api/model/CoverType";
import { LetterRequestBody } from "../../../api/model/LetterModel";
import { postLetter } from "../../../api/service/LetterService";
import { postNickname } from "../../../api/service/ParticipantService";
import { NicknamePostRequest } from "../../../api/model/ParticipantModel";
import { postEnter } from "../../../api/service/LetterService";

interface Props {
  myName: string;
  title: string;
  selectedImageIndex: number;
  receiverName: string;
  deliverDay: Date | null;
  croppedImage: string;
  backgroundimage: number;
  selectfont: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectFid: number;
}

export default function UserFinishModal({
  title,
  receiverName,
  deliverDay,
  croppedImage,
  backgroundimage,
  selectfont,
  setIsModalOpen,
  selectedImageIndex,
  setKeyboardVisible,
  myName,
  selectFid,
}: Props) {
  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);
  const [, setGuideOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);

  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCoverTypes();
  }, []);

  const handleNickname = async (letterId: Number) => {
    if (myName) {
      const requestBody: NicknamePostRequest = {
        nickname: myName,
      };
      const response = await postNickname(requestBody, Number(letterId));
      console.log(response);
    }
  };

  const fetchEnter = async (letterId: Number) => {
    try {
      const enterresponse = await postEnter(Number(letterId));
      console.log(enterresponse);
      handleNickname(letterId);
    } catch (err) {
      console.error("Error fetching mydata:", err);
    }
  };

  const navigateToInvite = async () => {
    setGuideOpen(true);

    const requestBody: LetterRequestBody = {
      coverTypeId: selectedImageIndex + 1,
      fontId: selectFid,
      receiverName: receiverName,
      deliveryDate: deliverDay?.toISOString() || "",
      title: title,
      coverPhotoUrl: croppedImage,
    };
    console.log(requestBody);

    try {
      const response = await postLetter(requestBody);
      console.log("Response:", response);
      const letterId = response.letterId;
      console.log("letterId", letterId);

      /*
      localStorage.setItem("letterId", String(letterId));
      localStorage.setItem("guideOpen", String(false));
      localStorage.setItem("userName", myName);*/

      fetchEnter(letterId);

      console.log(letterId, myName);

      navigate("/Invite", {
        state: {
          letterId: letterId,
          guideOpen: false,
          userName: myName,
        },
      });
    } catch (error) {
      console.error("Error posting letter:", error);
    }
  };

  const handleguide = async () => {
    setGuideOpen(true);

    const requestBody: LetterRequestBody = {
      coverTypeId: selectedImageIndex + 1,
      fontId: selectFid,
      receiverName: receiverName,
      deliveryDate: deliverDay?.toISOString() || "",
      title: title,
      coverPhotoUrl: croppedImage,
    };
    console.log(requestBody);

    try {
      const response = await postLetter(requestBody);
      console.log("Response:", response);
      const letterId = response.letterId;
      console.log("letterId", letterId);

      localStorage.setItem("letterId", String(letterId));
      localStorage.setItem("guideOpen", String(true));
      localStorage.setItem("userName", myName);

      fetchEnter(letterId);

      navigate(
        "/Invite" /*{
        state: {
          letterId: letterId,
          guideOpen: true,
          userName: myName,
        },
      }*/
      );
    } catch (error) {
      console.error("Error posting letter:", error);
    }
  };

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
    document.addEventListener("mousedown", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [modalBackground]);

  return (
    <ModalContainer ref={modalBackground}>
      <Header>
        <Title>{myName}님,</Title>
        <Title>편지가 만들어졌어요!</Title>
      </Header>
      <MainContainer>
        <Receiver>
          To.{receiverName} <LetterImg $img={letter} />
        </Receiver>
        <Book $backgroundImage={coverTypes[backgroundimage]?.confirmImageUrl}>
          <TitleContainer $font={selectfont}>{title}</TitleContainer>
          <>
            <Shadow src={shadow} />
            <BtnImgContainer $bgimg={croppedImage} />
          </>
          {deliverDay === null ? (
            <></>
          ) : (
            <DeliverDay>
              {`${format(deliverDay, "yyyy")}.`}
              {`${format(deliverDay, "MM")}.`}
              {format(deliverDay, "dds")}
              {` (${format(deliverDay, "E", { locale: ko })})`}
            </DeliverDay>
          )}
        </Book>
      </MainContainer>
      <ButtonContainer>
        <Button
          style={{
            background: "#CED4DA",
          }}
          onClick={handleguide}
        >
          <ButtonTxt style={{ color: "#495057" }}>사용법 보기</ButtonTxt>
        </Button>
        <Button
          style={{
            background: "#FFA256",
          }}
          onClick={navigateToInvite}
        >
          <ButtonTxt style={{ color: "#fff" }}>맘에 들어요!</ButtonTxt>
        </Button>
      </ButtonContainer>
    </ModalContainer>
  );
}
const ModalContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  display: flex;
  width: 100%;
  padding: 24px 24px 20px 24px;
  border-radius: 24px 24px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
  bottom: 0;
  box-shadow: -4px 0px 14px 0px rgba(0, 0, 0, 0.05);
`;
const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; //세로정렬
  gap: 6px;
  align-self: stretch;
  position: relative;
`;
const Title = styled.span`
  text-align: center;
  color: #000;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const MainContainer = styled.div`
  display: flex;
  width: 220px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
`;
const Receiver = styled.div`
  display: flex;
  color: #000;
  text-align: center;
  align-items: center;
  position: relative;
  font-family: var(--Typography-family-body, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const LetterImg = styled.div<{ $img: string }>`
  width: 19px;
  height: 14px;
  background-image: url(${(props) => props.$img});
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: 2px;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  width: 224px;
  height: 292px;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.$backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
`;
const TitleContainer = styled.div<{ $font: string }>`
  display: flex;
  width: 224px;
  color: #fff;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === "Ownglyph_UNZ-Rg" ? "21px" : "16px"};
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.5px;
  line-height: 24px;
  margin-top: 8px;
`;
const DeliverDay = styled.div`
  color: rgba(255, 255, 255, 0.8);
  margin-top: -14px;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.5px;
`;
const Shadow = styled.img`
  width: 161px;
  height: 161px;
  margin-left: 0px;
  margin-top: 73px;
  position: absolute;
  z-index: 3;
  flex-shrink: 0;
`;
const ButtonContainer = styled.div`
  padding: 0px 16px 0px 16px;
  box-sizing: border-box;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  display: flex;
  position: relative;
  margin-top: 24px;
  width: 100%; /* 컨테이너의 너비를 조정 */
  justify-content: center; /* 버튼들을 중앙에 배치 */
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  height: 48px;
  padding: 14px 2rem;
  align-items: center;
  gap: 8px;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  //position: relative;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  width: 137px;
  height: 137px;
  gap: 4px;
  z-index: 2;
  flex-shrink: 0;
  border-radius: 20px;
  background-image: url(${(props) => props.$bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 26.59px;
  margin-left: 1.8px;
`;
