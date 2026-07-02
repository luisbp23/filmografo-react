import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { getFilmesPopulares } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import '../Catalogo.css';

function Filmes() {
    const [filmes, setFilmes] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    useEffect(() => {
        async function carregarFilmes() {
            setLoading(true);
            const dados = await getFilmesPopulares();
            setFilmes(dados || []);
            setLoading(false);
        }

        carregarFilmes();
    }, [language]);

    return (
        <div className="catalogo-page">
            <h1>{t('movies')}</h1>
            <p>{t('popular')}</p>

            {loading ? (
                <p className="catalogo-status">{t('loading')}</p>
            ) : filmes.length === 0 ? (
                <p className="catalogo-status">{t('noResults')}</p>
            ) : (
                <div className="catalogo-grid">
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
                            link={`/filmes/${filme.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Filmes;