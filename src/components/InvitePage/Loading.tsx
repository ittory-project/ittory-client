import React, { useEffect, useState } from "react";
import { Participants } from "./Invite";
import { getParticipants } from "../../api/service/LetterService";

interface Props {
  loadstatus: boolean;
  setLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadstatus: React.Dispatch<React.SetStateAction<boolean>>;
  memberIndex: number;
  setParticipants: React.Dispatch<React.SetStateAction<Participants[]>>;
  letterId: number;
  setMemberIndex: React.Dispatch<React.SetStateAction<number>>;
  userName: string;
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
