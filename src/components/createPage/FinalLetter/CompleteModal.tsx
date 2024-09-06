import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import letter from "../../../../public/assets/letter.png";
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

export default function CompleteModal({
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

  const navigateToInvite = () => {
    setGuideOpen(true);
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
          {deliverDay === null ? (
            <></>
          ) : (
            <DeliverDay>
              {`${format(deliverDay, "yyyy")}. `}
              {`${format(deliverDay, "MM")}. `}
              {format(deliverDay, "dd")}
              {` (${format(deliverDay, "E", { locale: ko })})`}
            </DeliverDay>
          )}
          {selectedImageIndex !== 4 && (
            <>
              <Bright src={bright} />
              <Shadow src={shadow} />
              <BtnImgContainer bgimg={croppedImage} />
            </>
          )}
        </Book>
      </MainContainer>
      <Button onClick={navigateToInvite}>
        <ButtonTxt>맘에 들어요!</ButtonTxt>
      </Button>
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
  bottom: 1px;
  border-radius: 24px 24px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
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
  width: 136px;
  height: 136px;
  gap: 4px;
  z-index: 2;
  flex-shrink: 0;
  border-radius: 20px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 25px;
  margin-left: 4.6px;
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  width: calc(100% - 48px);
  height: 48px;
  padding: var(--Typography-size-s, 14px) 20px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  justify-content: center;
  align-self: stretch;
  border-radius: 50px;
  background: #ffa256;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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
