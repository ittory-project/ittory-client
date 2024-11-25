/*
  //invitation페이지에서 재방문자 구분
  재방문자)letterId추출해서 invite로 랜더링
    -단 인원수 검증 과정 거침
  신규)로그인화면->join페이지로..
  -letterId는 로컬스토리지에 저장
  -로그인화면으로갈때 navige와 함께 invite상태 전달하고
  초대받았을시 join화면으로 
  const handle = async () => {
    const url = `${import.meta.env.VITE_SERVER_URL}/invitation/${letterId}`;
*/
import React, { useState, useEffect } from "react";
import { getVisitUser } from "../../api/service/MemberService";
import { useNavigate, useParams } from "react-router-dom";

export default function JoinStart() {
  const navigate = useNavigate();
  const params = useParams();
  const letterId = params.letterId;

  useEffect(() => {
    if (letterId) {
      localStorage.setItem("letterId", letterId);
    }
  }, [letterId]); //아니면 그냥 state로 전달

  useEffect(() => {
    const fetchVisitUser = async () => {
      try {
        const visitdata = await getVisitUser();

        //재방문
        if (visitdata.isVisited !== true) {
          navigate("/Invite", {
            state: {
              letterId: letterId,
              guideOpen: false,
            },
          });
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchVisitUser();
  }, []);

  return (
    <>
      <div>hi</div>
      <div>hello</div>
    </>
  );
}
