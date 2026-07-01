import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getFilmeDetalhe } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import './FilmeDetalhe.css';
import ReviewForm from '../../components/ReviewForm';
import ReviewCard from '../../components/ReviewCard';

function FilmeDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, language, locale } = useLanguage();

    const [filme, setFilme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarFilme() {
            try {
                setLoading(true);
                setErro('');

                const dados = await getFilmeDetalhe(id);

                if (!dados) {
                    setErro(t('movieDetailsError'));
                    return;
                }

                setFilme(dados);
            } catch (error) {
                console.error('Erro ao carregar detalhe do filme:', error);
                setErro(t('movieDetailsError'));
            } finally {
                setLoading(false);
            }
        }

        carregarFilme();
    }, [id, language, t]);

    const trailer = useMemo(() => {
        if (!filme?.videos?.results) {
            return null;
        }

        return filme.videos.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );
    }, [filme]);

    function enviarCritica(dados) {
        console.log(dados);
    }

    if (loading) {
        return (
            <div className="filme-detalhe-page">
                <p className="filme-status">{t('loading')}</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="filme-detalhe-page">
                <p className="filme-erro">{erro}</p>

                <button
                    type="button"
                    className="filme-voltar-btn"
                    onClick={() => navigate(-1)}
                >
                    ← {t('back')}
                </button>
            </div>
        );
    }

    if (!filme) {
        return null;
    }

    const poster = filme.poster_path
        ? `https://image.tmdb.org/t/p/w500${filme.poster_path}`
        : '/flogo.png';

    const ano = filme.release_date
        ? new Date(filme.release_date).getFullYear()
        : '';

    const duracao = filme.runtime
        ? `${filme.runtime} ${t('minutes')}`
        : t('unknownDuration');

    const avaliacao = filme.vote_average
        ? filme.vote_average.toFixed(1)
        : 'N/A';

    const dataFormatada = filme.release_date
        ? new Date(filme.release_date).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : t('unknownDate');

    const orcamento = filme.budget && filme.budget > 0
        ? new Intl.NumberFormat(locale, {
              style: 'currency',
              currency: 'USD',
              maximumFractionDigits: 0
          }).format(filme.budget)
        : t('unknownInfo');

    const generos = filme.genres || [];
    const elenco = filme.credits?.cast?.slice(0, 12) || [];

    return (
        <div className="filme-detalhe-page">
            <section className="filme-layout">
                <div className="filme-poster-wrapper">
                    <img
                        src={poster}
                        alt={filme.title}
                        className="filme-poster"
                    />
                </div>

                <div className="filme-info">
                    <button
                        type="button"
                        className="filme-voltar-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← {t('back')}
                    </button>

                    <h1>
                        {filme.title} {ano && <span>({ano})</span>}
                    </h1>

                    <div className="filme-generos">
                        {generos.map((genero) => (
                            <span key={genero.id}>{genero.name}</span>
                        ))}
                    </div>

                    <div className="filme-sinopse">
                        <h2>{t('synopsis')}</h2>
                        <p>{filme.overview || t('noSynopsisMovie')}</p>
                    </div>

                    <div className="filme-dados">
                        <p>
                            <strong>{t('releaseDate')}:</strong> {dataFormatada}
                        </p>

                        <p>
                            <strong>{t('duration')}:</strong> {duracao}
                        </p>

                        <p>
                            <strong>{t('tmdbRating')}:</strong> ⭐ {avaliacao}/10
                        </p>

                        <p>
                            <strong>{t('budget')}:</strong> {orcamento}
                        </p>
                    </div>
                </div>
            </section>

            <section className="filme-section">
                <h2>{t('mainCast')}</h2>

                {elenco.length === 0 ? (
                    <p className="filme-status">{t('noCast')}</p>
                ) : (
                    <div className="elenco-horizontal">
                        {elenco.map((ator) => (
                            <Link
                                to={`/pessoas/${ator.id}`}
                                className="ator-card-horizontal"
                                key={ator.id}
                            >
                                <div className="ator-foto-wrapper-horizontal">
                                    <img
                                        src={
                                            ator.profile_path
                                                ? `https://image.tmdb.org/t/p/w185${ator.profile_path}`
                                                : '/flogo.png'
                                        }
                                        alt={ator.name}
                                        className="ator-foto-horizontal"
                                    />
                                </div>

                                <div className="ator-info-horizontal">
                                    <h3>{ator.name}</h3>
                                    <p>{ator.character || '—'}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>

            <section className="filme-section">
                <h2>{t('trailer')}</h2>

                {trailer ? (
                    <div className="trailer-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={`${t('trailer')} ${filme.title}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className="filme-status">{t('noTrailer')}</p>
                )}
            </section>

            <section className="reviews-section">
                <h2>Avaliações</h2>

                <ReviewForm onSubmit={enviarCritica} />

                <h3 className="user-aval">Avaliações dos Utilizadores</h3>

                <ReviewCard
                    titulo="Um clássico absoluto"
                    autor="joaosilva22"
                    texto="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    nota={8}
                />
            </section>
        </div>
    );
}

export default FilmeDetalhe;