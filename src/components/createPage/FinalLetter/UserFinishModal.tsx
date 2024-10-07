import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import letter from "../../../../public/assets/letter.svg";
import { useNavigate } from "react-router-dom";
import bright from "../../../../public/assets/border.svg";
import shadow from "../../../../public/assets/shadow2.svg";

interface Props {
  title: string;
  selectedImageIndex: number;
  receiverName: string;
  deliverDay: Date | null;
  croppedImage: string;
  backgroundImage: string;
  selectfont: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setKeyboardVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function UserFinishModal({
  title,
  receiverName,
  deliverDay,
  croppedImage,
  backgroundImage,
  selectfont,
  setIsModalOpen,
  selectedImageIndex,
  setKeyboardVisible,
}: Props) {
  const modalBackground = useRef<HTMLDivElement | null>(null);
  const closeModal = () => setIsModalOpen(false);
  const [bookimage, setBookimage] = useState<string>(backgroundImage);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const navigateToInvite = () => {
    navigate("/Invite", {
      state: {
        guideOpen: guideOpen,
        receiverName: receiverName,
        title: title,
        croppedImage: croppedImage,
        backgroundImage: backgroundImage,
        deliverDay: deliverDay,
        selectfont: selectfont,
        selectedImageIndex: selectedImageIndex,
      },
    });
  };

  const handleguide = () => {
    setGuideOpen(true);
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
        <Title>카리나님,</Title>
        <Title>편지가 만들어졌어요!</Title>
      </Header>
      <MainContainer>
        <Receiver>
          To.{receiverName} <LetterImg img={letter} />
        </Receiver>
        <Book backgroundImage={bookimage}>
          <TitleContainer font={selectfont}>{title}</TitleContainer>
          {selectedImageIndex === 4 && (
            <>
              <Bright src={bright} />
              <Shadow src={shadow} />
              <BtnImgContainer bgimg={croppedImage} />
            </>
          )}
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
        >
          <ButtonTxt style={{ color: "#495057" }} onClick={handleguide}>
            사용법 보기
          </ButtonTxt>
        </Button>
        <Button
          style={{
            background: "#FFA256",
          }}
        >
          <ButtonTxt style={{ color: "#fff" }} onClick={navigateToInvite}>
            맘에 들어요!
          </ButtonTxt>
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
  height: 37rem;
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
  margin-top: 2.5rem;
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
const LetterImg = styled.div<{ img: string }>`
  width: 19px;
  height: 14px;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  margin-left: 2px;
`;
const Book = styled.div<{ backgroundImage: string }>`
  width: 224px;
  height: 292px;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover; /* 이미지를 자르지 않고 크기에 맞춰 조정 */
  background-repeat: no-repeat; /* 이미지를 반복하지 않도록 설정 */
  background-position: center; /* 이미지를 가운데 정렬 */
`;
const TitleContainer = styled.div<{ font: string }>`
  display: flex;
  width: 224px;
  color: #fff;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  font-family: ${(props) => props.font};
  font-size: ${(props) => (props.font === "Ownglyph_UNZ-Rg" ? "21px" : "16px")};
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.5px;
  line-height: 24px;
  margin-top: 9px;
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
const Bright = styled.img`
  width: 148px;
  height: 148px;
  margin-left: 3.9px;
  margin-top: 80px;
  position: absolute;
  z-index: 2;
  flex-shrink: 0;
`;
const Shadow = styled.img`
  width: 161px;
  height: 161px;
  margin-left: 2.7px;
  margin-top: 73px;
  position: absolute;
  z-index: 3;
  flex-shrink: 0;
`;
const BtnImgContainer = styled.div<{ bgimg: string }>`
  width: 150px;
  height: 150px;
  gap: 4px;
  z-index: 3;
  flex-shrink: 0;
  border-radius: 100px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 18.5px;
  margin-left: 4.5px;
`;

const ButtonContainer = styled.div`
  padding: 0px 16px 20px 16px;
  box-sizing: border-box;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  display: flex;
  position: relative;
  //bottom: 20px;
  margin-top: 3rem;
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
