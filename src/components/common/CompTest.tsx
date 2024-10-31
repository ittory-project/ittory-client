import styled from "styled-components";
import { WriteQuitAlert } from "../writePage/WriteQuitAlert";
import { WriteOrderAlert } from "../writePage/WriteOrderAlert";
import { useEffect } from "react";
import { getJwt, getUserId } from "../../api/config/setToken";
import { enterLetterWs, quitLetterWs, writeLetterWs } from "../../api/service/WsService";
import { getLetterStartInfo } from "../../api/service/LetterService";
import { LetterStartInfoGetResponse } from "../../api/model/LetterModel";
import { useDispatch, useSelector } from 'react-redux';
import { addData, clearData, selectData } from "../../api/config/state";
import { LetterItem } from "../../api/model/WsModel";

export const CompTest = () => {
  const letterNum = 9

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

  // 채팅 내용 테스트(소켓)
  const socketListTest = () => {
    writeLetterWs(letterNum, 1, "test")
  }

  // 채팅 퇴장 테스트(소켓)
  const socketQuitTest = () => {
    quitLetterWs(letterNum)
  }

  // redux 세팅 - 실시간 편지 저장
  const dispatch = useDispatch();
  const data = useSelector(selectData);

  const handleAddData = () => {
    // 받은 response의 예시
    const newItem: LetterItem = {
      elementId: '1',
      imageUrl: 'https://example.com/image.jpg',
      content: 'New Content',
      nickname: 'JohnDoe',
      elementSequence: 1,
      writeSequence: 1,
    };
    dispatch(addData(newItem)); 
  };

  const handleClearData = () => {
    dispatch(clearData());
  };

  return (
    <Contents>
      <AlertContainer>
        <WriteOrderAlert text="카리나" />
        <WriteQuitAlert text="" />
        <button onClick={socketTest}>소켓테스트</button>
        <button onClick={socketListTest}>작성 목록 테스트</button>
        <button onClick={socketQuitTest}>퇴장 테스트</button>
        <button onClick={handleAddData}>Add Data</button>
        <button onClick={handleClearData}>Clear Data</button>
        <div>
          <h3>Stored Data:</h3>
          <ul>
            {data.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
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
