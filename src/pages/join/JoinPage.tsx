import { Join } from '../../components/joinPage/Join';
import { usePreventBack } from '../../hooks';

export const JoinPage = () => {
  usePreventBack();

  return (
    <div>
      <Join />
    </div>
  );
};
