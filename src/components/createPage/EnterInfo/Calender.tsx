import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { format, isSameMonth, isSameDay, addDays } from "date-fns";
import React, { useEffect } from "react";
import styled from "styled-components";

interface Props {
  current: Date;
  currentMonth: Date;
  selectedDate: Date | null | string;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null | string>>;
  setValue: React.Dispatch<React.SetStateAction<Date | null | string>>;
  deliverDay: Date | null | string;
}
//7번, 8번 QA 반영 어려움
//반응형 (width) 떄문에 30px고정시키면 간격 안맞아짐
export default function Calender({
  current,
  currentMonth,
  selectedDate,
  setSelectedDate,
  deliverDay,
}: Props) {
  const monthStart = startOfMonth(currentMonth);
  //현재 달의 시작일일
  const monthEnd = endOfMonth(monthStart);
  //현재 달의 막날
  const startDate = startOfWeek(monthStart);
  //아예 첫날
  const endDate = endOfWeek(monthEnd);
  //아예 막날

  const rows: React.ReactNode[] = [];
  let days: React.ReactNode[] = [];
  let day = startDate;
  let formattedDate = "";

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(current); // 기본값을 current로 설정
    }
  }, [current, selectedDate, setSelectedDate]);

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      // 현재 달의 날짜만 처리하도록 조건 추가
      if (!isSameMonth(day, monthStart)) {
        days.push(
          <Disabled
            key={format(day, "yyyy-MM-dd")}
            style={{ marginRight: i === 6 ? "0" : "5.8%" }}
          ></Disabled>
        );
      } else if (deliverDay && isSameDay(day, deliverDay)) {
        days.push(
          <Selected
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "5.8%" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15" cy="15" r="15" fill="#FFA256" />
            </svg>
            <Txt style={{ color: "#FFF" }}>{formattedDate}</Txt>
          </Selected>
        );
      } else if (selectedDate && isSameDay(day, selectedDate)) {
        days.push(
          <Selected
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "5.8%" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <circle cx="15" cy="15" r="15" fill="#FFA256" />
            </svg>
            <Txt style={{ color: "#FFF" }}>{formattedDate}</Txt>
          </Selected>
        );
      } else if (format(day, "yyyy-MM-dd") < format(current, "yyyy-MM-dd")) {
        days.push(
          <Disabled
            key={format(day, "yyyy-MM-dd")}
            style={{ marginRight: i === 6 ? "0" : "5.8%" }}
          >
            <Txt style={{ color: "#DEE2E6" }}>{formattedDate}</Txt>
          </Disabled>
        );
      } else {
        days.push(
          <Valid
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "5.8%" }}
          >
            <Txt style={{ color: "#000000" }}>{formattedDate}</Txt>
          </Valid>
        );
      }

      day = addDays(day, 1);
    }

    rows.push(
      <div
        key={format(day, "yyyy-MM-dd")}
        style={{ height: "30px", marginBottom: "10px" }}
      >
        {days}
      </div>
    );
    console.log(rows);
    days = [];
  }

  return <Container>{rows}</Container>;
}
const Container = styled.div`
  width: 100%;
  height: 100%;
`;
const Disabled = styled.div`
  position: relative;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 9.1%;
  height: 30px;
  box-sizing: border-box;
`;
const Selected = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  width: 9.1%;
  height: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  box-sizing: border-box;
  overflow: visible;
  svg {
    overflow: visible;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30px;
    height: 30px;
  }
`;
const Valid = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  width: 9.1%;
  height: 30px;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const Txt = styled.span`
  position: absolute;
  text-align: center;
  font-family: "GmarketSans";
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
