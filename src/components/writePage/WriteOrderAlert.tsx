import styled from "styled-components";

interface WriteOrderAlertProps {
  text: string;
}

export const WriteOrderAlert: React.FC<WriteOrderAlertProps> = ({ text }) => {
  return (
    // 다음 차례는 '카리나' 님이에요
    <Container>
      {`${text}`}
      <img src="/assets/baton.svg" />
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex; /* Changed from flex to inline-flex */
  align-items: center;
  height: 36px;
  padding: 8px 20px;
  margin: 10px auto;
  gap: 8px; /* Increased gap for better spacing */
  border-radius: var(--Border-Radius-radius_100, 4px);
  background: var(--Color-secondary-blue, #4DB4FF);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.60);
  width: auto; /* Ensure width adjusts based on content */
  white-space: nowrap; /* Prevent text from wrapping */
`;