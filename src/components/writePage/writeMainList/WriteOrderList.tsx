import React from 'react';
import { WriteOrderInactiveItem } from './WriteOrderInactiveItem';
import { WriteOrderActivateItem } from './WriteOrderActivateItem';
import styled from 'styled-components';
import { WriteOrderItem } from '../Write';

interface ListComponentProps {
  items: WriteOrderItem[];
}

// 편지 작성 페이지의 리스트
export const WriteOrderList: React.FC<ListComponentProps> = ({ items }) => {
  return (
    <Wrapper>
      <Line />
      <ListItem>
      {items.map((item) => {
        switch (item.status) {
          case 'inactive':
            return <WriteOrderInactiveItem key={item.id} idx={item.id} />;
          case 'completed':
            return (
              <WriteOrderActivateItem
                key={item.id}
                status={item.status}
                profileImageUrl={item.profileImageUrl}
                name={item.name}
                title={item.title || ''}
              />
            );
          case 'myTurn':
            return (
              <WriteOrderActivateItem
                key={item.id}
                status={item.status}
                profileImageUrl={item.profileImageUrl}
                name={item.name}
                time={item.time || 0}
              />
            );
          case 'othersTurn':
            return (
              <WriteOrderActivateItem
                key={item.id}
                status={item.status}
                profileImageUrl={item.profileImageUrl}
                name={item.name}
                time={item.time || 0}
              />
            );
          default:
            return null;
        }
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
  height: 90%;
  top: 10px;
  left: 30px;
  position: absolute;
  z-index: 1;
`;

const ListItem = styled.div`
  z-index: 2;
  position: relative;
`;