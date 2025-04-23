import { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { LetterBox } from '../../components/letterboxPage/LetterBox';

export const LetterBoxPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/', { replace: true });
  };

  useEffect(() => {
    // 현재 페이지를 히스토리에 추가하여 뒤로가기 할 수 없게 함
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handleGoBack);

    return () => {
      window.removeEventListener('popstate', handleGoBack);
    };
  }, [location]);

  return (
    <div>
      <LetterBox />
    </div>
  );
};
