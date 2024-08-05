import { useEffect, useState } from "react";
import { WriteMainModal } from "../components/writePage/writeMainModal/WriteMainModal";
import styled from "styled-components";
import Write from "../components/writePage/Write";

export const WritePage = () => {
  const [showPopup, setShowPopup] = useState(true);

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
      <Write />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
