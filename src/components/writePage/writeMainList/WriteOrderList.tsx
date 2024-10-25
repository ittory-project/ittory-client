import React, { useEffect, useRef } from 'react';
import { WriteOrderInactiveItem } from './WriteOrderInactiveItem';
import { WriteOrderActivateItem } from './WriteOrderActivateItem';
import styled from 'styled-components';
import { LetterItem } from '../../../api/config/state';

interface ListComponentProps {
  letterItems: LetterItem[]
  nowItemId?: number
  progressTime: number
}

// 편지 작성 페이지의 리스트
export const WriteOrderList: React.FC<ListComponentProps> = ({ letterItems, nowItemId, progressTime }) => {

  // 위치 버튼 누르면 해당 부분으로 이동되는 기능
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    movePosition();
  }, [nowItemId]);

  const movePosition = () => {
    if (nowItemId !== undefined) {
      const targetIndex = letterItems.findIndex(item => Number(item.elementId) === nowItemId);
      if (targetIndex !== -1 && itemRefs.current) {
        itemRefs.current[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  return (
    <Wrapper>
      <Line />
      <ListItem>
        {letterItems.map((item, index) => {
          return (
            <div key={item.elementId} ref={(el) => (itemRefs.current[index] = el)}>
              { item.content && item.imageUrl && item.nickname ? (
                <WriteOrderActivateItem
                  key={item.elementId}
                  profileImageUrl={item.imageUrl}
                  name={item.nickname}
                  title={item.content || ''}
                  time={progressTime}
                />
              ) : (
                <WriteOrderInactiveItem key={item.elementId} idx={Number(item.elementId)} />
              )}
            </div>
          );
        })}
      </ListItem>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Line = styled.div`
  border-left: 1px dashed #868e96;
  height: 100%;
  top: 0px;
  left: 30px;
  position: absolute;
  z-index: 1;
`;

const ListItem = styled.div`
  z-index: 2;
  position: relative;
`;