import { useEffect } from 'react';

import { WebSocketUsageExample } from '../../api/experimental/usage';
import { Create } from '../../components/createPage/Create';

export const CreatePage = () => {
  useEffect(() => {
    if (localStorage.getItem('load')) {
      localStorage.removeItem('load');
    }
    if (localStorage.getItem('userName')) {
      localStorage.removeItem('userName');
      localStorage.removeItem('letterId');
      localStorage.removeItem('guideOpen');
    }
  }, []);

  return (
    <div>
      <Create />
      <WebSocketUsageExample />
    </div>
  );
};
