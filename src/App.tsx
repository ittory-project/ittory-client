import { useEffect } from 'react';

import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './App.css';
import { MainLayout } from './layout/MainLayout';
import { AccountPage } from './pages/account/AccountPage';
import { ConnectionPage } from './pages/connect/ConnectionPage';
import { CreatePage } from './pages/create/CreatePage';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/home/LoginPage';
import { LoginRedirectPage } from './pages/home/LoginRedirectPage';
import { InvitePage } from './pages/invite/InvitePage';
import { LoadingPage } from './pages/invite/LoadingPage';
import { JoinPage } from './pages/join/JoinPage';
import { LetterBoxPage } from './pages/letterbox/LetterBoxPage';
import { ReceiveLetterPage } from './pages/receive/ReceiveLetterPage';
import { ReceivePage } from './pages/receive/ReceivePage';
import { ShareLetterPage } from './pages/share/SharePage';
import { WritePage } from './pages/write/WritePage';

function App() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/redirect" element={<LoginRedirectPage />} />
          <Route path="/receive/:letterId" element={<ReceivePage />} />
          <Route
            path="/receive/letter/:letterId"
            element={<ReceiveLetterPage />}
          />

          {/* TODO: 편지 작성 퍼널로 변경 */}
          <Route path="/create" element={<CreatePage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/join/:letterId" element={<JoinPage />} />
          <Route path="/connection" element={<ConnectionPage />} />
          <Route path="/write/:letterId" element={<WritePage />} />
          <Route path="/share/:letterId" element={<ShareLetterPage />} />

          <Route path="/account" element={<AccountPage />} />
          <Route path="/letterbox" element={<LetterBoxPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
