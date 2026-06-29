import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { getSeriesPopulares } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import '../Catalogo.css';

function Series() {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    useEffect(() => {
        async function carregarSeries() {
            setLoading(true);
            const dados = await getSeriesPopulares();
            setSeries(dados || []);
            setLoading(false);
        }

        carregarSeries();
    }, [language]);

    return (
        <div className="catalogo-page">
            <h1>{t('series')}</h1>
            <p>{t('popular')}</p>

            {loading ? (
                <p className="catalogo-status">{t('loading')}</p>
            ) : (
                <div className="catalogo-grid">
                    {series.map((serie) => (
                        <Card
                            key={serie.id}
                            id={serie.id}
                            titulo={serie.name}
                            imagem={
                                serie.poster_path
                                    ? `https://image.tmdb.org/t/p/w185${serie.poster_path}`
                                    : '/flogo.png'
                            }
                            date={serie.first_air_date}
                            link={`/series/${serie.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Series;