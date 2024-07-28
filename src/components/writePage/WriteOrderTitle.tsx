import styled from "styled-components";

interface TitleProps {
  title: string;
}

export const WriteOrderTitle: React.FC<TitleProps> = ({ title }) => {
  return (
    // 편지 제목
    // 선재야 생일 축하해 + 순서 버튼
    <div>{title}</div>
  );
};