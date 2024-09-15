import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
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
