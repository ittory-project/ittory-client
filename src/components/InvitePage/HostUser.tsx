import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ko } from "date-fns/locale";
import out from "../../../public/assets/out.svg";
import deletebtn from "../../../public/assets/delete.svg";
import info from "../../../public/assets/info.svg";
import crown from "../../../public/assets/crown.svg";
import plus from "../../../public/assets/plus.svg";
import tip from "../../../public/assets/tooltip.svg";
import { UserGuide } from "./UserGuide";
import { Delete } from "./Delete/Delete";
import { CountPopup } from "./Count/CountPopup";
import { Count } from "./Count/Count";
import { Exit } from "./Exit";
import bright from "../../../public/assets/border.svg";
import shadow from "../../../public/assets/shadow2.svg";
import { getMyPage } from "../../api/service/MemberService";
import { enterLetterWs } from "../../api/service/WsService";
import { Participants } from "./Invite";
import { getCoverTypes } from "../../api/service/CoverService";
import { CoverType } from "../../api/model/CoverType";
import { getLetterInfo } from "../../api/service/LetterService";
import { useNavigate } from "react-router-dom";
import defaultImg from "../../../public/assets/menu/profileImg.svg";

interface Props {
  guideOpen: boolean;
  hostname: string;
  items: Participants[];
  letterId: number;
  viewDelete: boolean;
  setViewDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HostUser = ({
  guideOpen,
  items = [],
  letterId,
  viewDelete,
  setViewDelete,
  hostname,
}: Props) => {
  const [sliceName, setSliceName] = useState<string>("");
  const [guide, setGuide] = useState<boolean>(guideOpen);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [viewExit, setViewExit] = useState<boolean>(false);
  const namesString = items.map((item) => item.nickname).join(", ");
  const [memberId, setMemberId] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [cropImg, setCropImg] = useState<string>("");
  const [deliverDay, setDeliverDay] = useState<Date | null>();
  const [title, setTitle] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectfont, setSelectfont] = useState<number>(-1);
  const [receiverName, setReceiverName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoverTypes = async () => {
      try {
        const types = await getCoverTypes();
        setCoverTypes(types);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchLetterInfo = async () => {
      try {
        const letterData = await getLetterInfo(letterId);
        setCropImg(letterData.coverPhotoUrl);
        setTitle(letterData.title);
        setDeliverDay(parseISO(letterData.deliveryDate));
        setReceiverName(letterData.receiverName);
        setSelectedImageIndex(letterData.coverTypeId);
        setSelectfont(letterData.fontId);
        //Id가 아닌 value로 받을 수 있는 지
      } catch (err) {
        console.error(err);
      }
    };

    const fetchMyPageData = async () => {
      try {
        const myData = await getMyPage();
        setMemberId(myData.memberId);
        setName(myData.name);
      } catch (err) {
        console.error("Error fetching my data:", err);
      }
    };

    fetchCoverTypes();
    fetchLetterInfo();
    fetchMyPageData();
  }, []);

  useEffect(() => {
    if (receiverName.length > 9) {
      setSliceName(receiverName.slice(0, 9));
    } else {
      setSliceName(receiverName);
    }
  }, [receiverName]);

  const handleUserName = (name: string) => {
    return name.slice(0, 3);
  };

  const handleGuide = () => {
    setGuide(true);
  };

  const handleDeleteview = () => {
    setViewDelete(true);
  };
  const handleExit = () => {
    setViewExit(true);
  };

  const handleCountview = () => {
    setPopup(true);
  };

  const handle = async () => {
    const url = `${import.meta.env.VITE_FRONT_URL}/join/${letterId}`;

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
  //          {title !== "" && items[0].nickname && receiverName !== "" &&
  return (
    <BackGround>
      {guide && <Overlay />}
      {viewCount && <Overlay />}
      {!viewDelete && !viewExit && !popup && items.length > 0 && (
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
              <Icon src={out} alt="outbtn" onClick={handleExit} />
            </IconContainer>
          </Header>
          <MainContainer>
            <Book
              $backgroundImage={
                coverTypes[selectedImageIndex - 1]?.confirmImageUrl
              }
            >
              <TitleContainer $font="GmarketSans">{title}</TitleContainer>
              {deliverDay ? (
                <DeliverDay>
                  {`${format(deliverDay as Date, "yyyy")}. `}
                  {`${format(deliverDay as Date, "MM")}. `}
                  {format(deliverDay as Date, "dd")}
                  {` (${format(deliverDay as Date, "E", { locale: ko })})`}
                </DeliverDay>
              ) : (
                <></>
              )}
              <>
                <Bright src={bright} />
                <Shadow src={shadow} />
                <BtnImgContainer $bgimg={cropImg} />
              </>
              <NameBar>
                <NameContainer>
                  <NameTxt>{namesString}</NameTxt>
                </NameContainer>
              </NameBar>
            </Book>
            <Bar />
            <BoxContainer>
              <PinArea>
                <Pin />
                <Pin />
              </PinArea>
              <Box>
                <List>
                  {items.map((user, index) =>
                    index === 0 ? (
                      <MainUser key={index}>
                        <Crown $img={crown} />
                        <User>
                          {user.imageUrl == "" ? (
                            <ProfileImg $img={defaultImg} />
                          ) : (
                            <ProfileImg $img={user.imageUrl} />
                          )}
                          {user.nickname && user.nickname.length > 3 ? (
                            <UserNameContainer>
                              <UserName>
                                {handleUserName(user.nickname)}
                              </UserName>
                              <UserName style={{ letterSpacing: "-0.2em" }}>
                                ···
                              </UserName>
                            </UserNameContainer>
                          ) : (
                            <UserName>{user.nickname}</UserName>
                          )}
                        </User>
                      </MainUser>
                    ) : (
                      <InvitedUser key={index}>
                        <User>
                          {!user.imageUrl ? (
                            <ProfileImg $img={defaultImg} />
                          ) : (
                            <ProfileImg $img={user.imageUrl} />
                          )}
                          {user.nickname.length > 3 ? (
                            <UserNameContainer>
                              <UserName>
                                {handleUserName(user.nickname)}
                              </UserName>
                              <UserName style={{ letterSpacing: "-0.2em" }}>
                                ···
                              </UserName>
                            </UserNameContainer>
                          ) : (
                            <UserName>{user.nickname}</UserName>
                          )}
                        </User>
                      </InvitedUser>
                    )
                  )}

                  {items.length < 5 ? (
                    <InviteIcon>
                      {items.length === 1 ? <ToolTip $img={tip} /> : <></>}
                      <User>
                        <ProfileImg
                          $img={plus}
                          onClick={() => {
                            handle();
                          }}
                          style={{ cursor: "pointer" }}
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
            <Button onClick={handleCountview}>
              <ButtonTxt>이어 쓸 횟수 정하기</ButtonTxt>
            </Button>
          </MainContainer>

          {guide && <UserGuide setGuide={setGuide} />}
          {copied && <CopyAlert>링크를 복사했어요</CopyAlert>}
          {viewCount && (
            <Count
              letterId={letterId}
              setViewCount={setViewCount}
              member={items.length}
            />
          )}
        </>
      )}
      {viewDelete && (
        <Delete letterId={letterId} setViewDelete={setViewDelete} />
      )}
      {viewExit && <Exit setViewExit={setViewExit} letterId={letterId} />}
      {popup && (
        <CountPopup
          setPopup={setPopup}
          setViewCount={setViewCount}
          letterId={letterId}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(var(--vh, 1vh) * 100);
  overflow: hidden;
  width: 100%;
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
  position: absolute;
  box-sizing: border-box;
  top: 0;
  display: flex;
  width: 100%;
  padding: 0px 20px 0px 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  height: 4rem;
`;
const ReceiverContainer = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  height: 48px;
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
`;
const MainContainer = styled.div`
  display: flex;
  width: 288px;
  flex-direction: column;
  align-items: center;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  width: 200px;
  height: 261px;
  margin-top: 1.5rem;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
  background-image: url(${(props) => props.$backgroundImage});
  display: flex;
  align-items: center;
  flex-direction: column;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;
const TitleContainer = styled.div<{ $font: string }>`
  display: flex;
  margin-top: 8px;
  width: 224px;
  color: #fff;
  padding: 16px 0px 12px 0px;
  justify-content: center;
  align-items: center;
  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === "Ownglyph_UNZ-Rg" ? "20.286px" : "14.286px"};
  font-style: normal;
  font-weight: 500;
  letter-spacing: -0.446px;
  line-height: 21.429px;
`;
const DeliverDay = styled.div`
  color: #fff;
  margin-top: -14px;
  text-align: center;
  font-family: var(--Typography-family-caption, SUIT);
  font-size: 9.821px;
  font-style: normal;
  font-weight: 400;
  line-height: 14.286px;
  letter-spacing: -0.446px;
`;
const Bright = styled.img`
  width: 131px;
  height: 131px;
  margin-left: 4.2px;
  margin-top: 73.6px;
  position: absolute;
  z-index: 2;
  flex-shrink: 0;
`;
const Shadow = styled.img`
  width: 145px;
  height: 145px;
  margin-left: 3.8px;
  margin-top: 68px;
  position: absolute;
  z-index: 3;
  flex-shrink: 0;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  width: 121px;
  height: 121px;
  gap: 4px;
  z-index: 2;
  flex-shrink: 0;
  border-radius: 17.647px;
  background-image: url(${(props) => props.$bgimg});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 20.3px;
  margin-left: 4.6px;
`;
const NameBar = styled.div`
  margin-top: 20px;
  width: 200px;
  height: 23px;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-right: none;
  border-left: none;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NameContainer = styled.div`
  width: 200px;
  height: 21px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0.823px 0.823px 0.823px 0px rgba(255, 255, 255, 0.25) inset;
  justify-content: center;
  display: flex;
  align-items: center;
  text-align: center;
`;
const NameTxt = styled.div`
  padding: 0 12px 0 12px;
  width: 200px;
  color: #715142;
  text-align: center;
  text-overflow: ellipsis;
  font-family: SUIT;
  font-size: 8px;
  font-style: normal;
  font-weight: 700;
  line-height: 12px;
  letter-spacing: -0.4px;
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
  margin-top: 21px;
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
const Crown = styled.span<{ $img: string }>`
  width: 14px;
  height: 8px;
  background-image: url(${(props) => props.$img});
  position: absolute;
  top: -6px; /* ProfileImg의 위에 위치 */
  left: 50%;
  transform: translateX(-50%);
`;
const ToolTip = styled.span<{ $img: string }>`
  width: 104px;
  height: 56px;
  background-image: url(${(props) => props.$img});
  position: absolute;
  top: -65px; /* ProfileImg의 위에 위치 */
  left: 50%;
  transform: translateX(-50%);
`;
const ProfileImg = styled.div<{ $img: string }>`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  border: 2px solid #fff;
  background-image: url(${(props) => props.$img});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 6px;
`;
const UserName = styled.div`
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
  &:first-of-type {
    margin-right: 0;
  }
`;

const Button = styled.button`
  box-sizing: border-box;
  display: flex;
  width: 100%;
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
  position: relative;
  margin-bottom: 20px;
  margin-top: 5rem;
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
