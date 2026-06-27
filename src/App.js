import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home'

function App() {
  return (
    <div className="App">
      <Header />
      <Sidebar />

      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
      
      <Footer />
    </div>
  );
}

export default App;
