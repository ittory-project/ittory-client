import { useEffect, useState } from "react";
import styled from "styled-components";
import { WriteMainModal } from "../../components/writePage/writeMainModal/WriteMainModal";
import { Write } from "../../components/writePage/Write";
import { Outlet } from "react-router-dom";

export const WritePage = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [showSubmitPage, setShowSubmitPage] = useState(false);

  const onClose = () => {
    setShowPopup(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container>
      {showPopup && <WriteMainModal onClose={onClose} />}
      <Write setShowSubmitPage={setShowSubmitPage} />
      {showSubmitPage && (
        <ModalOverlay>
          <Outlet context={setShowSubmitPage}/>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
`;
