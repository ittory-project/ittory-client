import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  loadstatus: boolean;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Loading = ({ loadstatus, setLoad }: Props) => {
  useEffect(() => {
    console.log("로딩중");
    if (loadstatus === true) {
      console.log(loadstatus);
    } else {
      console.log(loadstatus);
      setLoad(false);
    }
  }, [loadstatus]);
  return <div>로딩중</div>;
};
