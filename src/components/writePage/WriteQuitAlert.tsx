import styled from "styled-components";

interface WriteQuitAlertProps {
  text: string;
}

export const WriteQuitAlert: React.FC<WriteQuitAlertProps> = ({ text }) => {
  return (
    // 퇴장깅
    <Container>
      {`'${text}'님이 퇴장하셨어요`}
    </Container>
  );
};

const Container = styled.div`
display: flex;
position: relative;
height: 36px;
padding: 8px 20px;
align-items: center;
gap: 2px;
border-radius: var(--Border-Radius-radius_100, 4px);
background: var(--Color-secondary-blue, #4DB4FF);
box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.60);
`;