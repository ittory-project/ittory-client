import React from 'react';
import styled from 'styled-components';

interface InactiveItemProps {
  idx: number;
}

// 아직 차례가 아닌 리스트 내용 아이템
export const WriteOrderInactiveItem: React.FC<InactiveItemProps> = ({ idx }) => {
  return (
    <Wrapper>
      <Icon src='/img/order-lock.png' alt='hi' />
      <Content>{idx}번째 내용</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  padding: 10px;
`;

const Icon = styled.img`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ddd;
  border-radius: 50%;
  margin-right: 10px;
`;

const Content = styled.div`
  font-size: 16px;
  color: #868e96;
`;