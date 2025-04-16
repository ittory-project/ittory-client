import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NonPrev from '../../../../public/assets/prev_non.svg';
import Prev from '../../../../public/assets/pageprev.svg';
import Next from '../../../../public/assets/next.svg';
import { format, subMonths, addMonths } from 'date-fns';
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
  width: 100%;
  //height: 100%;
  position: relative;
`;
const Container = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  position: relative;
`;
const Header = styled.div`
  //width: 100%;
  padding-top: 4px;
  margin-right: 20px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  justify-content: space-between;
  align-self: stretch;
  position: relative;
`;
const PrevButton = styled.span`
  position: relative;
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  //padding-left: 0.2rem;
  padding: 4px 8px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  left: 0;
`;
const Current = styled.span`
  position: absolute;
  left: 50%;
  color: #212529;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  line-height: 24px;
  letter-spacing: -0.5px;
  transform: translateX(-50%);
`;
const NextButton = styled.span`
  position: absolute;
  cursor: pointer;
  display: flex;
  width: 24px;
  height: 24px;
  //padding-right: 0.2rem;
  padding: 4px 8px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  right: 0;
`;
const Days = styled.div`
  margin-top: 24px;
  margin-right: 22px;
  margin-left: 22px;
  //width: 100%;
  padding-bottom: 10px;
  display: flex;
  //gap: 1%;
  align-self: stretch;
  justify-content: space-between;
  align-items: center;
`;
const Day = styled.span`
  //height: 1rem;
  color: #868e96;
  font-family: var(--Typography-family-title, SUIT);
  font-size: 12px;
  font-weight: 400;
  display: flex;
  //width: 9.1%;
  //padding: 5px 9.5px 9px 7px;
  padding: 0.5rem 4% 0.7rem 3.9%;
  text-align: center;
`;
const Body = styled.div`
  width: calc(100% - 44px);
  position: relative;
  margin-bottom: 14px;
  margin-right: 22px;
  margin-left: 22px;
`;
