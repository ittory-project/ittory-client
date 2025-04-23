import { useEffect, useState } from 'react';

import styled from 'styled-components';

import { SessionLogger } from '../../utils/SessionLogger';
import CoverDeco from './CoverDeco/CoverStyle';
import LetterInfo from './EnterInfo/LetterInfo';
import FinalInfo from './FinalLetter/FinalInfo';
import { Loading } from './Loading';

const logger = new SessionLogger('create');

export const Create = () => {
  const [viewStartpage, setViewStartpage] = useState<boolean>(true);
  const [viewCoverDeco, setViewCoverDeco] = useState<boolean>(false);
  const [viewFinalInfo, setViewFinalInfo] = useState<boolean>(false);
  const [receiverName, setReceiverName] = useState<string>('');
  const [myName, setMyName] = useState<string>('');
  const [deliverDay, setDeliverDay] = useState<Date | null | string>(null);
  const [title, setTitle] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [backgroundimage, setBackgroundimage] = useState<number>(0);
  const [selectfont, setSelectfont] = useState<string>('');
  const [selectFid, setSelectFid] = useState<number>(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [load, setLoad] = useState<boolean>(true);

  logger.debug('선택된 폰트:', selectFid, selectfont);

  useEffect(() => {
    if (localStorage.getItem('title')) {
      setViewStartpage(false);
      setViewCoverDeco(false);
      setViewFinalInfo(true);
      setLoad(false);
      setTitle(String(localStorage.getItem('title')));
      setSelectfont(String(localStorage.getItem('font')));
      setBackgroundimage(Number(localStorage.getItem('bgImg')));
      setSelectedImageIndex(Number(localStorage.getItem('bgImg')));
      setCroppedImage(String(localStorage.getItem('image')));
      setMyName(String(localStorage.getItem('myName')));
      setReceiverName(String(localStorage.getItem('receiver')));
      setDeliverDay(localStorage.getItem('Date'));
    } else if (localStorage.getItem('receiver')) {
      setViewStartpage(false);
      setViewCoverDeco(true);
      setMyName(String(localStorage.getItem('myName')));
      setReceiverName(String(localStorage.getItem('receiver')));
      setDeliverDay(localStorage.getItem('Date'));
      setLoad(false);
    } else {
      setViewStartpage(true);
      setViewCoverDeco(false);
      setViewFinalInfo(false);
      setLoad(false);
    }
  }, []);

  return (
    <BackGround>
      {load ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  position: relative;
  left: 50%;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: calc(var(--vh, 1vh) * 100);

  background: linear-gradient(
    180deg,
    #d3edff 0%,
    #e7f6f7 46.2%,
    #feffee 97.27%
  );

  background-blend-mode: overlay, normal;

  transform: translateX(-50%);
`;
