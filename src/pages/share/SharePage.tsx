import { ShareLetter } from '../../components/sharePage/ShareLetter';
import { usePreventBack } from '../../hooks';

export const ShareLetterPage = () => {
  usePreventBack();

  return (
    <div>
      <ShareLetter />
    </div>
  );
};
