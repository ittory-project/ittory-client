/* eslint-disable react/react-in-jsx-scope */
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layout/MainLayout';

function App() {
  return (
    <MainLayout>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>
      </Router>
    </MainLayout>
  );
}

export default App;