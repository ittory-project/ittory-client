import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { letterQuery } from '../../../api/queries';

interface WriteModalProps {
  repeatCount: number;
  elementCount: number;
  startCountdown: number;
}

export const WriteMainModal: React.FC<WriteModalProps> = ({
  repeatCount,
  elementCount,
  startCountdown,
}) => {
  const { letterId } = useParams();
  const letterNumId = Number(letterId);
  const { data: writeOrderList } = useSuspenseQuery(
    letterQuery.participantsByIdInSequenceOrder(letterNumId),
  );

  return (
    <Overlay>
      <Popup>
        <PopupTitle>
          {String(writeOrderList.participants.length)}명의 참여자가
          <br />
          <span style={{ color: '#FFA256' }}>
            {String(repeatCount)}번씩
          </span>{' '}
          이어 쓸 거예요!
        </PopupTitle>
        <PopupTitleDetail>
          총 {String(elementCount)}개의 그림이 생성돼요
        </PopupTitleDetail>
        <PopupList>
          {writeOrderList && writeOrderList.participants.length > 1 ? (
            <PopupListTitle>작성 순서</PopupListTitle>
          ) : (
            <div style={{ padding: '3px' }}></div>
          )}
          {writeOrderList ? (
            <List>
              {writeOrderList.participants.length > 1 && (
                <Line $itemnum={Number(writeOrderList.participants.length)} />
              )}
              {writeOrderList.participants
                .slice()
                .sort((a, b) => a.sequence - b.sequence) // sequence대로 정렬
                .map((participant) => (
                  <ListItem key={participant.sequence}>
                    {writeOrderList.participants.length > 1 && (
                      <ListNumber>{participant.sequence}</ListNumber>
                    )}
                    <Avatar
                      src={
                        participant.imageUrl ||
                        '/assets/common/profile_bunny.svg'
                      }
                      alt={participant.nickname}
                    />
                    <Name>{participant.nickname}</Name>
                  </ListItem>
                ))}
            </List>
          ) : (
            <PopupTitleDetail>유저가 존재하지 않습니다.</PopupTitleDetail>
          )}
        </PopupList>
        <ClockText>
          <ClockIcon src="/assets/write/clock_gray.svg" />
          {Math.floor(Number(startCountdown))}초 후 편지 시작
        </ClockText>
      </Popup>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  background-color: rgba(0, 0, 0, 0.5);
`;

const Popup = styled.div`
  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;
  justify-content: center;

  width: 70%;

  padding: 32px 15px 24px 15px;
  margin: auto;

  background: linear-gradient(144deg, #fff -0.87%, #c3f1ff 109.18%);
  border-radius: var(--Border-Radius-radius_500, 16px);
  box-shadow:
    0px 4px 0px 0px rgba(195, 241, 255, 0.8) inset,
    0px -4px 0px 0px rgba(0, 0, 0, 0.1) inset;
`;

const PopupTitle = styled.div`
  align-self: stretch;
  /* title/medium_bold */
  font-family: var(--Typography-family-title, SUIT);
  font-size: var(--Typography-size-m, 18px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-s, 24px); /* 133.333% */

  color: var(--Color-grayscale-gray900, #212529);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupTitleDetail = styled.div`
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 14px);
  font-style: normal;
  font-weight: 500;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-grayscale-gray600, #868e96);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const PopupList = styled.div`
  display: flex;

  flex-direction: column;

  gap: 16px;
  align-items: center;

  width: 60%;
  max-height: 50vh;

  padding: 0px var(--Typography-line_height-l, 40px) 16px
    var(--Typography-line_height-l, 40px);
  margin: 0 auto;

  background: var(--color-black-white-white, #fff);
  border: 3px solid var(--Color-secondary-soft_blue, #d3edff);
  border-radius: var(--Border-Radius-radius_400, 12px);
`;

const PopupListTitle = styled.div`
  display: flex;

  gap: 10px;
  align-items: center;
  justify-content: center;

  width: 106px;

  padding: var(--Border-Radius-radius_100, 4px) 20px;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 12px);
  font-style: normal;
  font-weight: 500;

  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */

  color: var(--Color-secondary-blue, #4db4ff);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-secondary-soft_blue, #d3edff);
  border-radius: 0px 0px 12px 12px;
  box-shadow: 0px -2px 0px 0px rgba(0, 0, 0, 0.04) inset;
`;

const List = styled.ul`
  position: relative;
  z-index: 2;

  width: 100%;

  padding: 0;
  margin: 0;

  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ListItem = styled.li`
  z-index: 2;

  display: flex;

  align-items: center;

  padding: 0px 20px 12px 0px;
`;

const ListNumber = styled.div`
  gap: 10px;
  align-items: center;
  justify-content: center;

  width: var(--Typography-size-m, 18px);
  height: var(--Typography-size-m, 18px);

  padding: 4px var(--Border-Radius-radius_100, 4px);

  font-family: var(--Typography-family-number, 'Gmarket Sans');
  font-size: 12px;
  font-style: bold;

  line-height: var(--Typography-line_height-2xs, 16px); /* 160% */

  color: var(--color-black-white-white, #fff);
  color: var(--color-black-white-white, #fff);

  text-align: center;
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: var(--Color-secondary-blue, #4db4ff);
  border-radius: var(--Border-Radius-radius_circle, 50px);
`;

const Avatar = styled.img`
  width: 36px;
  height: 36px;

  margin: 0 6px 0 20px;

  border-radius: 50%;
`;

const Name = styled.span`
  width: 40px;

  overflow: hidden;
  text-overflow: ellipsis;

  font-family: SUIT;
  font-size: 18px;

  color: #333;

  white-space: nowrap;
`;

const Line = styled.div<{ $itemnum: number }>`
  position: absolute;
  top: 18px;
  left: 12px;
  z-index: 1;

  height: ${({ $itemnum }) => `calc(${$itemnum} * 48px - 35px)`};

  border-left: 1.5px dashed rgba(111, 176, 255, 0.5);
`;

const ClockIcon = styled.img`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 12px;
  height: 13px;

  margin: 1px 5px 0px 0px;
`;

const ClockText = styled.div`
  display: flex;

  margin: 16px 0px 0px 0px;

  /* caption/xsmall_bold */
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 0.75rem);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-2xs, 1rem); /* 133.333% */

  color: var(--Color-secondary-soft_navy_blue, #99adc9);

  letter-spacing: var(--Typography-letter_spacing-default, -0.03125rem);
`;
