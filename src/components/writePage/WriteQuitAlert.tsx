import styled from 'styled-components';

interface WriteOrderAlertProps {
  name: string;
}

export const WriteQuitAlert: React.FC<WriteOrderAlertProps> = ({ name }) => {
  return <Container>{`${name}님이 퇴장했습니다.`}</Container>;
};

const Container = styled.div`
  display: inline-flex; /* Changed from flex to inline-flex */

  gap: 8px; /* Increased gap for better spacing */
  align-items: center;

  width: auto; /* Ensure width adjusts based on content */
  height: 33px;

  padding: 4px 15px;
  margin: 8px auto 0px;

  /* caption/xsmall_bold */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */

  color: var(--Color-secondary-dark_navy_blue, #060d24);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
  white-space: nowrap; /* Prevent text from wrapping */

  background: var(--Color-secondary-blue, #4db4ff);
  border-radius: var(--Border-Radius-radius_100, 5px);
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.6);
`;
