import { useState } from "react";
import styled from "styled-components";
import { WriteOrderPopover } from "./WriteOrderPopover";

interface TitleProps {
  title: string;
}

export const WriteOrderTitle: React.FC<TitleProps> = ({ title }) => {
  const [isPopover, setIsPopover] = useState(false);

  const closePopover = () => {
    setIsPopover(false);
  }

  const handleOrderBtn = () => {
    setIsPopover(!isPopover);
  }

  return (
    <div>
      <OuterContainer>
        <InnerContainer>
          <LeftContent>
            <Img src="/img/write_letter_order.png" />
            {title}
          </LeftContent>
          <OrderBtn onClick={handleOrderBtn}>
            <img src="/assets/order_btn.svg" />
            순서
          </OrderBtn>
        </InnerContainer>
      </OuterContainer>
      {isPopover && <WriteOrderPopover onClose={closePopover} />}
    </div>
  );
};

export default WriteOrderTitle;

const OuterContainer = styled.div`
  display: flex;
  height: 46px;
  padding: 2px;
  align-items: center;
  gap: 12px;
  align-self: stretch;
  border-radius: 8px;
  background: linear-gradient(to right, #FFF, #4DB4FF);
`;

const InnerContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background: #D3EDFF;
  color: var(--Color-secondary-dark_navy_blue, #060D24);
  font-family: var(--Typography-family-caption, SUIT);
  font-size: var(--Typography-size-xs, 15px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--Typography-line_height-2xs, 16px); /* 133.333% */
  letter-spacing: var(--Typography-letter_spacing-default, -0.5px);
`;

const LeftContent = styled.div`
  display: flex;
  align-items: center;
`;

const Img = styled.img`
  width: 22px;
  height: var(--Typography-size-s, 16px);
  flex-shrink: 0;
  margin: 0px 10px 0px 20px;
`;

const OrderBtn = styled.div`
  display: flex;
  margin: 0px 20px 0px auto;
  padding: 6px 10px 6px 8px;
  align-items: center;
  gap: 4px;
  border-radius: 100px;
  border: 1px solid var(--Color-secondary-dark_navy_blue, #060D24);
  background: var(--Color-secondary-navy_blue, #243348);
  color: #D3EDFF;
`;