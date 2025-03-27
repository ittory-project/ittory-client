import React, {useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { patchNickname } from "../../api/service/ParticipantService";
import axios from "axios";
import { postEnter } from "../../api/service/LetterService";
import NoAccess from "./NoAccess";
import Started from "./Started";
import Deleted from "./Deleted";
import { DeleteConfirm } from "../InvitePage/Delete/DeleteConfirm";

interface Props {
  nickname: string;
  setViewModal: React.Dispatch<React.SetStateAction<boolean>>;
  visited: boolean;
}

export const JoinModal = ({ nickname, setViewModal, visited }: Props) => {
  const [started, setStarted] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [deleteConf, setDeleteConf] = useState<boolean>(false);
  const [noAccess, setNoAccess] = useState<boolean>(false);
    
  const navigate = useNavigate();
  const letterId = localStorage.letterId;
  console.log(visited);

  const handleCancel = async () => {
    const response = await patchNickname(letterId);
    console.log(response);
    if (response.success) {
      setViewModal(false);
    }
  };

  const handleAccess = async () => {
    try {
          const enterresponse = await postEnter(Number(letterId), {nickname});
          if(enterresponse.enterStatus === true){
            fianlAccess();
          } else {
            if (enterresponse.enterAction === "EXCEEDED") {
              setNoAccess(true);
            } else if (enterresponse.enterAction === "STARTED") {
              setStarted(true);
            } else if (enterresponse.enterAction === "DELETED") {
              setDeleteConf(true);
            }
          }
        } catch (error) {
            console.log(error);
            if (axios.isAxiosError(error) && error.response?.status === 400) {
              console.error("400 Error:", error.response.data);
              navigate("/");
            } else if (
              axios.isAxiosError(error) &&
              error.response?.status === 404
            ) {
              console.error("404 Error:", error.response.data);
              setDeleted(true);
            }
        }
  };

  const fianlAccess = () => {
    try {
      localStorage.removeItem("letterId");
      if (visited) {
        navigate("/Invite", {
          state: {
            letterId: letterId,
            guideOpen: false,
            userName: nickname,
          },
        });
      } else {
        navigate("/Invite", {
          state: {
            letterId: letterId,
            guideOpen: true,
            userName: nickname,
          },
        });
      }
    } catch (err) {
      console.error("error:", err);
    }
  }

  return (
    <>
        {noAccess && <NoAccess />}
        {started && <Started />}
          {deleted && <Deleted />}
          {deleteConf && <DeleteConfirm />}

          {!noAccess && !started && !deleted && !deleteConf &&
           <Modal>
           <Title>'{nickname}'님</Title>
           <Title>으로 참여할까요?</Title>
           <Contents>닉네임은 한번 설정하면 수정할 수 없어요</Contents>
           <ButtonContainer>
             <Button
               style={{
                 background: "#CED4DA",
               }}
               onClick={handleCancel}
             >
               <ButtonTxt style={{ color: "#495057" }}>취소하기</ButtonTxt>
             </Button>
             <Button
               style={{
                 background: "#FFA256",
               }}
               onClick={handleAccess}
             >
               <ButtonTxt style={{ color: "#fff" }}>네!</ButtonTxt>
             </Button>
           </ButtonContainer>
         </Modal>
           }
    </>
  );
};

const Modal = styled.div`
  display: flex;
  width: 272px;
  height: 11.6rem;
  box-sizing: border-box;
  padding: 24px;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  border: 3px solid #d3edff;
  background: linear-gradient(144deg, #fff -0.87%, #fff 109.18%);
  z-index: 100;
  align-items: center;
  margin: 0;
`;
const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
  color: #212529;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  align-self: stretch;
  color: #868e96;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
  margin-top: 7px;
`;
const ButtonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  position: relative;
  margin-top: 1.35rem;
  justify-content: center;
  display: flex;
  width: 100%;
  align-items: center;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  height: 40px;
  padding: 14px 20px;
  align-items: center;
  gap: 8px;
  flex: 1 0 0;
  justify-content: center;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.span`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 14px;
  letter-spacing: -0.5px;
`;
