import { useEffect } from 'react';

import { useLocation } from 'react-router-dom';

export const usePreventBack = () => {
  const location = useLocation();

  const fullUrl =
    window.location.origin +
    location.pathname +
    location.search +
    location.hash;

  useEffect(() => {
    const preventGoBack = () => {
      window.history.go(1); // STEP 2. 뒤로가기 시 다시 앞으로 이동
    };

    const preventUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // STEP 1. 페이지 방문 시 동일 history를 복제해서 추가하여 뒤로 가도 동일 페이지가 유지되게
    window.history.pushState(
      {
        ...window.history.state,
      },
      '',
      fullUrl,
    );
    window.addEventListener('popstate', preventGoBack);
    window.addEventListener('beforeunload', preventUnload);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, []);
};
