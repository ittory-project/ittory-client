import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Receive from '../../components/receivePage/Receive';

export const ReceivePage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/');
  };
  useEffect(() => {
    history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, []);

  return (
    <div>
      <Receive />
    </div>
  );
};
