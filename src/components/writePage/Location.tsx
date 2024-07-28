import styled from "styled-components";

interface LocationProps {
  name: string;
  time: number;
}

export const Location: React.FC<LocationProps> = ({ name, time }) => {
  return (
    <div>{name} {time}</div>
  );
};