import React from 'react';

import styled from 'styled-components';

import finalFlag from '@/assets/write/final_flag.svg';

export const WriteOrderFinalItem: React.FC = () => {
  return (
    <Wrapper>
      <Icon src={finalFlag} alt="hi" />
      <Content>FINISH!</Content>
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
  font-family: var(--Typography-family-body, SUIT);
  font-size: var(--Typography-size-s, 18px);
  font-style: normal;
  font-weight: 400;

  line-height: var(--Typography-line_height-xs, 20px); /* 142.857% */

  color: var(--Color-primary-orange, #ffa256);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;
