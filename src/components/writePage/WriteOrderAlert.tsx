import styled from 'styled-components';

interface WriteOrderAlertProps {
  name: string;
  isNextAlert: boolean;
}

export const WriteOrderAlert: React.FC<WriteOrderAlertProps> = ({
  name,
  isNextAlert,
}) => {
  return (
    // 다음 차례는 '카리나' 님이에요
    <Container>
      {isNextAlert
        ? `다음 차례는 '${name}' 님이에요`
        : `${name}님 편지를 적어주세요`}
      <img src="/assets/baton.svg" />
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  height: 33px;
  padding: 4px 15px;
  margin: 8px auto 0px;
  gap: 8px; /* Increased gap for better spacing */
  border-radius: var(--Border-Radius-radius_100, 5px);
  background: var(--Color-secondary-blue, #4db4ff);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
  width: auto; /* Ensure width adjusts based on content */
  white-space: nowrap; /* Prevent text from wrapping */

  color: var(--Color-secondary-dark_navy_blue, #060d24);
  text-align: center;

  /* caption/xsmall_bold */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
