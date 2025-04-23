import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { Loading } from '../../components/InvitePage/Loading';

export const LoadingPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, []);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [navigate]);

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    window.history.replaceState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [location]);

  return (
    <div>
      <Loading />
    </div>
  );
};
