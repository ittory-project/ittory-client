import styled from "styled-components";

interface WriteOrderMemberProps {
  member: [
    profileImageUrl: string,
    name: string,
  ]
}

export const WriteOrderModal: React.FC<WriteOrderMemberProps> = ({ member }) => {
  return (
    // 편지 시작할 때
    // 3명의 참여자가 20번씩 이어 쓸 거예요 그 모달
    <div>{member}</div>
  );
};