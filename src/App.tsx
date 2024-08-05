import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layout/MainLayout';
import { WritePage } from './pages/WritePage';
import { CompTest } from './components/common/\bCompTest';

function App() {
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/write' element={<WritePage />} />
          <Route path='/comp' element={<CompTest />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}

export default App;