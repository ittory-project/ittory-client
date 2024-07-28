import styled from "styled-components";

interface WriteOrderMemberProps {
  member: [
    profileImageUrl: string,
    name: string,
  ]
}

export const WriteOrderAlertPopover: React.FC<WriteOrderMemberProps> = ({ member }) => {
  return (
    <div>{member}</div>
  );
};