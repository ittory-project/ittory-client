import styled from "styled-components";
import { Location } from "../writePage/Location";
import { WriteQuitAlert } from "../writePage/WriteQuitAlert";
import { WriteOrderAlert } from "../writePage/WriteOrderAlert";
import { useEffect } from "react";
import { getJwt, getUserId } from "../../api/config/setToken";
import { enterLetterWs, quitLetterWs, writeLetterWs } from "../../api/service/WsService";
import { getLetterStartInfo } from "../../api/service/LetterService";
import { LetterStartInfoGetResponse } from "../../api/model/LetterModel";

export const CompTest = () => {
  const letterNum = 6

  // api 테스트 - 편지 시작 시 정보 조회
  const getPartiList = async () => {
    const response: LetterStartInfoGetResponse = await getLetterStartInfo(letterNum);
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

  // 채팅 입장 테스트(소켓)
  const socketTest = () => {
    enterLetterWs(letterNum, "샤")
  }

  // 채팅 입장 테스트(소켓)
  const socketListTest = () => {
    writeLetterWs(letterNum)
  }

  // 채팅 입장 테스트(소켓)
  const socketQuitTest = () => {
    quitLetterWs(letterNum)
  }

  return (
    <Contents>
      <Location name="카리나" />
      <AlertContainer>
        <WriteOrderAlert text="카리나" />
        <WriteQuitAlert text="" />
        <button onClick={socketTest}>소켓테스트</button>
        <button onClick={socketListTest}>작성 목록 테스트</button>
        <button onClick={socketQuitTest}>퇴장 테스트</button>
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
