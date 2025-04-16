import { Invite } from '../../components/InvitePage/Invite';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const InvitePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Invite />
    </div>
  );
};
