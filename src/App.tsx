import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { ReceivePage } from "./pages/receive/ReceivePage";
import { HomePage } from "./pages/home/HomePage";
import { LoginPage } from "./pages/home/LoginPage";
import { WritePage } from "./pages/write/WritePage";
import { CompTest } from "./components/common/CompTest";
import { ReceiveLetterPage } from "./pages/receive/ReceiveLetterPage";
import { CreatePage } from "./pages/CreatePage";
import { InvitePage } from "./pages/InvitePage";
import { JoinPage } from "./pages/JoinPage";
import { ConnectionPage } from "./pages/ConnectionPage";
import { AccountPage } from "./pages/AccountPage";
import { LetterBoxPage } from "./pages/LetterBoxPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/write" element={<WritePage />} />
          <Route path="/receive" element={<ReceivePage />} />
          <Route path="/receive/letter" element={<ReceiveLetterPage />} />
          <Route path="/comp" element={<CompTest />} />
          <Route path="/Create" element={<CreatePage />} />
          <Route path="/Invite" element={<InvitePage />} />
          <Route path="/Join" element={<JoinPage />} />
          <Route path="/Connection" element={<ConnectionPage />} />
          <Route path="/Account" element={<AccountPage />} />
          <Route path="/LetterBox" element={<LetterBoxPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
