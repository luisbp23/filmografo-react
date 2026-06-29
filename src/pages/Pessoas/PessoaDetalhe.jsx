import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPessoaDetalhe } from '../../services/tmdb';
import './PessoaDetalhe.css';

function PessoaDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pessoa, setPessoa] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarPessoa() {
            try {
                setLoading(true);
                setErro('');

                const dados = await getPessoaDetalhe(id);

                if (!dados) {
                    setErro('Não foi possível carregar os detalhes desta pessoa.');
                    return;
                }

                setPessoa(dados);
            } catch (error) {
                console.error('Erro ao carregar detalhe da pessoa:', error);
                setErro('Não foi possível carregar os detalhes desta pessoa.');
            } finally {
                setLoading(false);
            }
        }

        carregarPessoa();
    }, [id]);

    const trabalhosConhecidos = useMemo(() => {
        if (!pessoa?.combined_credits?.cast) {
            return [];
        }

        return pessoa.combined_credits.cast
            .filter((item) => item.poster_path)
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 12);
    }, [pessoa]);

    if (loading) {
        return (
            <div className="pessoa-detalhe-page">
                <p className="pessoa-status">A carregar detalhes da pessoa...</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="pessoa-detalhe-page">
                <p className="pessoa-erro">{erro}</p>

                <button
                    type="button"
                    className="pessoa-voltar-btn"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>
            </div>
        );
    }

    if (!pessoa) {
        return null;
    }

    const fotografia = pessoa.profile_path
        ? `https://image.tmdb.org/t/p/w500${pessoa.profile_path}`
        : '/flogo.png';

    const nascimento = pessoa.birthday
        ? new Date(pessoa.birthday).toLocaleDateString('pt-PT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : 'Data desconhecida';

    const morte = pessoa.deathday
        ? new Date(pessoa.deathday).toLocaleDateString('pt-PT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : null;

    const localNascimento = pessoa.place_of_birth || 'Local desconhecido';

    return (
        <div className="pessoa-detalhe-page">
            <button
                type="button"
                className="pessoa-voltar-btn"
                onClick={() => navigate(-1)}
            >
                ← Voltar
            </button>

            <section className="pessoa-resumo">
                <div className="pessoa-foto-wrapper">
                    <img
                        src={fotografia}
                        alt={`Fotografia de ${pessoa.name}`}
                        className="pessoa-foto"
                    />
                </div>

                <div className="pessoa-info-principal">
                    <h1 className="pessoa-nome">{pessoa.name}</h1>

                    <div className="pessoa-meta">
                        <p>
                            <strong>Conhecido por:</strong>{' '}
                            {pessoa.known_for_department || 'Informação desconhecida'}
                        </p>

                        <p>
                            <strong>Data de nascimento:</strong> {nascimento}
                        </p>

                        {morte && (
                            <p>
                                <strong>Data de falecimento:</strong> {morte}
                            </p>
                        )}

                        <p>
                            <strong>Local de nascimento:</strong> {localNascimento}
                        </p>
                    </div>

                    <div className="pessoa-biografia">
                        <h2>Biografia</h2>

                        <p>
                            {pessoa.biography ||
                                'Ainda não existe biografia disponível para esta pessoa.'}
                        </p>
                    </div>
                </div>
            </section>

            <section className="pessoa-section">
                <h2>Conhecido por</h2>

                {trabalhosConhecidos.length === 0 ? (
                    <p className="pessoa-status">
                        Não existem filmes ou séries disponíveis.
                    </p>
                ) : (
                    <div className="trabalhos-horizontal">
                        {trabalhosConhecidos.map((trabalho) => (
                            <TrabalhoCard
                                key={`${trabalho.media_type}-${trabalho.id}`}
                                trabalho={trabalho}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function TrabalhoCard({ trabalho }) {
    const titulo = trabalho.title || trabalho.name || 'Sem título';
    const data = trabalho.release_date || trabalho.first_air_date || '';
    const ano = data ? new Date(data).getFullYear() : 'Ano desconhecido';

    const imagem = trabalho.poster_path
        ? `https://image.tmdb.org/t/p/w185${trabalho.poster_path}`
        : '/flogo.png';

    const path =
        trabalho.media_type === 'movie'
            ? `/filmes/${trabalho.id}`
            : `/series/${trabalho.id}`;

    return (
        <Link to={path} className="trabalho-card">
            <div className="trabalho-poster-wrapper">
                <img
                    src={imagem}
                    alt={titulo}
                    className="trabalho-poster"
                />
            </div>

            <div className="trabalho-info">
                <h3>{titulo}</h3>
                <p>{ano}</p>
            </div>
        </Link>
    );
}

export default PessoaDetalhe;