import styled from "styled-components";
import { WriteQuitAlert } from "../writePage/WriteQuitAlert";
import { WriteOrderAlert } from "../writePage/WriteOrderAlert";
import { enterLetterWs, quitLetterWs, writeLetterWs } from "../../api/service/WsService";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { LetterPartiItem } from "../../api/model/LetterModel";
import { AppDispatch, clearOrderData, selectParsedOrderData, setOrderData } from "../../api/config/state";

export const CompTest = () => {
  const letterNum = 9

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

  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectParsedOrderData);
  const [order, setOrder] = useState<LetterPartiItem[]>(data);

  const setOrderList = () => {
    const testItem = [
      { sequence: 1, memberId: 1, nickname: "string", imageUrl: "h" },
      { sequence: 2, memberId: 1, nickname: "strddding", imageUrl: "323h" }
    ]
    dispatch(setOrderData(testItem));
  }

  return (
    <Contents>
      <AlertContainer>
        <WriteOrderAlert text="카리나" />
        <WriteQuitAlert text="" />
        <button onClick={socketTest}>소켓테스트</button>
        <button onClick={socketListTest}>작성 목록 테스트</button>
        <button onClick={socketQuitTest}>퇴장 테스트</button>
        <div>
          <h3 onClick={setOrderList}>Stored Data:</h3>
          {order.map((item) => (
            <div key={item.sequence}>
              <p>{`${item.sequence} / ${item.memberId} / ${item.nickname} / ${item.imageUrl}`}</p>
            </div>
          ))}
          <button onClick={() => dispatch(clearOrderData())}>Clear Order Data</button>
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
