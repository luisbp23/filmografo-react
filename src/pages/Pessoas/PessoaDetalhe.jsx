import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getPessoaDetalhe } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import './PessoaDetalhe.css';

function PessoaDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, language, locale } = useLanguage();

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
                    setErro(t('personDetailsError'));
                    return;
                }

                setPessoa(dados);
            } catch (error) {
                console.error('Erro ao carregar detalhe da pessoa:', error);
                setErro(t('personDetailsError'));
            } finally {
                setLoading(false);
            }
        }

        carregarPessoa();
    }, [id, language, t]);

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
                <p className="pessoa-status">{t('loading')}</p>
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
                    {t('back')}
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
        ? new Date(pessoa.birthday).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : t('unknownDate');

    const morte = pessoa.deathday
        ? new Date(pessoa.deathday).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : null;

    const localNascimento = pessoa.place_of_birth || t('unknownPlace');

    return (
        <div className="pessoa-detalhe-page">
            <button
                type="button"
                className="pessoa-voltar-btn"
                onClick={() => navigate(-1)}
            >
                ← {t('back')}
            </button>

            <section className="pessoa-resumo">
                <div className="pessoa-foto-wrapper">
                    <img
                        src={fotografia}
                        alt={pessoa.name}
                        className="pessoa-foto"
                    />
                </div>

                <div className="pessoa-info-principal">
                    <h1 className="pessoa-nome">{pessoa.name}</h1>

                    <div className="pessoa-meta">
                        <p>
                            <strong>{t('knownFor')}:</strong>{' '}
                            {pessoa.known_for_department || t('unknownInfo')}
                        </p>

                        <p>
                            <strong>{t('birthDate')}:</strong> {nascimento}
                        </p>

                        {morte && (
                            <p>
                                <strong>{t('deathDate')}:</strong> {morte}
                            </p>
                        )}

                        <p>
                            <strong>{t('birthPlace')}:</strong> {localNascimento}
                        </p>
                    </div>

                    <div className="pessoa-biografia">
                        <h2>{t('biography')}</h2>

                        <p>
                            {pessoa.biography || t('noBiography')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="pessoa-section">
                <h2>{t('knownFor')}</h2>

                {trabalhosConhecidos.length === 0 ? (
                    <p className="pessoa-status">{t('noKnownWorks')}</p>
                ) : (
                    <div className="trabalhos-horizontal">
                        {trabalhosConhecidos.map((trabalho) => (
                            <TrabalhoCard
                                key={`${trabalho.media_type}-${trabalho.id}`}
                                trabalho={trabalho}
                                locale={locale}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

function TrabalhoCard({ trabalho, locale }) {
    const titulo = trabalho.title || trabalho.name || 'Sem título';
    const data = trabalho.release_date || trabalho.first_air_date || '';
    const ano = data ? new Date(data).getFullYear() : '';

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

                {ano && <p>{ano}</p>}
            </div>
        </Link>
    );
}

export default PessoaDetalhe;