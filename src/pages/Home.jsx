import './Home.css';
import { useState, useEffect } from 'react';
import { getFilmesPopulares } from '../services/tmdb';
import Card from "../components/Card";
import TrendingSection from '../components/TrendingSection';
import { useLanguage } from '../i18n/LanguageContext';

function Home() {
    const [filmes, setFilmes] = useState([]);
    const { t, language } = useLanguage();

    useEffect(() => {
        getFilmesPopulares().then(dados => setFilmes(dados));
    }, [language]);

    return (
        <div className='home'>
            <h1 className='title'>{t('welcomeTitle')}</h1>
            <p>{t('welcomeSubtitle')}</p>

            <TrendingSection />

            <h2 className='title populares-title'>{t('popular')}</h2>
            <p>{t('mostViewed')}</p>

            <div className="cards-container">
                {filmes.map(filme => (
                    <Card
                        key={filme.id}
                        id={filme.id}
                        titulo={filme.title}
                        imagem={`https://image.tmdb.org/t/p/w185${filme.poster_path}`}
                        date={filme.release_date}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;