import styled from "styled-components";
import { Location } from "../writePage/Location";
import { WriteQuitAlert } from "../writePage/WriteQuitAlert";
import { WriteOrderAlert } from "../writePage/WriteOrderAlert";

export const CompTest = () => {
    return (
        <Contents>
            <Location name="카리나" />
            <AlertContainer>
                <WriteOrderAlert text="카리나" />
                <WriteQuitAlert text="카리나" />
                <WriteOrderAlert text="카리나" />
            </AlertContainer>
        </Contents>
    );
}

const Contents = styled.div`
  width: 100%;
  height: 800px;
  background-color: #000;
  position: relative;
  display: flex;
  justify-content: center;
`;

const AlertContainer = styled.div`
  position: absolute;
  top: 84px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;
