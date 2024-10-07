import React, { useState, useEffect } from "react";
import styled from "styled-components";
import X from "../../public/assets/x.svg";
import direction from "../../public/assets/navigate.svg";
import letter_create from "../../public/assets/letter_create.svg";
import letter_receive from "../../public/assets/letter_receive.svg";
import ask from "../../public/assets/ask.svg";
import visit from "../../public/assets/visit.svg";
import graynavi from "../../public/assets/graynavi.svg";
import { useNavigate } from "react-router-dom";

interface Props {
  onClose: () => void;
}

export interface GroupItem {
  id: number;
  profileImage: string;
  name: string;
}

export const Menu = ({ onClose }: Props) => {
  const User: GroupItem = {
    id: 1,
    profileImage: "../../../public/img/profileimage.svg",
    name: "카리나",
  };
  const navigate = useNavigate();
  const [user, setUser] = useState<boolean>(true);
  //user여부 (로그인 여부)
  const [focusCreate, setFocusCreate] = useState<boolean>(false);
  const [focusReceive, setFocusReceive] = useState<boolean>(false);
  const [navigatePath, setNavigatePath] = useState<string | null>(null);
  const [navigateState, setNavigateState] = useState<{
    focusCreate: boolean;
    focusReceive: boolean;
  } | null>(null);

  const navigateToAccount = () => {
    navigate("/Account");
    onClose();
  };

  useEffect(() => {
    if (navigatePath) {
      navigate(navigatePath, { state: navigateState });
      setNavigatePath(null);
      setNavigateState(null);
    }
  }, [navigatePath, navigateState]);

  const handleCreate = () => {
    setFocusCreate(true);
    setFocusReceive(false);
    setNavigateState({ focusCreate: true, focusReceive: false });
    setNavigatePath("/LetterBox");
    onClose();
  };

  const handleReceive = () => {
    setFocusCreate(false);
    setFocusReceive(true);
    setNavigateState({ focusCreate: false, focusReceive: true });
    setNavigatePath("/LetterBox");
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };
  const handleLogin = () => {
    //로그인화면으로
  };
  return (
    <BackGround>
      <Cancel>
        <img
          src={X}
          alt="X"
          style={{ width: "14px", height: "14px" }}
          onClick={handleCancel}
        />
      </Cancel>
      <Profile>
        <ImageContainer>
          {/* 로그인 전, 프로필 사진 없을 시 기본 캐릭터 */}
          {User.profileImage !== "" && user === true ? (
            <ProfileImage src={User.profileImage} alt="Profile" />
          ) : (
            <DefaultImage />
          )}
        </ImageContainer>
        {user === false ? (
          <>
            <NavigateLogin onClick={handleLogin}>
              로그인하고 이용하기
              {<img src={direction} style={{ width: "5px", height: "10px" }} />}
            </NavigateLogin>
          </>
        ) : (
          <UserSet>
            <UserName>{User.name}</UserName>
            <UserSetting onClick={navigateToAccount}>
              계정 관리
              <img
                src={graynavi}
                style={{
                  width: "3.75px",
                  height: "7.5px",
                  marginTop: "1px",
                  marginLeft: "5.75px",
                }}
              />
            </UserSetting>
          </UserSet>
        )}
      </Profile>
      <LetterContainer>
        <CreatedLetter onClick={handleCreate}>
          <img
            src={letter_create}
            style={{ width: "18px", height: "14px", marginBottom: "1.2px" }}
          />
          참여한 편지
          {user === false ? (
            <LetterNum style={{ color: "#ADB5BD" }}>0개</LetterNum>
          ) : (
            <LetterNum>2개</LetterNum>
          )}
        </CreatedLetter>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="204"
          height="2"
          viewBox="0 0 204 2"
          fill="none"
        >
          <path d="M0 1H204" stroke="#DEE2E6" stroke-dasharray="4 4" />
        </svg>
        <ReceivedLetter onClick={handleReceive}>
          <img
            src={letter_receive}
            style={{ width: "18px", height: "18px", marginBottom: "1.2px" }}
          />
          받은 편지
          {user === false ? (
            <LetterNum style={{ color: "#ADB5BD" }}>0개</LetterNum>
          ) : (
            <LetterNum>2개</LetterNum>
          )}
        </ReceivedLetter>
      </LetterContainer>
      <Button>
        <ButtonTxt>편지 쓰러 가기</ButtonTxt>
      </Button>
      <List>
        <VisitContainer>
          <img
            src={visit}
            style={{ width: "16px", height: "16px", marginBottom: "1.2px" }}
          />
          방명록
          <Navi>
            <img src={graynavi} style={{ width: "5px", height: "10px" }} />
          </Navi>
        </VisitContainer>
        <AskContainer>
          <img
            src={ask}
            style={{ width: "16px", height: "16px", marginBottom: "1.2px" }}
          />
          문의하기
          <Navi>
            <img src={graynavi} style={{ width: "5px", height: "10px" }} />
          </Navi>
        </AskContainer>
      </List>
    </BackGround>
  );
};

const BackGround = styled.div`
  width: 260px;
  height: 100vh;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
`;
const Cancel = styled.div`
  position: absolute;
  display: flex;
  width: 24px;
  height: 24px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  right: 12px;
  top: 12px;
`;
const Profile = styled.div`
  display: flex;
  height: 52px;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-top: 72px;
  margin-left: 16px;
  margin-right: 38px;
`;
const ImageContainer = styled.div`
  width: 52px;
  height: 52px;
  display: flex;
  padding: 4px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
`;
const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 120.93px;
`;
const DefaultImage = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  color: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 44px; /* Center text vertically */
`;
const UserSet = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 2px;
`;
const UserName = styled.div`
  width: 168px;
  color: #000;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const UserSetting = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #868e96;
  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const NavigateLogin = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  gap: 9px;
  color: #000;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: -0.5px;
`;
const LetterContainer = styled.div`
  display: flex;
  width: 228px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
  margin-bottom: 0.75rem;
`;
const CreatedLetter = styled.div`
  display: flex;
  height: 60px;
  gap: 6px;
  padding: 19px 12px 21px 12px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  color: #343a40;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const ReceivedLetter = styled.div`
  display: flex;
  height: 60px;
  gap: 6px;
  padding: 19px 12px 21px 12px;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  box-sizing: border-box;
  color: #343a40;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const LetterNum = styled.div`
  color: #343a40;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  right: 32px;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  width: 228px;
  height: 36px;
  padding: var(--Typography-size-s, 14px) 20px;
  align-items: center;
  gap: 8px;
  justify-content: center;
  align-self: stretch;
  border-radius: 50px;
  background: #ffa256;
  margin-left: 16px;
`;
const ButtonTxt = styled.div`
  color: #fff;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const List = styled.div`
  display: flex;
  width: 228px;
  flex-direction: column;
  align-items: center;
  position: absolute;
  bottom: 1.5rem;
`;
const VisitContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 0px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #212529;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const AskContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  box-sizing: border-box;
  width: 100%;
  padding: 16px 0px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #212529;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
`;
const Navi = styled.div`
  display: flex;
  width: 16px;
  height: 16px;
  padding: 3px 6px 3px 5px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  position: absolute;
  right: 0;
`;
