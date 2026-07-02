import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import './ComunidadeDetalhe.css';

function ComunidadeDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregar() {
            try {
                const { data, error } = await supabase
                    .from('content')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error || !data) {
                    setErro('Conteúdo não encontrado.');
                    return;
                }

                setItem(data);
            } catch (err) {
                setErro('Erro ao carregar conteúdo.');
            } finally {
                setLoading(false);
            }
        }
        carregar();
    }, [id]);

    if (loading) {
        return (
            <div className="comunidade-detalhe-page">
                <p className="comunidade-status">A carregar...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="comunidade-detalhe-page">
                <p className="comunidade-erro">{erro}</p>
                <button type="button" className="comunidade-voltar-btn" onClick={() => navigate(-1)}>
                    ← Voltar
                </button>
            </div>
        );
    }

    if (!item) return null;

    const isFilme = item.type === 'movie';

    return (
        <div className="comunidade-detalhe-page">
            <section className="comunidade-layout">

                {/* Poster */}
                <div className="comunidade-poster-wrapper">
                    <img
                        src={item.imageurl || '/flogo.png'}
                        alt={item.title}
                        className="comunidade-poster"
                    />
                </div>

                {/* Info */}
                <div className="comunidade-info">
                    <button type="button" className="comunidade-voltar-btn" onClick={() => navigate(-1)}>
                        ← Voltar
                    </button>

                    <h1>{item.title}</h1>

                    {item.genre && (
                        <div className="comunidade-generos">
                            <span>{item.genre}</span>
                        </div>
                    )}

                    {item.synopsis && (
                        <div className="comunidade-sinopse">
                            <h2>Sinopse</h2>
                            <p>{item.synopsis}</p>
                        </div>
                    )}

                    <div className="comunidade-dados">
                        <p><strong>Tipo:</strong> {isFilme ? 'Filme' : 'Série'}</p>

                        {item.state && (
                            <p><strong>Estado:</strong> {item.state}</p>
                        )}

                        {isFilme && item.duration && (
                            <p><strong>Duração:</strong> {item.duration} min</p>
                        )}

                        {!isFilme && item.episodes && (
                            <p><strong>Episódios:</strong> {item.episodes}</p>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default ComunidadeDetalhe;