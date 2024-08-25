import { startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { format, isSameMonth, isSameDay, addDays, parse } from "date-fns";
import React, { useState } from "react";
import styled from "styled-components";
//import SelectedImg from "../../assets/selected.png";

interface Props {
  current: Date;
  currentMonth: Date;
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  setValue: React.Dispatch<React.SetStateAction<Date | null>>;
  deliverDay: Date | null;
}

export default function Calender({
  current,
  currentMonth,
  selectedDate,
  setSelectedDate,
  setValue,
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

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, "d");
      const cloneDay = day;

      days.push(
        !isSameMonth(day, monthStart) ? (
          <Disabled key={format(day, "yyyy-MM-dd")}></Disabled>
        ) : deliverDay && isSameDay(day, deliverDay) ? (
          <Selected
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "6%" }}
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
        ) : selectedDate && isSameDay(day, selectedDate) ? (
          <Selected
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "6%" }}
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
        ) : format(day, "yyyy-MM-dd") < format(current, "yyyy-MM-dd") ? (
          <Disabled
            key={format(day, "yyyy-MM-dd")}
            style={{ marginRight: i === 6 ? "0" : "6%" }}
          >
            <Txt style={{ color: "#DEE2E6" }}>{formattedDate}</Txt>
          </Disabled>
        ) : (
          <Valid
            key={format(day, "yyyy-MM-dd")}
            onClick={() => setSelectedDate(cloneDay)}
            style={{ marginRight: i === 6 ? "0" : "6%" }}
          >
            <Txt style={{ color: "#000000" }}>{formattedDate}</Txt>
          </Valid>
        )
      );

      day = addDays(day, 1);
    }
    rows.push(<div key={format(day, "yyyy-MM-dd")}>{days}</div>);
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
  margin-right: 6%;
  height: 2rem;
  box-sizing: border-box;
`;
const Selected = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  width: 9.1%;
  height: 2rem;
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
    width: 100%;
    height: 100%;
  }
`;
const Valid = styled.div`
  position: relative;
  display: inline-flex;
  cursor: pointer;
  width: 9.1%;
  height: 2rem;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;
const Img = styled.img`
  position: relative;
  padding-top: 0.2rem;
  width: 100%;
  height: 1.85rem;
  object-fit: contain;
`;
const Txt = styled.span`
  position: absolute;
  text-align: center;
  font-family: Gmarket Sans;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;
//클릭 값 저장
