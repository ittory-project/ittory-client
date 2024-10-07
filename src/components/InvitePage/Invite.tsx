import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { HostUser } from "./HostUser";
import { Member } from "./Member";

export interface GroupItem {
  id: number;
  profileImage: string;
  name: string;
}
//재방문유저 여부
export const Invite = () => {
  const items: GroupItem[] = [
    {
      id: 1,
      profileImage: "../../../public/img/profileimage.svg",
      name: "카리나",
    },

    {
      id: 2,
      profileImage: "../../../public/img/profileimage.svg",
      name: "닝닝",
    },
    {
      id: 3,
      profileImage: "../../../public/img/profileimage.svg",
      name: "윈터",
    },
    {
      id: 4,
      profileImage: "../../../public/img/profileimage.svg",
      name: "아이유우",
    },
    /*
    {
      id: 5,
      profileImage: "../../../public/img/profileimage.svg",
      name: "예지",
    },*/
  ];

  const location = useLocation();
  const receiverName = location.state.receiverName;
  const title = location.state.title;
  const backgroundImage = location.state.backgroundImage;
  const croppedImage = location.state.croppedImage;
  const selectfont = location.state.selectfont;
  const deliverDay = location.state.deliverDay;
  const selectedImageIndex = location.state.selectedImageIndex;
  const guideOpen = location.state.guideOpen;

  const [currentItems, setCurrentItems] = useState<GroupItem[]>(items);
  const [previousItems, setPreviousItems] = useState<GroupItem[]>(items);
  const [exitAlert, setExitAlert] = useState<string | null>(null);
  const [hostAlert, setHostAlert] = useState<string | null>(null);
  const [memberIndex, setMemberIndex] = useState<number>(-1);

  const nowUser: GroupItem = {
    id: 1,
    profileImage: "../../../public/img/profileimage.svg",
    name: "카리나",
  };

  useEffect(() => {
    // Calculate memberIndex when currentItems changes
    const index = currentItems.findIndex(
      (item) =>
        item.id === nowUser.id &&
        item.profileImage === nowUser.profileImage &&
        item.name === nowUser.name
    );
    setMemberIndex(index);
  }, [currentItems]);

  const handleUserExit = (userId: number) => {
    // 배열에서 특정 유저 제거
    const updatedItems = items.filter((item) => item.id !== userId);
    setCurrentItems(updatedItems);
  };

  useEffect(() => {
    const removedMembers = previousItems.filter(
      (prevItem) =>
        !currentItems.find((currentItem) => currentItem.id === prevItem.id)
    );

    if (removedMembers.length > 0) {
      setExitAlert(
        `${removedMembers.map((item) => item.name).join(", ")}님이 퇴장했어요`
      );
      const firstRemovedMember = removedMembers[0];
      if (
        firstRemovedMember &&
        previousItems[0] &&
        firstRemovedMember.id === previousItems[0].id
      ) {
        setHostAlert(
          `참여한 순서대로 '${currentItems[0]?.name || "없음"}'님이 방장이 되었어요`
        );
      }
    }
    setPreviousItems(currentItems);
  }, [currentItems]);

  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setExitAlert(null);
    }, 5000);

    // Cleanup timer if component unmounts or alert changes
    return () => clearTimeout(exitTimer);
  }, [exitAlert]);

  useEffect(() => {
    const hostTimer = setTimeout(() => {
      setHostAlert(null);
    }, 10000);

    return () => clearTimeout(hostTimer);
  }, [hostAlert]);

  return (
    <BackGround>
      {exitAlert && <ExitAlert>{exitAlert}</ExitAlert>}
      {hostAlert && <HostAlert>{hostAlert}</HostAlert>}
      {memberIndex === 0 ? (
        <HostUser
          receiverName={receiverName}
          title={title}
          backgroundImage={backgroundImage}
          croppedImage={croppedImage}
          selectfont={selectfont}
          deliverDay={deliverDay}
          selectedImageIndex={selectedImageIndex}
          guideOpen={guideOpen}
          items={currentItems}
          handleUserExit={handleUserExit}
        />
      ) : (
        <Member
          receiverName={receiverName}
          title={title}
          backgroundImage={backgroundImage}
          croppedImage={croppedImage}
          selectfont={selectfont}
          deliverDay={deliverDay}
          selectedImageIndex={selectedImageIndex}
          guideOpen={guideOpen}
          items={currentItems}
          handleUserExit={handleUserExit}
        />
      )}
    </BackGround>
  );
};

const BackGround = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background: #d3edff;
  background-blend-mode: overlay, normal;
`;
const HostAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  top: 110px;
  transform: translateX(-50%);
  white-space: nowrap;
`;
const ExitAlert = styled.div`
  display: flex;
  padding: var(--Border-Radius-radius_300, 8px) 20px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 100;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  text-align: center;
  font-family: SUIT;
  font-weight: 500;
  font-size: 12px;
  font-style: normal;
  line-height: 16px;
  letter-spacing: -0.5px;
  position: absolute;
  left: 50%;
  top: 60px;
  transform: translateX(-50%);
`;
