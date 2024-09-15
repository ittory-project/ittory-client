import React, { useState, useEffect } from "react";
import styled from "styled-components";
import more from "../../../public/assets/more_white.svg";
import x from "../../../public/assets/x_white.svg";
import { Created_Modal } from "./Created_Modal";
import { Received_Modal } from "./Received_Modal";
import { DeletePopup } from "./DeletePopup";

interface Props {
  setOpenLetter: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  context: string | null;
  setPopup: React.Dispatch<React.SetStateAction<boolean>>;
  popup: boolean;
  onDelete: () => void;
  deleteItem: string;
  isModalOpen: boolean;
}

export const Letter = ({
  setOpenLetter,
  context,
  setPopup,
  popup,
  onDelete,
  deleteItem,
  setIsModalOpen,
  isModalOpen,
}: Props) => {
  const [deleteName, setDeleteName] = useState<string>("");

  const handleCancel = () => {
    setOpenLetter(false);
  };
  const handleMore = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    setDeleteName(deleteItem);
  }, [deleteItem]);

  return (
    <BackGround>
      {isModalOpen && <Overlay />}
      {!popup && (
        <>
          <Header>
            <CancelBox>
              <Cancel src={x} alt="x_icon" onClick={handleCancel} />
            </CancelBox>
            <MoreBox>
              <More src={more} alt="more_icon" onClick={handleMore} />
            </MoreBox>
          </Header>
          {isModalOpen &&
            (context === "created" ? (
              <Created_Modal
                setIsModalOpen={setIsModalOpen}
                setPopup={setPopup}
              />
            ) : context === "received" ? (
              <Received_Modal
                setIsModalOpen={setIsModalOpen}
                setPopup={setPopup}
              />
            ) : null)}
        </>
      )}
      {popup && (
        <DeletePopup
          setOpenLetter={setOpenLetter}
          setPopup={setPopup}
          onDelete={onDelete}
          setIsModalOpen={setIsModalOpen}
          context="created"
          deleteItem={deleteName}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #f3c183 0%, #f0f5bf 100%);
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  transition: background 0.3s ease;
  z-index: 99;
`;
const Header = styled.div`
  display: flex;
  width: 100%;
  padding: 0px 4px;
  align-items: center;
`;
const CancelBox = styled.div`
  display: flex;
  padding: 12px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Cancel = styled.img`
  display: flex;
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  margin-left: 5px;
  margin-top: 5px;
`;
const MoreBox = styled.div`
  display: flex;
  padding: 12px;
  position: absolute;
  right: 4px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;
const More = styled.img`
  display: flex;
  width: 3px;
  height: 17px;
  flex-shrink: 0;
  margin-right: 10.5px;
  margin-top: 4px;
`;
