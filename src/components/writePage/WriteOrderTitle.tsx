import styled from "styled-components";

interface TitleProps {
  title: string;
}

export const WriteOrderTitle: React.FC<TitleProps> = ({ title }) => {
  return (
    <div>{title}</div>
  );
};