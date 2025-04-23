import React, { useEffect, useState } from 'react';

import { addMonths, format, subMonths } from 'date-fns';
import styled from 'styled-components';

import Next from '../../../../public/assets/next.svg';
import Prev from '../../../../public/assets/pageprev.svg';
import NonPrev from '../../../../public/assets/prev_non.svg';
import Calender from './Calender';

interface Props {
  setValue: React.Dispatch<React.SetStateAction<Date | null | string>>;
  deliverDay: Date | null | string;
}

export default function CalenderView({ setValue, deliverDay }: Props) {
  const [current] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null | string>(null);

  useEffect(() => {
    if (deliverDay) {
      setSelectedDate(deliverDay);
      setValue(deliverDay);
    }
  }, [deliverDay, setValue]);

  useEffect(() => {
    setValue(selectedDate);
  }, [selectedDate, setValue]);

  const date = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Wrapper>
      <Container>
        <Header>
          {format(currentMonth, 'MM') === format(current, 'MM') &&
          format(currentMonth, 'yyyy') === format(current, 'yyyy') ? (
            <>
              <PrevButton>
                <img src={NonPrev} alt="nonprev" />
              </PrevButton>
            </>
          ) : (
            <PrevButton
              onClick={() => {
                setCurrentMonth(subMonths(currentMonth, 1));
              }}
            >
              <img src={Prev} alt="prev" />
            </PrevButton>
          )}
          <Current>
            {format(currentMonth, 'yyyy')}년{` `}
            {format(currentMonth, 'MM')}월
          </Current>
          <NextButton
            onClick={() => {
              setCurrentMonth(addMonths(currentMonth, 1));
            }}
          >
            <img src={Next} alt="next" />
          </NextButton>
        </Header>
        <Days>
          {date.map((date, index) => (
            <Day key={index}>{date}</Day>
          ))}
        </Days>
        <Body>
          <Calender
            deliverDay={deliverDay}
            current={current}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            setValue={setValue}
          />
        </Body>
      </Container>
    </Wrapper>
  );
}
const Wrapper = styled.div`
  position: relative;

  width: 100%;
  //height: 100%;
`;
const Container = styled.div`
  position: relative;

  display: flex;

  flex-direction: column;

  align-items: center;

  width: 100%;
`;
const Header = styled.div`
  position: relative;
  position: relative;

  display: flex;

  gap: 12px;
  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  padding-top: 4px;
  margin-right: 20px;
  margin-left: 20px;
  //width: 100%;
`;
const PrevButton = styled.span`
  position: relative;
  left: 0;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  padding: 4px 8px;

  cursor: pointer;
  //padding-left: 0.2rem;
`;
const Current = styled.span`
  position: absolute;
  left: 50%;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;

  line-height: 24px;

  color: #212529;

  letter-spacing: -0.5px;

  transform: translateX(-50%);
`;
const NextButton = styled.span`
  position: absolute;
  right: 0;

  box-sizing: border-box;
  display: flex;

  align-items: center;
  justify-content: center;

  width: 24px;
  height: 24px;

  padding: 4px 8px;

  cursor: pointer;
  //padding-right: 0.2rem;
`;
const Days = styled.div`
  display: flex;

  align-items: center;
  align-self: stretch;
  justify-content: space-between;

  padding-bottom: 10px;
  margin-top: 24px;
  margin-right: 22px;
  margin-left: 22px;
  //width: 100%;
  //gap: 1%;
`;
const Day = styled.span`
  display: flex;

  padding: 0.5rem 4% 0.7rem 3.9%;

  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-weight: 400;

  color: #868e96;

  text-align: center;
  //height: 1rem;
  //width: 9.1%;
  //padding: 5px 9.5px 9px 7px;
`;
const Body = styled.div`
  position: relative;

  width: calc(100% - 44px);

  margin-right: 22px;
  margin-bottom: 14px;
  margin-left: 22px;
`;
