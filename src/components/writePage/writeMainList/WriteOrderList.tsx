import styled from 'styled-components';

import { ElementResponse } from '../../../api/model/ElementModel';
import { WriteOrderActivateItem } from './WriteOrderActivateItem';
import { WriteOrderFinalItem } from './WriteOrderFinalItem';
import { WriteOrderInactiveItem } from './WriteOrderInactiveItem';
import { WriteOrderNowItem } from './WriteOrderNowItem';

interface ListComponentProps {
  elements: ElementResponse[];
  isMyTurnToWrite: boolean;
  nowItemRef: React.MutableRefObject<HTMLDivElement | null>;
}

// 편지 작성 페이지의 리스트
export const WriteOrderList = ({
  elements,
  isMyTurnToWrite,
  nowItemRef,
}: ListComponentProps) => {
  return (
    <Wrapper>
      <Line />
      <ListItem>
        {elements.map((item, index) => {
          const isNowItem = item.startedAt !== null && item.content === null;
          return (
            <div key={item.elementId} ref={isNowItem ? nowItemRef : undefined}>
              {item.content && item.nickname && (
                <WriteOrderActivateItem
                  key={item.elementId}
                  letterImageUrl={item.imageUrl}
                  name={item.nickname}
                  content={item.content}
                  itemId={index + 1}
                />
              )}
              {item.content === null && item.startedAt !== null && (
                <WriteOrderNowItem
                  key={item.elementId}
                  isMyTurnToWrite={isMyTurnToWrite}
                  element={item}
                />
              )}
              {item.content === null && item.startedAt === null && (
                <WriteOrderInactiveItem key={item.elementId} idx={index + 1} />
              )}
            </div>
          );
        })}
        <WriteOrderFinalItem />
      </ListItem>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;

const Line = styled.div`
  position: absolute;
  top: 0px;
  left: 30px;
  z-index: 1;

  height: 100%;

  border-left: 1px dashed #868e96;
`;

const ListItem = styled.div`
  position: relative;
  z-index: 2;
`;
