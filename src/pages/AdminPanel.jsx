import { useEffect, useState, useCallback } from 'react';
import { getConteudoPendente, getDenunciasPendentes, aprovar, rejeitar, resolverDenuncia, ignorarDenuncia } from '../services/adminService';
import ConfirmDialog from '../components/ConfirmDialog';
import './AdminPanel.css';

const ABAS = ['Filmes', 'Séries', 'Denúncias'];

function AdminPanel() {
    const [abaAtiva, setAbaAtiva] = useState('Filmes');
    const [filmes, setFilmes] = useState([]);
    const [series, setSeries] = useState([]);
    const [denuncias, setDenuncias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [acaoPendente, setAcaoPendente] = useState(null);
    
    const carregarDados = useCallback(async () => {
        setLoading(true);
        try {
            if (abaAtiva === 'Filmes') {
                const dados = await getConteudoPendente('movie');
                setFilmes(dados);
            } else if (abaAtiva === 'Séries') {
                const dados = await getConteudoPendente('series');
                setSeries(dados);
            } else if (abaAtiva === 'Denúncias') {
                const dados = await getDenunciasPendentes();
                setDenuncias(dados);
            }
        } finally {
            setLoading(false);
        }
    }, [abaAtiva]);
    
    useEffect(() => {
        carregarDados();
    }, [abaAtiva, carregarDados]);
    
    function pedirAprovar(id) {
        setAcaoPendente({
            titulo: 'Aprovar conteúdo',
            mensagem: 'Tem a certeza que quer aprovar este conteúdo?',
            confirmarTexto: 'Aprovar',
            onConfirmar: async () => {
                await aprovar(id);
                setAcaoPendente(null);
                carregarDados();
            }
        });
    }

    function pedirRejeitar(id) {
        setAcaoPendente({
            titulo: 'Rejeitar conteúdo',
            mensagem: 'Tem a certeza que quer rejeitar este conteúdo?',
            confirmarTexto: 'Rejeitar',
            perigo: true,
            onConfirmar: async () => {
                await rejeitar(id);
                setAcaoPendente(null);
                carregarDados();
            }
        });
    }

    function pedirResolver(id, reviewId) {
        setAcaoPendente({
            titulo: 'Resolver denúncia',
            mensagem: 'Tem a certeza que quer resolver esta denúncia? A crítica ficará escondida.',
            confirmarTexto: 'Resolver',
            perigo: true,
            onConfirmar: async () => {
                await resolverDenuncia(id, reviewId);
                setAcaoPendente(null);
                carregarDados();
            }
        });
    }

    function pedirIgnorar(id) {
        setAcaoPendente({
            titulo: 'Ignorar denúncia',
            mensagem: 'Tem a certeza que quer ignorar esta denúncia?',
            confirmarTexto: 'Ignorar',
            onConfirmar: async () => {
                await ignorarDenuncia(id);
                setAcaoPendente(null);
                carregarDados();
            }
        });
    }
    
    const itensAtuais = abaAtiva === 'Filmes' ? filmes : abaAtiva === 'Séries' ? series : denuncias;
    
    return (
        <div className="admin-panel">
        <h1>Painel de Administrador</h1>
        
        <div className="admin-abas">
        {ABAS.map(aba => (
            <button
            key={aba}
            type="button"
            className={`admin-aba ${abaAtiva === aba ? 'active' : ''}`}
            onClick={() => setAbaAtiva(aba)}
            >
            {aba}
            {/* contador de pendentes */}
            {aba === 'Filmes' && filmes.length > 0 && (
                <span className="admin-badge">{filmes.length}</span>
            )}
            {aba === 'Séries' && series.length > 0 && (
                <span className="admin-badge">{series.length}</span>
            )}
            {aba === 'Denúncias' && denuncias.length > 0 && (
                <span className="admin-badge">{denuncias.length}</span>
            )}
            </button>
        ))}
        </div>
        
        <div className="admin-conteudo">
        {loading ? (
            <p>A carregar...</p>
        ) : itensAtuais.length === 0 ? (
            <p className="admin-vazio">Nenhum item pendente.</p>
        ) : (
            <>
            {abaAtiva !== 'Denúncias' && itensAtuais.map(item => (
                <div key={item.id} className="admin-card">
                <div className="admin-card-info">
                {item.imageurl && (
                    <img src={item.imageurl} alt={item.title} className="admin-card-img" />
                )}
                <div>
                <h3>{item.title}</h3>
                {item.genre && <p><strong>Género:</strong> {item.genre}</p>}
                {item.synopsis && <p><strong>Sinopse:</strong> {item.synopsis}</p>}
                {item.duration && <p><strong>Duração:</strong> {item.duration} min</p>}
                {item.episodes && <p><strong>Episódios:</strong> {item.episodes}</p>}
                </div>
                </div>
                <div className="admin-card-acoes">
                <button
                type="button"
                className="btn-aprovar"
                onClick={() => pedirAprovar(item.id)}
                >
                Aprovar
                </button>
                <button
                type="button"
                className="btn-rejeitar"
                onClick={() => pedirRejeitar(item.id)}
                >
                Rejeitar
                </button>
                </div>
                </div>
            ))}
            
            {abaAtiva === 'Denúncias' && itensAtuais.map(item => (
                <div key={item.id} className="admin-card">
                <div className="admin-card-info">
                <div>
                <p><strong>Denunciado por:</strong> {item.reporter_username ?? 'Desconhecido'}</p>
                <p><strong>Utilizador denunciado:</strong> {item.reviewed_username ?? 'Desconhecido'}</p>
                <p><strong>Motivo:</strong> {item.reason}</p>
                {item.description && <p><strong>Descrição:</strong> {item.description}</p>}
                {item.review_text && <p><strong>Crítica:</strong> {item.review_text}</p>}
                </div>
                </div>
                <div className="admin-card-acoes">
                <button
                type="button"
                className="btn-aprovar"
                onClick={() => pedirResolver(item.id, item.reportedcontent)}
                >
                Resolver
                </button>
                <button
                type="button"
                className="btn-rejeitar"
                onClick={() => pedirIgnorar(item.id)}
                >
                Ignorar
                </button>
                </div>
                </div>
            ))}
            </>
        )}
        </div>

        {acaoPendente && (
            <ConfirmDialog
                titulo={acaoPendente.titulo}
                mensagem={acaoPendente.mensagem}
                confirmarTexto={acaoPendente.confirmarTexto}
                perigo={acaoPendente.perigo}
                onConfirmar={acaoPendente.onConfirmar}
                onCancelar={() => setAcaoPendente(null)}
            />
        )}
        </div>
    );
}

export default AdminPanel;