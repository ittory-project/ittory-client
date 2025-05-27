import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import ask from '@/assets/menu/ask.svg';
import graynavi from '@/assets/menu/graynavi.svg';
import letter_create from '@/assets/menu/letter_create.svg';
import letter_receive from '@/assets/menu/letter_receive.svg';
import logindefault from '@/assets/menu/logindefault.png';
import defaultImage from '@/assets/menu/profileImg.png';
import direction from '@/assets/navigate.svg';
import X from '@/assets/x.svg';

import { accessTokenRepository } from '../api/config/AccessTokenRepository';
import { userQuery } from '../api/queries';
import { TempLoginArea } from './TempLogin';

interface Props {
  onClose: () => void;
}

export interface GroupItem {
  id: number;
  profileImage: string;
  name: string;
}

export const Menu = ({ onClose }: Props) => {
  const isLoggedIn = accessTokenRepository.isLoggedIn();
  const { data: myInfo } = useQuery({
    ...userQuery.myInfo(),
    enabled: isLoggedIn,
  });
  const { data: letterCounts } = useQuery({
    ...userQuery.letterCounts(),
    enabled: isLoggedIn,
  });
  const partiLetter = letterCounts?.participationLetterCount ?? 0;
  const receiveLetter = letterCounts?.receiveLetterCount ?? 0;

  const navigate = useNavigate();
  const [navigatePath, setNavigatePath] = useState<string | null>(null);
  const [navigateState, setNavigateState] = useState<{
    focusCreate: boolean;
    focusReceive: boolean;
  } | null>(null);

  const navigateToAccount = () => {
    navigate('/Account');
    onClose();
  };

  useEffect(() => {
    if (navigatePath) {
      navigate(navigatePath, { state: navigateState });
      setNavigatePath(null);
      setNavigateState(null);
      onClose();
    }
  }, [navigatePath, navigateState, navigate, onClose]);

  const handleCreate = () => {
    if (!accessTokenRepository.isLoggedIn()) {
      navigate('/login');
      onClose();
    } else {
      setNavigateState({ focusCreate: true, focusReceive: false });
      setNavigatePath('/LetterBox');
    }
  };

  const handleReceive = () => {
    if (!accessTokenRepository.isLoggedIn()) {
      navigate('/login');
      onClose();
    } else {
      setNavigateState({ focusCreate: false, focusReceive: true });
      setNavigatePath('/LetterBox');
    }
  };

  const handleCancel = () => {
    onClose();
  };
  const handleLogin = () => {
    navigate('/login');
    onClose();
  };
  const handleAsk = () => {
    window.open(
      'https://docs.google.com/forms/d/e/1FAIpQLSf2kfLU3FoKyvgWiA_mzdTrTiYTNn9otsoQkaIIfNYM5Nze2g/viewform',
      '_blank',
    );
  };

  const handleCreateBtn = () => {
    if (!accessTokenRepository.isLoggedIn()) {
      navigate('/login');
      onClose();
    } else {
      window.location.href = '/create';
    }
  };

  return (
    <BackGround>
      <Cancel>
        <img
          src={X}
          alt="X"
          style={{ width: '16px', height: '16px' }}
          onClick={handleCancel}
        />
      </Cancel>
      <Profile>
        <ImageContainer>
          {myInfo ? (
            myInfo.profileImage ? (
              <ProfileImage src={myInfo.profileImage} alt="Profile" />
            ) : (
              <ProfileImage src={logindefault} alt="Profile" />
            )
          ) : (
            <ProfileImage src={defaultImage} alt="Profile" />
          )}
        </ImageContainer>
        {!myInfo ? (
          <>
            <NavigateLogin onClick={handleLogin}>
              로그인하고 이용하기
              {<img src={direction} style={{ width: '7px', height: '12px' }} />}
            </NavigateLogin>
          </>
        ) : (
          <UserSet>
            <UserName>{myInfo.name}</UserName>
            <UserSetting onClick={navigateToAccount}>
              계정 관리
              <img
                src={graynavi}
                style={{
                  width: '5px',
                  height: '9px',
                  marginLeft: '5.75px',
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
            style={{ width: '20px', height: '20px', marginBottom: '1.2px' }}
          />
          참여한 편지
          {!myInfo ? (
            <LetterNum style={{ color: '#ADB5BD' }}>0개</LetterNum>
          ) : (
            <LetterNum
              style={{ color: partiLetter === 0 ? '#ADB5BD' : 'inherit' }}
            >
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
            style={{ width: '20px', height: '20px', marginBottom: '1.2px' }}
          />
          받은 편지
          {!myInfo ? (
            <LetterNum style={{ color: '#ADB5BD' }}>0개</LetterNum>
          ) : (
            <LetterNum
              style={{ color: receiveLetter === 0 ? '#ADB5BD' : 'inherit' }}
            >
              <>{String(receiveLetter)}개</>
            </LetterNum>
          )}
        </ReceivedLetter>
      </LetterContainer>
      <Button onClick={handleCreateBtn}>
        <ButtonTxt>편지 쓰러 가기</ButtonTxt>
      </Button>
      <TempLoginArea />
      <List>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="260"
          height="2"
          viewBox="0 0 260 2"
          fill="none"
        >
          <path d="M0 1L260 1.00002" stroke="#F1F3F5" />
        </svg>
        <AskContainer onClick={handleAsk}>
          <img
            src={ask}
            style={{ width: '16px', height: '16px', marginBottom: '1.2px' }}
          />
          문의하기
          <Navi>
            <img src={graynavi} style={{ width: '5px', height: '10px' }} />
          </Navi>
        </AskContainer>
      </List>
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;

  display: flex;

  flex-shrink: 0;
  flex-direction: column;

  align-items: center;

  width: 260px;
  height: calc(var(--vh, 1vh) * 100);
`;
const Cancel = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  cursor: pointer;
`;
const Profile = styled.div`
  position: relative;

  display: flex;

  flex-shrink: 0;

  gap: 8px;
  align-items: center;

  width: 100%;
  height: 52px;

  margin-top: 72px;
`;
const ImageContainer = styled.div`
  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 52px;
  height: 52px;

  margin-left: 16px;
`;
const ProfileImage = styled.img`
  width: 44px;
  height: 44px;

  border-radius: 120.93px;
`;

const UserSet = styled.div`
  display: flex;

  flex-direction: column;

  gap: 2px;
  align-items: flex-start;
  justify-content: center;
`;
const UserName = styled.div`
  width: 168px;

  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: #000;

  letter-spacing: -0.5px;
`;
const UserSetting = styled.div`
  display: flex;

  gap: 2px;
  align-items: center;

  font-family: SUIT;
  font-size: 11px;
  font-style: normal;
  font-weight: 400;

  line-height: 16px;

  color: #868e96;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const NavigateLogin = styled.div`
  display: flex;

  gap: 9px;
  align-items: center;
  justify-content: center;

  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: #000;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const LetterContainer = styled.div`
  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 228px;

  margin-top: 1rem;
  margin-bottom: 0.75rem;

  background: #f8f9fa;
  border-radius: 8px;
`;
const CreatedLetter = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 6px;
  align-items: center;
  align-self: stretch;
  justify-content: flex-start;

  height: 60px;

  padding: 19px 12px 21px 12px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #343a40;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const ReceivedLetter = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 6px;
  align-items: center;
  align-self: stretch;
  justify-content: flex-start;

  height: 60px;

  padding: 19px 12px 21px 12px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #343a40;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const LetterNum = styled.div`
  position: absolute;
  right: 32px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;

  line-height: 16px;

  color: #343a40;

  letter-spacing: -0.5px;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  width: 228px;
  height: 36px;

  padding: var(--Typography-size-s, 14px) 20px;
  margin-left: 16px;

  background: #ffa256;
  border-radius: 50px;
`;
const ButtonTxt = styled.div`
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  color: #fff;

  letter-spacing: -0.5px;
`;
const List = styled.div`
  position: absolute;
  bottom: 1.5rem;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 228px;
`;
const AskContainer = styled.div`
  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  align-self: stretch;
  justify-content: flex-start;

  width: 100%;

  padding: 16px 0px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #212529;

  letter-spacing: -0.5px;

  cursor: pointer;
`;
const Navi = styled.div`
  position: absolute;
  right: 0;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  padding: 3px 6px 3px 5px;
`;
