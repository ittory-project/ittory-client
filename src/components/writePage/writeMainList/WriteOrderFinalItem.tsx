import React from 'react';
import styled from 'styled-components';

export const WriteOrderFinalItem: React.FC = () => {
  return (
    <Wrapper>
      <Icon src="/assets/write/final_flag.svg" alt="hi" />
      <Content>FINISH!</Content>
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
  color: var(--Color-primary-orange, #ffa256);
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
