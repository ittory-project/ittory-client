import React, { useEffect, useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import styled from 'styled-components';

import { postRepeatCount } from '@/api/service/LetterService';
import { postRandom } from '@/api/service/ParticipantService';
import { getWebSocketApi } from '@/api/websockets';
import bright from '@/assets/border.svg';
import crown from '@/assets/crown.svg';
import deletebtn from '@/assets/delete.svg';
import info from '@/assets/info.svg';
import barShadow from '@/assets/invite/shadow.svg';
import defaultImg from '@/assets/menu/logindefault.png';
import out from '@/assets/out.svg';
import plus from '@/assets/plus.svg';
import shadow from '@/assets/shadow2.svg';
import tip from '@/assets/tooltip.svg';

import { LetterPartiItem } from '../../api/model/LetterModel';
import { coverQuery, fontQuery, letterQuery } from '../../api/queries';
import { getHostUrl, isMobileDevice } from '../../utils';
import { SessionLogger } from '../../utils/SessionLogger';
import { Count } from './Count/Count';
import { CountPopup } from './Count/CountPopup';
import { Delete } from './Delete/Delete';
import { Exit } from './Exit';
import { UserGuide } from './UserGuide';

const logger = new SessionLogger('invite');

interface Props {
  guideOpen: boolean;
  hostname: string;
  items: LetterPartiItem[];
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
  const wsApi = getWebSocketApi();

  const { data: coverTypes } = useSuspenseQuery(coverQuery.all());
  const { data: letterInfo } = useSuspenseQuery(letterQuery.infoById(letterId));
  const { data: font } = useSuspenseQuery(fontQuery.byId(letterInfo.fontId));

  const [sliceName, setSliceName] = useState<string>('');
  const [guide, setGuide] = useState<boolean>(guideOpen);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewCount, setViewCount] = useState<boolean>(false);
  const [popup, setPopup] = useState<boolean>(false);
  const [viewExit, setViewExit] = useState<boolean>(false);
  const namesString = items.map((item) => item.nickname).join(', ');

  useEffect(() => {
    if (letterInfo.receiverName.length > 9) {
      setSliceName(letterInfo.receiverName.slice(0, 9));
    } else {
      setSliceName(letterInfo.receiverName);
    }
  }, [letterInfo.receiverName]);

  const handleSubmit = async (selectNumber: number) => {
    const count = Number(selectNumber);
    const id = letterId;

    const requestBody = { letterId: id, repeatCount: count };
    await postRepeatCount(requestBody);
    await postRandom({ letterId: id });

    wsApi.send('startLetter', [letterId]);
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
      if (!isMobileDevice()) {
        const shareTextPc = `${getHostUrl()}/join/${letterId}`;
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
            url: `${getHostUrl()}/join/${letterId}`,
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
      {items.length > 0 && letterInfo.fontId > -1 && (
        <>
          <Header>
            <ReceiverContainer>
              <Receiver>To.{sliceName}</Receiver>
              {letterInfo.receiverName.length > 9 && (
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
                coverTypes[letterInfo.coverTypeId - 1]?.confirmImageUrl
              }
            >
              <TitleContainer $font={font.value}>
                {letterInfo.title}
              </TitleContainer>
              {letterInfo.deliveryDate ? (
                <DeliverDay>
                  {`${format(letterInfo.deliveryDate, 'yyyy')}. `}
                  {`${format(letterInfo.deliveryDate, 'MM')}. `}
                  {format(letterInfo.deliveryDate, 'dd')}
                  {` (${format(letterInfo.deliveryDate, 'E', { locale: ko })})`}
                </DeliverDay>
              ) : (
                <></>
              )}
              <>
                <Bright src={bright} />
                <Shadow src={shadow} />
                <BtnImgContainer $bgimg={letterInfo.coverPhotoUrl} />
              </>
              <NameBar>
                <NameContainer>
                  <NameTxt $book={letterInfo.coverTypeId}>
                    {namesString}
                  </NameTxt>
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
                          <UserNameContainer>
                            <UserName>{user.nickname}</UserName>
                          </UserNameContainer>
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
                          <UserNameContainer>
                            <UserName>{user.nickname}</UserName>
                          </UserNameContainer>
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
                        <FriendInviteDesc>친구 초대</FriendInviteDesc>
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
              coverId={letterInfo.coverTypeId}
              setViewCount={setViewCount}
              numOfParticipants={items.length}
              onSubmit={handleSubmit}
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

const FriendInviteDesc = styled.div`
  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;

const UserName = styled.div`
  width: 44px;

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
