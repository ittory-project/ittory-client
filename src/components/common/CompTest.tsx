import styled from "styled-components";
import { Location } from "../writePage/Location";

export const CompTest = () => {
    return (
        <Contents>
            <Location name="카리나" />
        </Contents>
    );
}

const Contents = styled.div`
width: 100%;
height: 100%;
background-color: #000;
`;