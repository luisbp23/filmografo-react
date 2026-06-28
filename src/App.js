import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import FilmeDetalhe from './pages/Filmes/FilmeDetalhe';

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="flex-grow-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/filmes/:id" element={<FilmeDetalhe />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default App;