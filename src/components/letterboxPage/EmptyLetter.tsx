import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import partiIcon from '@/assets/letterbox/parIcon.svg';
import recvIcon from '@/assets/letterbox/recIcon.svg';

interface Props {
  context: string;
}

export const EmptyLetter = ({ context }: Props) => {
  const navigate = useNavigate();

  const navigateToCreate = () => {
    navigate('/create');
  };

  return (
    <Container>
      {context === 'created' && (
        <>
          <Icon src={partiIcon} />
          <TextArea>참여한 편지가 없네요</TextArea>
          <TextArea>편지를 만들어서 마음을 전달해 보아요!</TextArea>
        </>
      )}
      {context === 'received' && (
        <>
          <Icon src={recvIcon} />
          <TextArea>받은 편지가 없네요</TextArea>
          <TextArea>먼저 마음을 전달해 보는 건 어떨까요?</TextArea>
        </>
      )}

      <Button onClick={navigateToCreate}>
        <ButtonTxt>편지 쓰러가기</ButtonTxt>
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: relative;

  box-sizing: border-box;
  display: flex;

  flex-direction: column;

  align-items: center;
  align-self: stretch;

  height: 100%;

  padding: 100px 36px 0px 36px;

  background: var(--Color-grayscale-gray100, #f1f3f5);
`;
const Icon = styled.img`
  position: relative;

  flex-shrink: 0;

  width: 100px;
  height: 100px;

  margin-bottom: 20px;
`;
const TextArea = styled.div`
  position: relative;

  display: flex;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: 14px;
  font-style: normal;
  font-weight: 500;

  line-height: 20px;

  color: #495057;

  text-align: center;
  letter-spacing: -0.5px;
`;
const Button = styled.button`
  position: relative;

  box-sizing: border-box;
  display: flex;

  gap: 8px;
  align-items: center;
  justify-content: center;

  width: 138px;
  height: 42px;

  padding: 14px 20px;
  margin-top: 20px;

  background: #343a40;
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
