import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface Props {
  loadstatus: boolean;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadstatus: React.Dispatch<React.SetStateAction<boolean>>;
  memberIndex: number;
}

export const Loading = ({
  loadstatus,
  setLoad,
  setLoadstatus,
  memberIndex,
}: Props) => {
  useEffect(() => {
    console.log("로딩중");
    if (loadstatus === true) {
      setLoad(true);
      console.log(loadstatus);
    } else {
      setLoad(false);
      console.log(loadstatus);
    }
  }, [loadstatus, setLoadstatus]);

  useEffect(() => {
    console.log("로딩중");
    if (loadstatus === true) {
      setLoad(true);
      console.log(loadstatus);
    } else {
      if (memberIndex > -1) {
        setLoad(false);
        console.log(loadstatus);
      }
    }
  }, [memberIndex]);

  useEffect(() => {
    console.log("로딩중");
    if (loadstatus === true) {
      setLoad(true);
      console.log(loadstatus);
    } else {
      setLoad(false);
      console.log(loadstatus);
    }
  }, []);

  return <div></div>;
};
