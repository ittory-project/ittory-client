import { Suspense } from 'react';

import { Invite } from '../../components/InvitePage/Invite';
import { Loading } from '../../components/InvitePage/Loading';
import { usePreventBack } from '../../hooks';

export const InvitePage = () => {
  usePreventBack();

  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Invite />
      </Suspense>
    </div>
  );
};
