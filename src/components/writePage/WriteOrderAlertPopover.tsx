import styled from "styled-components";

interface WriteOrderMemberProps {
  member: [
    profileImageUrl: string,
    name: string,
  ]
}

export const WriteOrderAlertPopover: React.FC<WriteOrderMemberProps> = ({ member }) => {
  return (
    // 상단에 순서 버튼 누르면 작게 순서 알려주는거
    <div>{member}</div>
  );
};