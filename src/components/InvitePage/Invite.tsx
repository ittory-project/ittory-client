import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import out from "../../../public/assets/out.svg";
import deletebtn from "../../../public/assets/delete.svg";
import info from "../../../public/assets/info.svg";
import crown from "../../../public/assets/crown.svg";
import plus from "../../../public/assets/plus.svg";
import tip from "../../../public/assets/tooltip.svg";
import { UserGuide } from "./UserGuide";
import { Delete } from "./Delete";

export interface GroupItem {
  id: number;
  profileImage: string;
  name: string;
}

export const Invite = () => {
  const items: GroupItem[] = [
    {
      id: 1,
      profileImage: "../../../public/img/profileimage.svg",
      name: "카리나",
    },

    {
      id: 2,
      profileImage: "../../../public/img/profileimage.svg",
      name: "닝닝",
    },
    {
      id: 3,
      profileImage: "../../../public/img/profileimage.svg",
      name: "윈터",
    },
    {
      id: 4,
      profileImage: "../../../public/img/profileimage.svg",
      name: "아이유우",
    },

    {
      id: 5,
      profileImage: "../../../public/img/profileimage.svg",
      name: "예지",
    },
  ];
  const location = useLocation();
  const receiverName = location.state.receiverName;
  const title = location.state.title;
  const backgroundImage = location.state.backgroundImage;
  const croppedImage = location.state.croppedImage;
  const selectfont = location.state.selectfont;
  const deliverDay = location.state.deliverDay;
  const selectedImageIndex = location.state.selectedImageIndex;
  const guideOpen = location.state.guideOpen;

  const [sliceName, setSliceName] = useState<string>("");
  const [sliceUserName, setSliceUserName] = useState<string>("");
  //몇자 이상시 유저 네임 말줄임 되는지
  const [guide, setGuide] = useState<boolean>(guideOpen);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewDelete, setViewDelete] = useState<boolean>(false);
  const [mainPage, setMainPage] = useState<boolean>(true);

  useEffect(() => {
    if (receiverName.length > 9) {
      setSliceName(receiverName.slice(0, 9));
    } else {
      setSliceName(receiverName);
    }
  }, []);

  const handleUserName = (name: string) => {
    return name.slice(0, 3);
  };

  const handleGuide = () => {
    setGuide(true);
  };

  const handleDeleteview = () => {
    setViewDelete(true);
  };

  const handle = async () => {
    const url = "https://shinsangeun.github.io";
    if (navigator.share) {
      try {
        await navigator.share({
          title: "기록하며 성장하기",
          text: "Hello World",
          url,
        });
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url); // 링크를 클립보드에 복사
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
      } catch (error) {
        console.error("Copy failed:", error);
        alert("링크 복사에 실패했습니다.");
      }
    }
  }; //토스트메시지 노출시간 정하기

  return (
    <BackGround>
      {guide && <Overlay />}
      {!viewDelete && (
        <>
          <Header>
            <ReceiverContainer>
              <Receiver>To.{sliceName}</Receiver>
              {receiverName.length > 9 && (
                <Receiver style={{ letterSpacing: "-0.2em" }}>···</Receiver>
              )}
            </ReceiverContainer>
            <IconContainer>
              <Icon src={info} alt="infobtn" onClick={handleGuide} />
              <Icon
                src={deletebtn}
                alt="deletebtn"
                onClick={handleDeleteview}
              />
              <Icon src={out} alt="outbtn" />
            </IconContainer>
            {/* 삭제 아이콘은 방장에게만 */}
          </Header>
          <MainContainer>
            <Book backgroundImage={backgroundImage}>
              <TitleContainer font={selectfont}>{title}</TitleContainer>
              {selectedImageIndex === 0 && (
                <BtnImgContainer bgimg={croppedImage} />
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
            <Bar />
            <BoxContainer>
              <PinArea>
                <Pin />
                <Pin />
              </PinArea>
              <Box>
                <List>
                  {items.map((user) =>
                    user.id === 1 ? (
                      <MainUser>
                        <Crown img={crown} />
                        <User>
                          <ProfileImg img={items[0].profileImage} />
                          <UserName>{items[0].name}</UserName>
                        </User>
                      </MainUser>
                    ) : (
                      <InvitedUser>
                        <User>
                          <ProfileImg img={user.profileImage} />
                          {user.name.length > 3 ? (
                            <UserNameContainer>
                              <UserName>{handleUserName(user.name)}</UserName>
                              <UserName style={{ letterSpacing: "-0.2em" }}>
                                ···
                              </UserName>
                            </UserNameContainer>
                          ) : (
                            <UserName>{user.name}</UserName>
                          )}
                        </User>
                      </InvitedUser>
                    )
                  )}

                  {items.length < 5 ? (
                    <InviteIcon>
                      {items.length === 1 ? <ToolTip img={tip} /> : <></>}
                      <User>
                        <ProfileImg
                          img={plus}
                          onClick={() => {
                            handle();
                          }}
                        />
                        <UserName>친구 초대</UserName>
                      </User>
                    </InviteIcon>
                  ) : (
                    <></>
                  )}
                </List>
              </Box>
            </BoxContainer>
          </MainContainer>
          <Button>
            <ButtonTxt>이어 쓸 횟수 정하기</ButtonTxt>
            {/* 바텀 시트 */}
          </Button>
          {guide && <UserGuide setGuide={setGuide} />}
          {copied && <CopyAlert>링크를 복사했어요</CopyAlert>}
        </>
      )}

      {viewDelete && <Delete setViewDelete={setViewDelete} />}
    </BackGround>
  );
};
//인덱스 0일때 크라운
const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #d3edff;
  background-blend-mode: overlay, normal;
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
const CopyAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  bottom: 32px;
  transform: translateX(-50%);
`;
const Header = styled.div`
  display: flex;
  padding: 0px 20px 0px 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  height: 4rem;
`;
const ReceiverContainer = styled.div`
  display: flex;
  align-items: center;
`;
const Receiver = styled.span`
  height: 24px;
  //flex: 1 0 0;
  color: #212529;
  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  &:first-of-type {
    margin-right: 0; /* 첫 번째 Receiver와 다음 Receiver 사이의 간격을 제거 */
  }
`;
const IconContainer = styled.div`
  display: flex;
  gap: 18px;
  align-items: center;
`;
const Icon = styled.img`
  cursor: pointer;
  width: 24px;
  height: 24px;
  margin-right: 0;
`;
const MainContainer = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  align-items: center;
`;
const Book = styled.div<{ backgroundImage: string }>`
  width: 200px;
  height: 260px;
  margin-top: 2rem;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;
const BtnImgContainer = styled.div<{ bgimg: string }>`
  width: 134px;
  height: 134px;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 100px;
  background-image: url(${(props) => props.bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 4px;
  margin-left: 4.5px;
`;
const TitleContainer = styled.div<{ font: string }>`
  display: flex;
  margin-top: 10px;
  width: 224px;
  color: #fff;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  font-family: ${(props) => props.font};
  font-size: ${(props) =>
    props.font === "Ownglyph_UNZ-Rg" ? "20.286px" : "14.286px"};
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.446px;
  line-height: 21.429px;
`;
const DeliverDay = styled.div`
  color: #fff;
  margin-top: 175px;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 9.821px;
  font-style: normal;
  font-weight: 400;
  line-height: 14.286px;
  letter-spacing: -0.446px;
`;
const Bar = styled.div`
  width: 288px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 2px 2px var(--Border-Radius-radius_100, 4px)
    var(--Border-Radius-radius_100, 4px);
  background: linear-gradient(245deg, #f1e2bc 33.53%, #e7d5a6 121.78%);
  mix-blend-mode: luminosity;
  box-shadow:
    0px -1px 0.5px 0px rgba(203, 186, 145, 0.8) inset,
    0px 1px 0.5px 0px rgba(255, 247, 226, 0.7) inset;
`;
const BoxContainer = styled.div`
  display: flex;
  height: 116px;
  margin-top: 3.5rem;
  flex-direction: column;
  align-items: center; //수직
  justify-content: center; //수평
`;
const PinArea = styled.div`
  display: flex;
  width: 232px;
  align-items: center;
  justify-content: space-between;
`;
const Pin = styled.div`
  width: 20px;
  display: inline-block;
  height: 8px;
  transform: rotate(-90deg);
  flex-shrink: 0;
  border-radius: var(--Border-Radius-radius_300, 8px);
  background: var(--Color-grayscale-gray400, #ced4da);
  box-shadow:
    0px 1px 0.5px 0px rgba(255, 255, 255, 0.5) inset,
    0px -1px 0.5px 0px rgba(0, 0, 0, 0.1) inset;
`;
const Box = styled.div`
  display: flex;
  width: 288px;
  height: 7rem;
  box-sizing: border-box;
  padding: 24px 16px 20px 16px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: var(--Border-Radius-radius_400, 12px);
  border: 2px solid var(--Color-grayscale-gray100, #f1f3f5);
  background: var(--color-black-white-white, #fff);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
`;
const List = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
  align-self: stretch;
`;
const User = styled.div`
  display: flex;
  width: 44px;
  flex-direction: column;
  align-items: center;
  //gap: var(--Border-Radius-radius_200, 6px);
`;
const MainUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 44px;
`;
const InvitedUser = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 44px;
`;
const UserNameContainer = styled.div`
  display: flex;
  align-items: center;
  white-space: nowrap;
`;
const InviteIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Crown = styled.span<{ img: string }>`
  width: 14px;
  height: 8px;
  background-image: url(${(props) => props.img});
  position: absolute;
  top: -6px; /* ProfileImg의 위에 위치 */
  left: 50%;
  transform: translateX(-50%);
`;
const ToolTip = styled.span<{ img: string }>`
  width: 104px;
  height: 56px;
  background-image: url(${(props) => props.img});
  position: absolute;
  top: -65px; /* ProfileImg의 위에 위치 */
  left: 50%;
  transform: translateX(-50%);
`;
const ProfileImg = styled.div<{ img: string }>`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 2px solid #fff;
  background-image: url(${(props) => props.img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 6px;
`;
const UserName = styled.div<{ isLongName: boolean }>`
  overflow: hidden;
  color: #000;
  text-align: center;
  text-overflow: ellipsis;
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 16px;
  letter-spacing: -0.5px;
  white-space: nowrap;
  overflow: hidden;
  //text-overflow: ${(props) => (props.isLongName ? "ellipsis" : "clip")};
  &:first-of-type {
    margin-right: 0; /* 첫 번째 Receiver와 다음 Receiver 사이의 간격을 제거 */
  }
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
