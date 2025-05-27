import React, { useState } from 'react';

import { useSuspenseQuery } from '@tanstack/react-query';
import styled from 'styled-components';

import bell from '@/assets/bell.svg';
import check from '@/assets/check.svg';
import prev from '@/assets/prev.svg';

import { userQuery } from '../../api/queries';
import { DeleteReason } from './DeleteReason';

interface Props {
  setViewDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AccountDelete = ({ setViewDelete }: Props) => {
  const { data: myInfo } = useSuspenseQuery(userQuery.myInfo());
  const [viewReason, setViewReason] = useState<boolean>(false);

  const handleDelete = () => {
    setViewDelete(false);
  };

  const handleReason = () => {
    setViewReason(true);
  };

  return (
    <BackGround>
      {viewReason === false && (
        <>
          <Header>
            <Prev src={prev} onClick={handleDelete} />
            <HeaderTxt>탈퇴하기</HeaderTxt>
          </Header>
          <Container>
            <Bell src={bell} />
            <Title>{myInfo.name}님,</Title>
            <Title>탈퇴하기시 전에 확인해 주세요</Title>
            <Contents>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: '16px', height: '16px' }} />
                </Check>
                탈퇴 시 해당 계정은 즉시 삭제되며, 복구할 수 없습니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: '16px', height: '16px' }} />
                </Check>
                참여한 편지는 내 편지함에서 삭제되지만, 다른 참여자의
                편지함에서는 내 기록이 유지됩니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: '16px', height: '16px' }} />
                </Check>
                받은 편지는 내 편지함에서 삭제되며, 누구도 다시 보관할 수
                없습니다.
              </TxtList>
              <TxtList>
                <Check>
                  <img src={check} style={{ width: '16px', height: '16px' }} />
                </Check>
                탈퇴 후에도 동일한 이메일로 재가입할 수 있습니다.
              </TxtList>
            </Contents>
          </Container>
          <ButtonContainer>
            <Button
              style={{
                background: '#CED4DA',
              }}
              onClick={handleDelete}
            >
              <ButtonTxt style={{ color: '#495057' }}>더 써볼게요</ButtonTxt>
            </Button>
            <Button
              style={{
                background: '#FFA256',
              }}
              onClick={handleReason}
            >
              <ButtonTxt style={{ color: '#fff' }}>확인했어요!</ButtonTxt>
            </Button>
          </ButtonContainer>
        </>
      )}
      {viewReason && <DeleteReason setViewReason={setViewReason} />}
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: #fff;

  transform: translateX(-50%);
`;
const Header = styled.div`
  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;

  padding: 0px var(--Border-Radius-radius_100, 4px);
`;
const Prev = styled.img`
  flex-shrink: 0;

  width: 8px;
  height: 16px;

  margin-right: 12px;
  margin-left: 16px;

  cursor: pointer;
`;
const HeaderTxt = styled.div`
  display: flex;

  flex: 1 0 0;

  gap: 16px;
  align-items: center;

  height: 24px;

  padding: 12px;

  font-family: SUIT;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;
`;
const Container = styled.div`
  box-sizing: border-box;
  display: flex;

  flex: 1 0 0;
  flex-direction: column;

  align-items: center;
  align-self: stretch;

  padding: 0px 16px 20px 16px;
  margin-top: 0.75rem;
`;
const Bell = styled.img`
  flex-shrink: 0;

  width: 32px;
  height: 36px;

  margin-top: 6px;
  margin-bottom: 14px;
`;
const Title = styled.div`
  align-self: stretch;

  font-family: SUIT;
  font-size: 18px;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #000;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Contents = styled.div`
  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  gap: 12px;
  align-items: flex-start;
  align-self: stretch;

  padding: 20px 0px;
  margin-top: 24px;

  background: #f8f9fa;
  border-radius: 16px;
`;
const TxtList = styled.div`
  display: flex;

  gap: 12px;
  align-items: flex-start;
  align-self: stretch;

  padding: 0px 16px;

  font-family: SUIT;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;

  line-height: 16px;

  color: #495057;

  letter-spacing: -0.5px;
`;
const Check = styled.div`
  display: flex;

  gap: 10px;
  align-items: flex-start;
  align-self: stretch;

  padding-top: 2px;
`;
const ButtonContainer = styled.div`
  position: relative;

  display: flex;

  gap: 8px;
  align-items: flex-start;
  align-items: center;
  align-self: stretch;
  justify-content: center;

  padding: 0px 16px 20px 16px;
`;
const Button = styled.button`
  box-sizing: border-box;
  display: flex;

  flex: 1 0 0;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 140px;
  height: 48px;

  padding: 14px 20px;

  border-radius: 50px;
  box-shadow:
    -1px -1px 0.4px 0px rgba(0, 0, 0, 0.14) inset,
    1px 1px 0.4px 0px rgba(255, 255, 255, 0.3) inset;
`;
const ButtonTxt = styled.div`
  font-family: var(--Typography-family-title, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 700;

  line-height: 20px;

  letter-spacing: -0.5px;
`;
