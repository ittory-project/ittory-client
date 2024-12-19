import React, { useState, useEffect } from "react";
import styled from "styled-components";
import X from "../../../public/assets/x.svg";
import delete2 from "../../../public/assets/delete2.svg";
import share from "../../../public/assets/share.svg";
import { LetterDetailGetResponse } from "../../api/model/LetterModel";
import { getLetterDetailInfo } from "../../api/service/LetterService";
import { formatDate } from "../../api/config/formatData";

interface Props {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  openLetter: boolean;
  letterId: number;
}
//링크 적용 필요
export const Created_Modal = ({
  setIsModalOpen,
  setPopup,
  letterId,
}: Props) => {
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [copied, setCopied] = useState<boolean>(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  console.log(letterId);

  const handlePopup = () => {
    setIsModalOpen(false);
    setPopup(true);
  };

  useEffect(() => {
    const getSharedLetter = async () => {
      const response = await getLetterDetailInfo(letterId);
      setLetterInfo(response);
    };
    getSharedLetter();
  }, [letterId]);

  /*
  const handle = async () => {
    try {
      if (letterInfo) {
        await navigator.share({
          title: `To. ${letterInfo.receiverName}`,
          text: `${letterInfo.title}\n${formatDate(letterInfo.deliveryDate)} From. ${letterInfo.participantNames
            .map((element) => element)
            .join(", ")}`,
          url: `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`,
        });
        console.log("공유 성공");
      } else {
        console.log("공유 실패");
      }
    } catch (e) {
      console.log("공유 실패");
    }
  };*/

  const handleShare = async () => {
    if (letterInfo) {
      const url = `${import.meta.env.VITE_FRONT_URL}/receive/${letterId}?to=${encodeURIComponent(letterInfo.receiverName)}`;

      if (
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
        } catch (error) {
          console.error("Clipboard API failed:", error);
          fallbackCopyTextToClipboard(url);
        }
      } else {
        // Safari 호환용 대체 복사 방식
        fallbackCopyTextToClipboard(url);
      }
    }
  };

  // 대체 복사 함수
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; // 화면에서 보이지 않도록 고정
    textArea.style.top = "-9999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
      } else {
        alert("텍스트 복사에 실패했습니다.");
      }
    } catch (error) {
      console.error("Fallback copy failed:", error);
      alert("텍스트 복사에 실패했습니다.");
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <ModalContainer>
      <Header>
        <Cancel src={X} alt="cancel" onClick={closeModal} />
      </Header>
      <Contents>
        <List onClick={handleShare}>
          <ShareIcon src={share} alt="share" />
          <Txt>공유하기</Txt>
        </List>
        <List onClick={handlePopup}>
          <DeleteIcon src={delete2} alt="delete" />
          <Txt>삭제하기</Txt>
        </List>
      </Contents>
    </ModalContainer>
  );
};

const ModalContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  background: #fff;
  z-index: 100;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.div`
  display: flex;
  height: 44px;
  padding: 16px 12px 0 16px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
  box-sizing: border-box;
`;
const Cancel = styled.img`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  margin-right: 7.3px;
  cursor: pointer;
`;
const Contents = styled.div`
  display: flex;
  padding: 0px 16px 24px 16px;
  flex-direction: column;
  align-items: flex-end;
  align-self: stretch;
`;
const List = styled.div`
  display: flex;
  padding: 12px 0px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
`;
const ShareIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-left: 4px;
  margin-right: 4px;
  cursor: pointer;
`;
const DeleteIcon = styled.img`
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;
`;
const Txt = styled.div`
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  line-height: 24px;
  letter-spacing: -0.5px;
  cursor: pointer;
`;
