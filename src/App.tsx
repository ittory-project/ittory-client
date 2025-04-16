import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainLayout } from './layout/MainLayout';
import { ReceiveLetterPage } from './pages/receive/ReceiveLetterPage';
import { LoginRedirectPage } from './pages/home/LoginRedirectPage';
import { ReceivePage } from './pages/receive/ReceivePage';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/home/LoginPage';
import { WritePage } from './pages/write/WritePage';
import { CreatePage } from './pages/create/CreatePage';
import { InvitePage } from './pages/invite/InvitePage';
import { JoinPage } from './pages/join/JoinPage';
import { ConnectionPage } from './pages/connect/ConnectionPage';
import { AccountPage } from './pages/account/AccountPage';
import { LetterBoxPage } from './pages/letterbox/LetterBoxPage';
import { ShareLetterPage } from './pages/share/SharePage';
import { LoadingPage } from './pages/invite/LoadingPage';

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
          <Route path="/write/:letterId" element={<WritePage />} />
          <Route path="/receive/:letterId" element={<ReceivePage />} />
          <Route
            path="/receive/letter/:letterId"
            element={<ReceiveLetterPage />}
          />
          <Route path="/share/:letterId" element={<ShareLetterPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/join/:letterId" element={<JoinPage />} />
          <Route path="/connection" element={<ConnectionPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/letterbox" element={<LetterBoxPage />} />
          <Route path="/loading" element={<LoadingPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
