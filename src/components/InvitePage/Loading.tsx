import React, { useEffect, useState } from "react";

interface Props {
  loadstatus: boolean;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Loading = ({ loadstatus, setLoad }: Props) => {
  useEffect(() => {
    console.log("로딩중");
    if (loadstatus === true) {
      setLoad(true);
      console.log(loadstatus);
    } else {
      setLoad(false);
      console.log(loadstatus);
    }
  }, [loadstatus]);

  return <div></div>;
};
