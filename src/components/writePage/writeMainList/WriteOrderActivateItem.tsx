import styled from "styled-components";

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
    event.currentTarget.src = "/assets/write/img_error.svg";
  };

  return (
    <Wrapper>
      <ProfileImage src={"" + letterImageUrl} onError={handleImageError} />
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
  margin: 20px 0;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid white;
  margin-right: 10px;
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
  width: 16px;
  height: 16px;
  padding: 1.6px 1.6px;
  margin: 0px 3px 0px 0px;
  justify-content: center;
  align-items: center;
  gap: var(--Border-Radius-radius_300, 8px);
  border-radius: 40px;
  background: var(--Color-grayscale-gray800, #343a40);
`;
