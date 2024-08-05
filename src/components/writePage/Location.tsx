import styled from "styled-components";
import img from "../../../public/assets/location.png"

interface LocationProps {
  name: string;
  time: number;
}

export const Location: React.FC<LocationProps> = ({ name, time }) => {
  return (
    <Background>
      <Contents>
      {name} {time}
      </Contents>
    </Background>
  );
};

const Background = styled.div`
  width: 66px;
  height: 82px;
  display: flex;
  justify-content: center;
  background-image: url(${img});
  background-size: cover;
`;

const Contents = styled.div`
  background-color: #000;
`;