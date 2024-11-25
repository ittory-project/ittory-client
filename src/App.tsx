import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { ReceiveLetterPage } from "./pages/receive/ReceiveLetterPage";
import { LoginRedirectPage } from "./pages/home/LoginRedirectPage";
import { ReceivePage } from "./pages/receive/ReceivePage";
import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/home/LoginPage";
import { WritePage } from "./pages/write/WritePage";
import { CompTest } from "./components/common/CompTest";
import { CreatePage } from "./pages/create/CreatePage";
import { InvitePage } from "./pages/invite/InvitePage";
import { JoinPage } from "./pages/join/JoinPage";
import { ConnectionPage } from "./pages/connect/ConnectionPage";
import { AccountPage } from "./pages/account/AccountPage";
import { LetterBoxPage } from "./pages/letterbox/LetterBoxPage";
import { ShareLetterPage } from "./pages/share/SharePage";
import { InvitationPage } from "./pages/join/InvitationPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/comp" element={<CompTest />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/login/redirect" element={<LoginRedirectPage />} />
          <Route path="/write/:letterId" element={<WritePage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/receive/letter" element={<ReceiveLetterPage />} />
          <Route path="/share" element={<ShareLetterPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/invite" element={<InvitePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/connection" element={<ConnectionPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/letterBox" element={<LetterBoxPage />} />
          <Route path="/invitation/:letterId" element={<InvitationPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
