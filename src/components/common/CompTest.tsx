import styled from "styled-components";
import { Location } from "../writePage/Location";
import { WriteQuitAlert } from "../writePage/WriteQuitAlert";
import { WriteOrderAlert } from "../writePage/WriteOrderAlert";
import { useEffect } from "react";
import { getLetterStartParti } from "../../api/service/LetterService";
import { LetterStartPartiGetResponse } from "../../api/model/LetterModel";
import { getJwt, getUserId } from "../../api/config/setToken";

export const CompTest = () => {

  // api 테스트 - 편지 시작 시 정보 조회
  const getPartiList = async () => {
    const response: LetterStartPartiGetResponse = await getLetterStartParti(1);
    console.log(response.participantCount)
    console.log(response.repeatCount)
    console.log(response.elementCount)
  }
  
  useEffect(() => {
    getPartiList()
    // JWT, 아이디 확인
    console.log(`유저 JWT: ${getJwt()}`)
    console.log(`유저 아이디: ${getUserId()}`)
  });

    return (
        <Contents>
            <Location name="카리나" />
            <AlertContainer>
                <WriteOrderAlert text="카리나" />
                <WriteQuitAlert text="" />
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
