import styled from 'styled-components';

import imgError from '@/assets/write/img_error.svg';

interface WriteOrderProps {
  letterImageUrl: string | undefined;
  name: string;
  content: string;
  itemId: number;
}

// 지나간 순서(completed) 상태 아이템
export const WriteOrderActivateItem: React.FC<WriteOrderProps> = ({
  letterImageUrl,
  name,
  content,
  itemId,
}) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    event.currentTarget.src = imgError;
  };

  return (
    <Wrapper>
      <ProfileImage src={'' + letterImageUrl} onError={handleImageError} />
      <ContentWrapper>
        <MainText>{content}</MainText>
        <SubText>
          <LetterNum>{itemId}</LetterNum>
          {name}
        </SubText>
      </ContentWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;

  align-items: center;

  padding: 10px;
  margin: 20px 0;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;

  margin-right: 10px;

  border: 1px solid white;
  border-radius: 5px;
`;

const ContentWrapper = styled.div`
  display: flex;

  flex-direction: column;
`;

const MainText = styled.div`
  font-size: 18px;

  color: #ffffff;
`;

const SubText = styled.div`
  display: flex;

  font-size: 14px;

  color: #868e96;
`;

const LetterNum = styled.div`
  display: flex;

  gap: var(--Border-Radius-radius_300, 8px);
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  padding: 1.6px 1.6px;
  margin: 0px 3px 0px 0px;

  background: var(--Color-grayscale-gray800, #343a40);
  border-radius: 40px;
`;
