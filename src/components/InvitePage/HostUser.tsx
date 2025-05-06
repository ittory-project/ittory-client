import React, { useEffect, useState } from 'react';

import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

import bright from '../../../public/assets/border.svg';
import deletebtn from '../../../public/assets/delete.svg';
import info from '../../../public/assets/info.svg';
import barShadow from '../../../public/assets/invite/shadow.svg';
import defaultImg from '../../../public/assets/menu/logindefault.png';
import out from '../../../public/assets/out.svg';
import shadow from '../../../public/assets/shadow2.svg';
import tip from '../../../public/assets/tooltip.svg';
import { CoverType } from '../../api/model/CoverType';
import { LetterDetailGetResponse } from '../../api/model/LetterModel';
import { getCoverTypes } from '../../api/service/CoverService';
import { getFontById } from '../../api/service/FontService';
import { getLetterInfo } from '../../api/service/LetterService';
import { getLetterDetailInfo } from '../../api/service/LetterService';
import { getMyPage } from '../../api/service/MemberService';
import { SessionLogger } from '../../utils/SessionLogger';
import { Count } from './Count/Count';
import { CountPopup } from './Count/CountPopup';
import { Delete } from './Delete/Delete';
import { Exit } from './Exit';
import { Participants } from './Invite';
import { UserGuide } from './UserGuide';
import crown from '/assets/crown.svg';
import plus from '/assets/plus.svg';

const logger = new SessionLogger('invite');

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
}: Props) => {
  const [letterInfo, setLetterInfo] = useState<LetterDetailGetResponse>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [sliceName, setSliceName] = useState<string>('');
  const [guide, setGuide] = useState<boolean>(guideOpen);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [viewExit, setViewExit] = useState<boolean>(false);
  const namesString = items.map((item) => item.nickname).join(', ');
  const [, setMemberId] = useState<number>(0);
  const [, setName] = useState<string>('');
  const [coverTypes, setCoverTypes] = useState<CoverType[]>([]);
  const [cropImg, setCropImg] = useState<string>('');
  const [deliverDay, setDeliverDay] = useState<Date | null>();
  const [title, setTitle] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [fontId, setFontId] = useState<number>(-1);
  const [selectfont, setSelectfont] = useState<string>('');
  const [receiverName, setReceiverName] = useState<string>('');

  useEffect(() => {
    const fetchLetterInfo = async () => {
      const letterData = await getLetterInfo(letterId);
      setCropImg(letterData.coverPhotoUrl);
      setTitle(letterData.title);
      setDeliverDay(parseISO(letterData.deliveryDate));
      setReceiverName(letterData.receiverName);
      setSelectedImageIndex(letterData.coverTypeId);
      setFontId(letterData.fontId);

      const types = await getCoverTypes();
      setCoverTypes(types);

      const myData = await getMyPage();
      setMemberId(myData.memberId);
      setName(myData.name);
    };

    const fetchFont = async () => {
      const fontdata = await getFontById(fontId);
      setSelectfont(fontdata.value);
    };

    //fetchCoverTypes();
    fetchLetterInfo();
    //fetchMyPageData();

    if (fontId > -1) {
      fetchFont();
    }
  }, [letterId]);

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

  useEffect(() => {
    const getSharedLetter = async () => {
      if (letterId) {
        const response = await getLetterDetailInfo(letterId);
        setLetterInfo(response);
      }
    };
    getSharedLetter();
  }, [letterId]);

  // 현재 화면 크기 기준 (430px가 트리거) 모바일 화면인지, 데스크톱 화면인지 구분
  const handleResize = () => {
    setIsMobile(window.innerWidth < 850);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // 화면에서 보이지 않도록 고정
    textArea.style.top = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000); // 3초 후에 알림 숨기기
      } else {
        alert('텍스트 복사에 실패했습니다.');
      }
    } catch (error) {
      alert('텍스트 복사에 실패했습니다.');
      throw error;
    } finally {
      document.body.removeChild(textArea);
    }
  };

  // 모바일, 데스크톱 화면 구분해서 공유하게 함
  const handleShare = async () => {
    if (letterInfo) {
      if (!isMobile) {
        const shareTextPc = `${import.meta.env.VITE_FRONT_URL}/join/${letterId}`;
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          try {
            await navigator.clipboard.writeText(shareTextPc);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
          } catch (error) {
            logger.error('공유 실패: ', error);
            fallbackCopyTextToClipboard(shareTextPc);
          }
        } else {
          // Safari 호환용 대체 복사 방식
          fallbackCopyTextToClipboard(shareTextPc);
        }
      } else {
        // 모바일이면
        try {
          await navigator.share({
            url: `${import.meta.env.VITE_FRONT_URL}/join/${letterId}`,
          });
          logger.debug('공유 성공');
        } catch (e) {
          logger.error('공유 실패', e);
        }
      }
    } else {
      logger.debug('공유 실패');
    }
  };

  return (
    <BackGround>
      {guide && <Overlay />}
      {viewCount && <Overlay />}
      {viewDelete && <Overlay />}
      {viewExit && <Overlay />}
      {popup && <Overlay />}
      {items.length > 0 && fontId > -1 && (
        <>
          <Header>
            <ReceiverContainer>
              <Receiver>To.{sliceName}</Receiver>
              {receiverName.length > 9 && (
                <Receiver style={{ letterSpacing: '-0.2em' }}>···</Receiver>
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
              <TitleContainer $font={selectfont}>{title}</TitleContainer>
              {deliverDay ? (
                <DeliverDay>
                  {`${format(deliverDay as Date, 'yyyy')}. `}
                  {`${format(deliverDay as Date, 'MM')}. `}
                  {format(deliverDay as Date, 'dd')}
                  {` (${format(deliverDay as Date, 'E', { locale: ko })})`}
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
                  <NameTxt $book={selectedImageIndex}>{namesString}</NameTxt>
                </NameContainer>
              </NameBar>
            </Book>
            <BarWrapper>
              <Bar />
            </BarWrapper>
            <BarShadow $img={barShadow} />

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
                          {!user.imageUrl ? (
                            <ProfileImg $img={defaultImg} />
                          ) : (
                            <ProfileImg $img={user.imageUrl} />
                          )}
                          {user.nickname && user.nickname.length > 3 ? (
                            <UserNameContainer>
                              <UserName>
                                {handleUserName(user.nickname)}
                              </UserName>
                              <UserName style={{ letterSpacing: '-0.2em' }}>
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
                              <UserName style={{ letterSpacing: '-0.2em' }}>
                                ···
                              </UserName>
                            </UserNameContainer>
                          ) : (
                            <UserName>{user.nickname}</UserName>
                          )}
                        </User>
                      </InvitedUser>
                    ),
                  )}

                  {items.length < 5 ? (
                    <InviteIcon>
                      {items.length === 1 ? <ToolTip $img={tip} /> : <></>}
                      <User>
                        <ProfileImg
                          $img={plus}
                          onClick={() => {
                            handleShare();
                          }}
                          style={{ cursor: 'pointer' }}
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
              coverId={selectedImageIndex}
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
      {popup && <CountPopup setPopup={setPopup} setViewCount={setViewCount} />}
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  overflow: hidden;

  transform: translateX(-50%);
  //justify-content: center;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;

  width: 100%;
  height: 100%;

  background: rgba(0, 0, 0, 0.6);

  transition: background 0.3s ease;
`;
const CopyAlert = styled.div`
  position: absolute;
  bottom: 32px;
  left: 50%;
  z-index: 100;

  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  padding: var(--Border-Radius-radius_300, 8px) 20px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #fff;

  text-align: center;
  letter-spacing: -0.5px;

  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;

  transform: translateX(-50%);
`;

const Header = styled.div`
  top: 0;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  width: 100%;

  padding: 0px 20px 0px 20px;
  margin-bottom: 16px;
  //position: absolute;
  //padding-bottom: 16px;
`;
const ReceiverContainer = styled.div`
  position: relative;

  display: flex;

  align-items: center;

  height: 48px;
`;
const Receiver = styled.span`
  height: 24px;

  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;
  //flex: 1 0 0;
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
  width: 24px;
  height: 24px;

  cursor: pointer;
`;
const MainContainer = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 288px;
  //margin-top: 16px;
`;
const Book = styled.div<{ $backgroundImage: string }>`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 200px;
  height: 261px;

  background-image: url(${(props) => props.$backgroundImage});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 3.833px 11.5px 11.5px 3.833px;
`;
const TitleContainer = styled.div<{ $font: string }>`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 224px;

  padding: 16px 0px 12px 0px;
  margin-top: 8px;

  font-family: ${(props) => props.$font};
  font-size: ${(props) =>
    props.$font === 'Ownglyph_UNZ-Rg' ? '20.286px' : '14.286px'};
  font-style: normal;
  font-weight: 500;

  line-height: 21.429px;

  color: #fff;

  letter-spacing: -0.446px;
`;
const DeliverDay = styled.div`
  margin-top: -14px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 8px;
  font-style: normal;
  font-weight: Bold;

  line-height: 14.286px;

  color: #ffffff;

  text-align: center;
  letter-spacing: -0.446px;

  opacity: 80%;
`;
const Bright = styled.img`
  position: absolute;
  z-index: 2;

  flex-shrink: 0;

  width: 131px;
  height: 131px;

  margin-top: 73.6px;
  margin-left: 4.2px;
`;
const Shadow = styled.img`
  position: absolute;
  z-index: 3;

  flex-shrink: 0;

  width: 145px;
  height: 145px;

  margin-top: 66px;
  margin-left: 1px;
`;
const BtnImgContainer = styled.div<{ $bgimg: string }>`
  z-index: 2;

  flex-shrink: 0;

  gap: 4px;

  width: 123px;
  height: 123px;

  margin-top: 20px;
  margin-left: 2.5px;

  background-image: url(${(props) => props.$bgimg});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border-radius: 17.647px;
`;
const NameBar = styled.div`
  position: relative;

  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 200px;
  height: 23px;

  margin-top: 20px;

  border: 1px solid rgba(255, 255, 255, 0.8);
  border-right: none;
  border-left: none;
`;
const NameContainer = styled.div`
  display: flex;

  flex-shrink: 0;

  align-items: center;
  justify-content: center;

  width: 200px;
  height: 21px;

  text-align: center;

  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0.823px 0.823px 0.823px 0px rgba(255, 255, 255, 0.25) inset;
`;

const NameTxt = styled.div<{ $book: number }>`
  width: 200px;

  padding: 0 12px 0 12px;

  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 8px;
  font-style: normal;
  font-weight: 700;

  line-height: 12px;

  color: ${({ $book }) => {
    if ($book === 1) return '#715142';
    if ($book === 2) return '#335839';
    if ($book === 3) return '#985566';
    if ($book === 4) return '#232D3D';
    if ($book === 5) return '#232D3D';
  }};

  text-align: center;
  letter-spacing: -0.4px;
`;
const BarWrapper = styled.div`
  position: relative;

  flex-shrink: 0;

  width: 288px;
  height: 14px;

  background: #d3edff;
`;
const Bar = styled.div`
  flex-shrink: 0;

  width: 288px;
  height: 14px;

  background: linear-gradient(245deg, #f1e2bc 33.53%, #e7d5a6 121.78%);
  border-radius: 2px 2px 4px 4px;
  box-shadow:
    0px -1px 0.5px 0px rgba(203, 186, 145, 0.8) inset,
    0px 1px 0.5px 0px rgba(255, 247, 226, 0.7) inset;

  mix-blend-mode: luminosity;
`;

const BarShadow = styled.div<{ $img: string }>`
  flex-shrink: 0;

  width: 288px;
  height: 18px;

  background-image: url(${(props) => props.$img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`;
const BoxContainer = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;
`;
const PinArea = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 232px;

  margin-top: 10px;
`;
//8px로 하면 얇아보여서 일단 9px로..
const Pin = styled.div`
  position: relative;
  top: 4px;

  display: inline-block;

  flex-shrink: 0;

  width: 20px;
  height: 9px;

  background: var(--Color-grayscale-gray400, #ced4da);
  border-radius: var(--Border-Radius-radius_300, 8px);
  box-shadow:
    0px 1px 0.5px 0px rgba(255, 255, 255, 0.5) inset,
    0px -1px 0.5px 0px rgba(0, 0, 0, 0.1) inset;

  transform: rotate(-90deg);
`;
const Box = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  gap: 20px;
  align-items: center;

  width: 288px;
  height: 7rem;

  padding: 24px 16px 20px 16px;

  background: var(--color-black-white-white, #fff);
  border: 2px solid var(--Color-grayscale-gray100, #f1f3f5);
  border-radius: var(--Border-Radius-radius_400, 12px);
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.08);
`;
const List = styled.div`
  display: flex;

  gap: 9px;
  align-items: center;
  align-self: stretch;
  justify-content: center;
`;
const User = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;

  width: 44px;
  //gap: var(--Border-Radius-radius_200, 6px);
`;
const MainUser = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 44px;
`;
const InvitedUser = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 44px;
`;
const UserNameContainer = styled.div`
  display: flex;

  align-items: center;

  white-space: nowrap;
`;
const InviteIcon = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;
`;
const Crown = styled.span<{ $img: string }>`
  position: absolute;
  top: -6px; /* ProfileImg의 위에 위치 */
  left: 50%;

  width: 14px;
  height: 8px;

  background-image: url(${(props) => props.$img});

  transform: translateX(-50%);
`;
const ToolTip = styled.span<{ $img: string }>`
  position: absolute;
  top: -65px; /* ProfileImg의 위에 위치 */
  left: 50%;

  width: 104px;
  height: 56px;

  background-image: url(${(props) => props.$img});

  transform: translateX(-50%);
`;
const ProfileImg = styled.div<{ $img: string }>`
  width: 40px;
  height: 40px;

  margin-bottom: 6px;

  background-image: url(${(props) => props.$img});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  border: 2px solid #fff;
  border-radius: 40px;
`;
const UserName = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
  white-space: nowrap;
  &:first-of-type {
    margin-right: 0;
  }
`;

const Button = styled.button`
  position: fixed;
  bottom: 0;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: calc(100% - 32px);
  height: 48px;

  padding: var(--Typography-size-s, 14px) 20px;
  margin: 0px 16px 20px 16px;

  background: #ffa256;
  border: 0;
  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 16px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #fff;

  letter-spacing: -0.5px;
`;
