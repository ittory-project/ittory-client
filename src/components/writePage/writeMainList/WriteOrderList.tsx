import React, { useEffect, useRef } from 'react';
import { WriteOrderInactiveItem } from './WriteOrderInactiveItem';
import { WriteOrderActivateItem } from './WriteOrderActivateItem';
import styled from 'styled-components';
import { WriteOrderItem } from '../Write';

interface ListComponentProps {
  items: WriteOrderItem[];
  nowItemId?: number
}

// 편지 작성 페이지의 리스트
export const WriteOrderList: React.FC<ListComponentProps> = ({ items, nowItemId }) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    movePosition();
  }, [nowItemId]);

  const movePosition = () => {
    if (nowItemId !== undefined) {
      const targetIndex = items.findIndex(item => item.id === nowItemId);
      if (targetIndex !== -1 && itemRefs.current) {
        console.log(itemRefs.current[targetIndex])
        itemRefs.current[targetIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  return (
    <Wrapper>
      <Line />
      <ListItem>
        {items.map((item, index) => {
          return (
            <div key={item.id} ref={(el) => (itemRefs.current[index] = el)}>
              {item.status === 'inactive' ? (
                <WriteOrderInactiveItem key={item.id} idx={item.id} />
              ) : (
                <WriteOrderActivateItem
                  key={item.id}
                  status={item.status}
                  profileImageUrl={item.profileImageUrl}
                  name={item.name}
                  title={item.title || ''}
                  time={item.time || 0}
                />
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