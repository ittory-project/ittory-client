import { useEffect } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export const usePreventBack = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const preventGoBack = () => {
      navigate(1); // STEP 2. 뒤로가기 시 다시 앞으로 이동
    };

    const preventUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // NOTE: window.location, window.history 사용 대신 react-router를 거쳐서 써야 최신 값 조회가 가능한 듯
    // 정확한 이유는 모르겠지만, raw 값 사용 시 push도 여러 번 일어나고, useParams에서 정상 인식이 되지 않았음
    const latestUrl = location.pathname + location.search + location.hash;

    // STEP 1. 페이지 방문 시 동일 history를 복제해서 추가하여 뒤로 가도 동일 페이지가 유지되게
    navigate(latestUrl, {
      state: {
        ...location.state,
      },
    });
    window.addEventListener('popstate', preventGoBack);
    window.addEventListener('beforeunload', preventUnload);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
      window.removeEventListener('beforeunload', preventUnload);
    };
  }, []);
};
