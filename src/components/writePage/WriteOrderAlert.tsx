import styled from "styled-components";

interface WriteOrderAlertProps {
  text: string;
}

export const WriteOrderAlert: React.FC<WriteOrderAlertProps> = ({ text }) => {
  return (
    // 다음 차례는 '카리나' 님이에요
    <div>{text}</div>
  );
};