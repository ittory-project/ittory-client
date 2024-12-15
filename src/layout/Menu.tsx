import React, { useState, useEffect } from "react";
import styled from "styled-components";
import X from "../../public/assets/x.svg";
import direction from "../../public/assets/navigate.svg";
import letter_create from "../../public/assets/letter_create.svg";
import letter_receive from "../../public/assets/letter_receive.svg";
import ask from "../../public/assets/menu/ask.svg";
import visit from "../../public/assets/menu/visit.svg";
import graynavi from "../../public/assets/menu/graynavi.svg";
import defaultImage from "../../public/assets/menu/profileImg.svg";
import { useNavigate } from "react-router-dom";
import { getLetterCounts, getMyPage } from "../api/service/MemberService";
import logindefault from "../../public/assets/menu/logindefault.svg";

interface Props {
  onClose: () => void;
}

export interface GroupItem {
  id: number;
  profileImage: string;
  name: string;
}

export const Menu = ({ onClose }: Props) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<boolean>(false);
  const [focusCreate, setFocusCreate] = useState<boolean>(false);
  const [focusReceive, setFocusReceive] = useState<boolean>(false);
  const [navigatePath, setNavigatePath] = useState<string | null>(null);
  const [navigateState, setNavigateState] = useState<{
    focusCreate: boolean;
    focusReceive: boolean;
  } | null>(null);
  const [partiLetter, setPartiLetter] = useState<Number>(0);
  const [receiveLetter, setReceiveLetter] = useState<Number>(0);
  const [profileImage, setProfileImage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    if (localStorage.jwt) {
      setUser(true);
      const fetchLetterCounts = async () => {
        try {
          const counts = await getLetterCounts();
          setPartiLetter(counts.participationLetterCount);
          setReceiveLetter(counts.receiveLetterCount);
          console.log("Letter Counts:", counts);
        } catch (err) {
          console.error("Error fetching letter counts:", err);
        }
      };

      const fetchMyPageData = async () => {
        try {
          const myPageData = await getMyPage();
          setProfileImage(myPageData.profileImage);
          setUserName(myPageData.name);

          console.log("My Page Data:", myPageData);
        } catch (err) {
          console.error("Error fetching my page data:", err);
        }
      };
      fetchLetterCounts();
      fetchMyPageData();
    } else {
      setUser(false);
    }
  }, []);

  const navigateToAccount = () => {
    navigate("/Account");
    onClose();
  };

  useEffect(() => {
    if (navigatePath) {
      navigate(navigatePath, { state: navigateState });
      setNavigatePath(null);
      setNavigateState(null);
      onClose();
    }
  }, [navigatePath, navigateState]);

  const handleCreate = () => {
    if (!localStorage.jwt) {
      navigate("/login");
      onClose();
    } else {
      setFocusCreate(true);
      setFocusReceive(false);
      setNavigateState({ focusCreate: true, focusReceive: false });
      setNavigatePath("/LetterBox");
    }
  };

  const handleReceive = () => {
    if (!localStorage.jwt) {
      navigate("/login");
      onClose();
    } else {
      setFocusCreate(false);
      setFocusReceive(true);
      setNavigateState({ focusCreate: false, focusReceive: true });
      setNavigatePath("/LetterBox");
    }
  };

  const handleCancel = () => {
    onClose();
  };
  const handleLogin = () => {
    navigate("/login");
    onClose();
  };
  const handleAsk = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSf2kfLU3FoKyvgWiA_mzdTrTiYTNn9otsoQkaIIfNYM5Nze2g/viewform",
      "_blank"
    );
  };
  const handleCreateBtn = () => {
    if (!localStorage.jwt) {
      navigate("/login");
      onClose();
    } else {
      navigate("/create");
    }
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
          {!user ? (
            <ProfileImage src={profileImage} alt="Profile" />
          ) : profileImage ? (
            <ProfileImage src={defaultImage} alt="Profile" />
          ) : (
            <ProfileImage src={logindefault} alt="Profile" />
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
            <UserName>{userName}</UserName>
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
            <LetterNum>
              <>{String(partiLetter)}개</>
            </LetterNum>
          )}
        </CreatedLetter>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="204"
          height="2"
          viewBox="0 0 204 2"
          fill="none"
        >
          <path d="M0 1H204" stroke="#DEE2E6" strokeDasharray="4 4" />
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
            <LetterNum>
              <>{String(partiLetter)}개</>
            </LetterNum>
          )}
        </ReceivedLetter>
      </LetterContainer>
      <Button onClick={handleCreateBtn}>
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
        <AskContainer onClick={handleAsk}>
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
  height: calc(var(--vh, 1vh) * 100);
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
  cursor: pointer;
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
