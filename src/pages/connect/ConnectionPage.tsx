import { Connection } from '../../components/connectionPage/Connection';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const ConnectionPage = () => {
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
      <Connection />
    </div>
  );
};
