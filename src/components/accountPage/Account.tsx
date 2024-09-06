import React, { useEffect, useState } from "react";
import styled from "styled-components";
import prev from "../../../public/assets/prev.png";
import { useNavigate } from "react-router-dom";
import out from "../../../public/assets/out_X.svg";
import logout from "../../../public/assets/logout.svg";
import { Logout } from "./Logout";
import { AccountDelete } from "./AccountDelete";

export const Account = () => {
  const navigate = useNavigate();
  const [popup, setPopup] = useState<boolean>(false);
  const [viewDelete, setViewDelete] = useState<boolean>(false);

  const navigateBack = () => {
    navigate(-1);
  };
  const handlePopup = () => {
    setPopup(true);
  };
  const handleDelete = () => {
    setViewDelete(true);
  };
  return (
    <BackGround>
      {popup === false && viewDelete === false && (
        <>
          <Prev src={prev} onClick={navigateBack} />
          <List>
            <Container>
              <Area onClick={handlePopup}>
                <img src={logout} style={{ width: "14px", height: "14px" }} />
                <span>로그아웃</span>
              </Area>
            </Container>
            <Container>
              <Area onClick={handleDelete}>
                <img src={out} style={{ width: "14px", height: "14px" }} />
                <span>탈퇴하기</span>
              </Area>
            </Container>
          </List>
        </>
      )}
      {popup && <Logout setPopup={setPopup} />}
      {viewDelete && <AccountDelete setViewDelete={setViewDelete} />}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
`;
const Prev = styled.img`
  width: 8px;
  height: 16px;
  margin-left: 20px;
  margin-top: 16px;
  cursor: pointer;
`;
const List = styled.div`
  display: flex;
  margin-left: 21px;
  margin-right: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  margin-top: 12px;
`;
const Container = styled.div`
  justify-content: flex-start;
  display: flex;
  margin-top: 16px;
  padding-bottom: 16px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  color: #060d24;
  font-family: SUIT;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.5px;
`;
const Area = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 8px;
`;
