import { useState } from 'react';

import styled from 'styled-components';

import orderBtn from '@/assets/write/order_btn.svg';
import orderBtnClick from '@/assets/write/order_btn_click.svg';
import writeLetterOrder from '@/assets/write_letter_order.png';

import { LetterPartiItem } from '../../api/model/LetterModel';
import { WriteOrderPopover } from './WriteOrderPopover';

interface TitleProps {
  writeOrderList: LetterPartiItem[];
  title: string;
}

export const WriteOrderTitle: React.FC<TitleProps> = ({
  writeOrderList,
  title,
}) => {
  const [isPopover, setIsPopover] = useState(false);

  const closePopover = () => {
    setIsPopover(false);
  };

  const handleOrderBtn = () => {
    setIsPopover(!isPopover);
  };

  return (
    <div>
      <OuterContainer>
        <InnerContainer>
          <LeftContent>
            <Img src={writeLetterOrder} />
            {title}
          </LeftContent>
          <OrderBtn
            src={isPopover ? orderBtnClick : orderBtn}
            onClick={handleOrderBtn}
          />
        </InnerContainer>
      </OuterContainer>
      {isPopover && (
        <WriteOrderPopover
          writeOrderList={writeOrderList}
          onClose={closePopover}
        />
      )}
    </div>
  );
};

export default WriteOrderTitle;

const OuterContainer = styled.div`
  display: flex;

  gap: 12px;
  align-items: center;
  align-self: stretch;

  height: 46px;

  padding: 2px;

  background: linear-gradient(to right, #fff, #4db4ff);
  border-radius: 8px;
`;

const InnerContainer = styled.div`
  display: flex;

  align-items: center;
  justify-content: space-between;

  width: 100%;
  height: 100%;

  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 15px);
  font-style: normal;
  font-weight: 700;

  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */

  color: var(--Color-secondary-dark_navy_blue, #060d24);

  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);

  background: #d3edff;
  border-radius: 8px;
`;

const LeftContent = styled.div`
  display: flex;

  align-items: center;
`;

const Img = styled.img`
  flex-shrink: 0;

  width: 22px;
  height: var(--Typography-size-s, 16px);

  margin: 0px 10px 0px 20px;
`;

const OrderBtn = styled.img`
  margin: 0px 10px 0px auto;
`;
