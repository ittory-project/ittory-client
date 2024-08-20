import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { CreatePage } from "./pages/CreatePage";
import { InvitePage } from "./pages/InvitePage";

function App() {
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route path="/Create" element={<CreatePage />} />
          <Route path="/Invite" element={<InvitePage />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}

export default App;
