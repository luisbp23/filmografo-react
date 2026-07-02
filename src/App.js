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
import AdicionarConteudo from './pages/Adicionar/AdicionarConteudo';
import Login from './pages/Login/Login';
import RequireAuth from './components/RequireAuth';
import MeusPedidos from './pages/MeusPedidos/MeusPedidos';
import EditarConteudo from './pages/EditarConteudo/EditarConteudo';
import AdminPanel from './pages/AdminPanel';
import ComunidadeDetalhe from './pages/ComunidadeDetalhe'

function App() {
  return (
    <div className="app">
      <Header />

      <div className="app-body">
        <Sidebar />

        <div className='app-content'>
          <main className='app-main'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pesquisa" element={<Pesquisa />} />

              <Route path="/filmes" element={<Filmes />} />
              <Route path="/filmes/:id" element={<FilmeDetalhe />} />

              <Route path="/series" element={<Series />} />
              <Route path="/series/:id" element={<SerieDetalhe />} />

              <Route path="/pessoas" element={<Pessoas />} />
              <Route path="/pessoas/:id" element={<PessoaDetalhe />} />

              <Route path="/login" element={<Login />} />

              <Route
                path="/adicionar/:tipo"
                element={
                  <RequireAuth>
                    <AdicionarConteudo />
                  </RequireAuth>
                }
              />

              <Route
                path="/meus-pedidos"
                element={
                  <RequireAuth>
                    <MeusPedidos />
                  </RequireAuth>
                }
              />

              <Route
                path="/editar-conteudo/:id"
                element={
                  <RequireAuth>
                    <EditarConteudo />
                  </RequireAuth>
                }
              />

              <Route 
                path='/admin'
                element={
                  <RequireAuth>
                    <AdminPanel />
                  </RequireAuth>
                }
              />

              <Route path="/comunidade/:tipo/:id" element={<ComunidadeDetalhe />} />

            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default App;