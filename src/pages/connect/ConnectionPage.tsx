import { Connection } from '../../components/connectionPage/Connection';
import { usePreventBack } from '../../hooks';

export const ConnectionPage = () => {
  usePreventBack();

  return (
    <div>
      <Connection />
    </div>
  );
};
