import styled from "styled-components";

interface WriteOrderMemberProps {
  member: [
    profileImageUrl: string,
    name: string,
  ]
}

export const WriteOrderModal: React.FC<WriteOrderMemberProps> = ({ member }) => {
  return (
    <div>{member}</div>
  );
};