import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainLayout } from "./layout/MainLayout";
import { CreateLetterPage } from "./pages/CreateLetterPage";

function App() {
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route path="/CreateLetter" element={<CreateLetterPage />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}

export default App;
