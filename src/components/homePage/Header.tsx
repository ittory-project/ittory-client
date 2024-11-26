import React, { useState, useEffect, ReactNode } from "react";
import styled, { keyframes } from "styled-components";

export default function Header() {
  return (
    <Container>
      <div>헤더야</div>
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 3rem;
  box-sizing: border-box;
  z-index: 100;
  padding: 0px 4px 0px 16px;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.05);
`;
