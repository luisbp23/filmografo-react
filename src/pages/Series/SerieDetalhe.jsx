import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getSerieDetalhe } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import './SerieDetalhe.css';

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
                    setErro(t('noResults'));
                    return;
                }

                setSerie(dados);
            } catch (error) {
                console.error('Erro ao carregar detalhe da série:', error);
                setErro(t('noResults'));
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
                    {t('back')}
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

    const generos =
        serie.genres?.length > 0
            ? serie.genres.map((genero) => genero.name).join(', ')
            : t('unknownGenre');

    const avaliacao = serie.vote_average
        ? serie.vote_average.toFixed(1)
        : 'N/A';

    const estado = serie.status || '—';
    const temporadas = serie.number_of_seasons || 0;
    const episodios = serie.number_of_episodes || 0;

    const elenco = serie.credits?.cast?.slice(0, 10) || [];

    return (
        <div className="serie-detalhe-page">
            <button
                type="button"
                className="serie-voltar-btn"
                onClick={() => navigate(-1)}
            >
                ← {t('back')}
            </button>

            <section className="serie-resumo">
                <div className="serie-poster-wrapper">
                    <img
                        src={poster}
                        alt={`Poster de ${serie.name}`}
                        className="serie-poster"
                    />
                </div>

                <div className="serie-info-principal">
                    <h1 className="serie-titulo">
                        {serie.name} {ano && <span>({ano})</span>}
                    </h1>

                    <div className="serie-meta">
                        <p><strong>{t('firstAirDate')}:</strong> {dataFormatada}</p>
                        <p><strong>{t('status')}:</strong> {estado}</p>
                        <p><strong>{t('seasons')}:</strong> {temporadas}</p>
                        <p><strong>{t('episodes')}:</strong> {episodios}</p>
                        <p><strong>{t('genres')}:</strong> {generos}</p>
                        <p><strong>{t('tmdbRating')}:</strong> {avaliacao}/10</p>
                    </div>

                    <div className="serie-sinopse">
                        <h2>{t('synopsis')}</h2>
                        <p>
                            {serie.overview || t('noSynopsisSeries')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="serie-section">
                <h2>{t('actors')}</h2>

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
        </div>
    );
}

export default SerieDetalhe;