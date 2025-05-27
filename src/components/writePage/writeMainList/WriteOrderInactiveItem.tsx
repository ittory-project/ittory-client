import React from 'react';

import styled from 'styled-components';

interface InactiveItemProps {
  idx: number;
}

// 아직 차례가 아닌 리스트 내용 아이템
export const WriteOrderInactiveItem: React.FC<InactiveItemProps> = ({
  idx,
}) => {
  return (
    <Wrapper>
      <Icon src="@/assets/order-lock.png" alt="hi" />
      <Content>{idx}번째 내용</Content>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;

  align-items: center;

  padding: 10px;
  margin: 20px 0;
`;

const Icon = styled.img`
  display: flex;

  align-items: center;
  justify-content: center;

  width: 40px;
  height: 40px;

  margin-right: 10px;

  background-color: #ddd;
  border-radius: 50%;
`;

const Content = styled.div`
  font-size: 18px;

  color: #868e96;
`;
