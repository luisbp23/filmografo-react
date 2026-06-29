import { useEffect, useState } from 'react';
import Card from './Card';
import {
    getFilmesTendenciasHoje,
    getFilmesTendenciasSemana
} from '../services/tmdb';
import './TrendingSection.css';
import { useLanguage } from '../i18n/LanguageContext';

function TrendingSection() {
    const [periodo, setPeriodo] = useState('hoje');
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const { t, language } = useLanguage();

    useEffect(() => {
        async function carregarTendencias() {
            try {
                setLoading(true);
                setErro('');

                const dados =
                    periodo === 'hoje'
                        ? await getFilmesTendenciasHoje()
                        : await getFilmesTendenciasSemana();

                setFilmes(dados || []);
            } catch (error) {
                console.error('Erro ao carregar tendências:', error);
                setErro(t('noResults'));
            } finally {
                setLoading(false);
            }
        }

        carregarTendencias();
    }, [periodo, language, t]);

    return (
        <section className="trending-section">
            <div className="trending-header">
                <h2>{t('trending')}</h2>

                <div className="trending-tabs">
                    <button
                        type="button"
                        className={periodo === 'hoje' ? 'active' : ''}
                        onClick={() => setPeriodo('hoje')}
                    >
                        {t('today')}
                    </button>

                    <button
                        type="button"
                        className={periodo === 'semana' ? 'active' : ''}
                        onClick={() => setPeriodo('semana')}
                    >
                        {t('thisWeek')}
                    </button>
                </div>
            </div>

            {loading && <p>{t('loading')}</p>}

            {erro && <p className="trending-error">{erro}</p>}

            {!loading && !erro && filmes.length === 0 && (
                <p className="trending-error">{t('noResults')}</p>
            )}

            {!loading && !erro && filmes.length > 0 && (
                <div className="trending-cards">
                    {filmes.map((filme) => (
                        <Card
                            key={filme.id}
                            id={filme.id}
                            titulo={filme.title}
                            imagem={
                                filme.poster_path
                                    ? `https://image.tmdb.org/t/p/w185${filme.poster_path}`
                                    : '/flogo.png'
                            }
                            date={filme.release_date}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}

export default TrendingSection;