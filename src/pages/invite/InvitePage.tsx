import { Invite } from '../../components/InvitePage/Invite';
import { usePreventBack } from '../../hooks';

export const InvitePage = () => {
  usePreventBack();

  return (
    <div>
      <Invite />
    </div>
  );
};
