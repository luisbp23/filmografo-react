import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSerieDetalhe } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import './SerieDetalhe.css';
import ReviewForm from '../../components/ReviewForm';
import ReviewCard from '../../components/ReviewCard';

function SerieDetalhe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, language, locale } = useLanguage();

    const [serie, setSerie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarSerie() {
            try {
                setLoading(true);
                setErro('');

                const dados = await getSerieDetalhe(id);

                if (!dados) {
                    setErro(t('seriesDetailsError'));
                    return;
                }

                setSerie(dados);
            } catch (error) {
                console.error('Erro ao carregar detalhe da série:', error);
                setErro(t('seriesDetailsError'));
            } finally {
                setLoading(false);
            }
        }

        carregarSerie();
    }, [id, language, t]);

    const trailer = useMemo(() => {
        if (!serie?.videos?.results) {
            return null;
        }

        return serie.videos.results.find(
            (video) => video.site === 'YouTube' && video.type === 'Trailer'
        );
    }, [serie]);

    function enviarCritica(dados) {
        console.log(dados);
    }

    if (loading) {
        return (
            <div className="serie-detalhe-page">
                <p className="serie-status">{t('loading')}</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="serie-detalhe-page">
                <p className="serie-erro">{erro}</p>

                <button
                    type="button"
                    className="serie-voltar-btn"
                    onClick={() => navigate(-1)}
                >
                    ← {t('back')}
                </button>
            </div>
        );
    }

    if (!serie) {
        return null;
    }

    const poster = serie.poster_path
        ? `https://image.tmdb.org/t/p/w500${serie.poster_path}`
        : '/flogo.png';

    const ano = serie.first_air_date
        ? new Date(serie.first_air_date).getFullYear()
        : '';

    const dataFormatada = serie.first_air_date
        ? new Date(serie.first_air_date).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : t('unknownDate');

    const avaliacao = serie.vote_average
        ? serie.vote_average.toFixed(1)
        : 'N/A';

    const generos = serie.genres || [];
    const elenco = serie.credits?.cast?.slice(0, 12) || [];

    return (
        <div className="serie-detalhe-page">
            <section className="serie-layout">
                <div className="serie-poster-wrapper">
                    <img
                        src={poster}
                        alt={serie.name}
                        className="serie-poster"
                    />
                </div>

                <div className="serie-info">
                    <button
                        type="button"
                        className="serie-voltar-btn"
                        onClick={() => navigate(-1)}
                    >
                        ← {t('back')}
                    </button>

                    <h1>
                        {serie.name} {ano && <span>({ano})</span>}
                    </h1>

                    <div className="serie-generos">
                        {generos.map((genero) => (
                            <span key={genero.id}>{genero.name}</span>
                        ))}
                    </div>

                    <div className="serie-sinopse">
                        <h2>{t('synopsis')}</h2>
                        <p>{serie.overview || t('noSynopsisSeries')}</p>
                    </div>

                    <div className="serie-dados">
                        <p>
                            <strong>{t('firstAirDate')}:</strong> {dataFormatada}
                        </p>

                        <p>
                            <strong>{t('status')}:</strong> {serie.status || t('unknownInfo')}
                        </p>

                        <p>
                            <strong>{t('seasons')}:</strong> {serie.number_of_seasons || 0}
                        </p>

                        <p>
                            <strong>{t('episodes')}:</strong> {serie.number_of_episodes || 0}
                        </p>

                        <p>
                            <strong>{t('tmdbRating')}:</strong> ⭐ {avaliacao}/10
                        </p>
                    </div>
                </div>
            </section>

            <section className="serie-section">
                <h2>{t('mainCast')}</h2>

                {elenco.length === 0 ? (
                    <p className="serie-status">{t('noCast')}</p>
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

            <section className="serie-section">
                <h2>{t('trailer')}</h2>

                {trailer ? (
                    <div className="trailer-wrapper">
                        <iframe
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title={`${t('trailer')} ${serie.name}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className="serie-status">{t('noTrailer')}</p>
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

export default SerieDetalhe;