import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export const WriteElement: React.FC = () => {
  const [time, setTime] = useState(100);
  const [text, setText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);  

  const taRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (taRef.current) {
      taRef.current.focus();
    }
  }, []);

  return (
    <Container>
      <Content>
        <Header>
        <ClockText>
          <ClockIcon src="/assets/write/clock.svg" />
          {time}초
        </ClockText>
          <CloseBtn src='/assets/btn_close.svg' />
        </Header>
        <WriteContent>
          <PhotoDiv>
            <ProfileImage src={'/img/profile.png'} alt="Profile" />
          </PhotoDiv>
          <WriteTa 
            ref={taRef}
            placeholder="그림을 보고 편지를 채워 주세요"             
            value={text} 
            onChange={e => setText(e.target.value)} ></WriteTa>
          <ControlContainer>
            {text.length > 0 ? (
              <>
                <CharacterCount>
                  <div style={{ color: text.length > 30 ? '#FF0004' : 'black' }}>{text.length}</div>/30자
                </CharacterCount>
              </>

            ) : 
            <><CharacterCount></CharacterCount></>
            }
            <CompleteBtn isDisabled={text.length === 0 || text.length > 30}>완료</CompleteBtn>
          </ControlContainer>
        </WriteContent>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  width: 100%;
  padding: 10px 0;
  background-color: #212529;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  width: 95%;
  flex-direction: column;
  align-items: flex-start;
  flex-shrink: 0;
  border-radius: 20px;
  background: var(--color-black-white-white, #FFF);
`;

const Header = styled.div`
  display: flex;
  height: 44px;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  margin: 10px 20px 5px 20px;
  justify-content: space-between;
`;

const CloseBtn = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const ClockIcon = styled.img`
  display: flex;
  width: 20px;
  height: 20px;
  margin: 0px 5px;
  justify-content: center;
  align-items: center;
`;

const ClockText = styled.div`
  display: flex;
  color: var(--Color-primary-orange, #FFA256);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const WriteContent = styled.div`
  display: flex;
  height: 270px;
  margin: 5px 20px 20px 20px;
  padding: 16px;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: var(--Border-Radius-radius_300, 8px);
  border: 1px dashed var(--Color-grayscale-gray400, #CED4DA);
  background: var(--Color-grayscale-gray50, #F8F9FA);
`;

const CompleteBtn = styled.div<{ isDisabled: boolean }>`
  display: flex;
  padding: 4px 12px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: ${({ isDisabled }) => (isDisabled ? '#d3d3d3' : '#000')}; 
  color: #FFF;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')}; 
`;

const PhotoDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const ProfileImage = styled.img`
  width: 164px;
  height: 164px;
  border-radius: 20px;
  object-fit: cover;
`;

const WriteTa = styled.textarea`
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  align-self: stretch;
  border: none;
  background: var(--Color-grayscale-gray50, #F8F9FA);
  overflow: hidden;
  
  &:focus {
    outline: none;
  }

  &::placeholder {
    color: #6c757d;
  }
`;

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-top: 10px;
`;

const CharacterCount = styled.div`
  display: flex;
  font-size: 14px;
`;