import LetterInfo from "./EnterInfo/LetterInfo";
import { useState } from "react";
import styled from "styled-components";
import CoverDeco from "./CoverDeco/CoverStyle";
import FinalInfo from "./FinalLetter/FinalInfo";

export const Create = () => {
  const [viewStartpage, setViewStartpage] = useState<boolean>(true);
  const [viewCoverDeco, setViewCoverDeco] = useState<boolean>(false);
  const [viewFinalInfo, setViewFinalInfo] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>("");
  const [myName, setMyName] = useState<string>("");
  const [deliverDay, setDeliverDay] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");
  const [backgroundimage, setBackgroundimage] = useState<number>(0);
  const [selectfont, setSelectfont] = useState<string>("");
  const [selectFid, setSelectFid] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  console.log(selectFid);

  return (
    <BackGround>
      {viewStartpage && (
        <LetterInfo
          myName={myName}
          receiverName={receiverName}
          deliverDay={deliverDay}
          setReceiverName={setReceiverName}
          setMyName={setMyName}
          setDeliverDay={setDeliverDay}
          setViewCoverDeco={setViewCoverDeco}
          setViewStartpage={setViewStartpage}
        />
      )}
      {viewCoverDeco && (
        <CoverDeco
          setViewFinalInfo={setViewFinalInfo}
          setViewCoverDeco={setViewCoverDeco}
          setViewStartpage={setViewStartpage}
          title={title}
          setTitle={setTitle}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
          setSelectfont={setSelectfont}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          setBackgroundimage={setBackgroundimage}
          setSelectFid={setSelectFid}
        />
      )}
      {viewFinalInfo && (
        <FinalInfo
          myName={myName}
          receiverName={receiverName}
          deliverDay={deliverDay}
          setReceiverName={setReceiverName}
          setMyName={setMyName}
          setDeliverDay={setDeliverDay}
          title={title}
          setTitle={setTitle}
          croppedImage={croppedImage}
          setCroppedImage={setCroppedImage}
          backgroundimage={backgroundimage}
          setBackgroundimage={setBackgroundimage}
          selectfont={selectfont}
          setSelectfont={setSelectfont}
          selectedImageIndex={selectedImageIndex}
          setSelectedImageIndex={setSelectedImageIndex}
          setSelectFid={setSelectFid}
          selectFid={selectFid}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(var(--vh, 1vh) * 100);
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );
  background-blend-mode: overlay, normal;
`;
