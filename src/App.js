import './App.css';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Filmes from './pages/Filmes/Filmes';
import Series from './pages/Series/Series';
import Pessoas from './pages/Pessoas/Pessoas';
import FilmeDetalhe from './pages/Filmes/FilmeDetalhe';
import Pesquisa from './pages/Pesquisa/Pesquisa';
import SerieDetalhe from './pages/Series/SerieDetalhe';
import PessoaDetalhe from './pages/Pessoas/PessoaDetalhe';

function App() {
  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <div className='app-content'>
          <main className='app-main'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/filmes/:id' element={<FilmeDetalhe />} />
              <Route path="/pesquisa" element={<Pesquisa />} />
              <Route path="/series/:id" element={<SerieDetalhe />} />
              <Route path="/pessoas/:id" element={<PessoaDetalhe />} />
              <Route path="/filmes" element={<Filmes />} />
              <Route path="/series" element={<Series />} />
              <Route path="/pessoas" element={<Pessoas />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;