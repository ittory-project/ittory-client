import { useEffect } from 'react';

import { Create } from '../../components/createPage/Create';

export const CreatePage = () => {
  useEffect(() => {
    if (localStorage.getItem('load')) {
      localStorage.removeItem('load');
    }
    if (localStorage.getItem('userName')) {
      localStorage.removeItem('userName');
      localStorage.removeItem('guideOpen');
    }
  }, []);

  return (
    <div>
      <Create />
    </div>
  );
};
