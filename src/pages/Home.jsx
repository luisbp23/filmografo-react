import './Home.css';
import { useState, useEffect } from 'react';
import { getFilmesPopulares } from '../services/tmdb';
import Card from "../components/Card";
import TrendingSection from '../components/TrendingSection';
import { useLanguage } from '../i18n/LanguageContext';
import { supabase } from '../services/supabaseClient';

function Home() {
    const [filmes, setFilmes] = useState([]);
    const [comunidade, setComunidade] = useState([]);
    const { t, language } = useLanguage();

    useEffect(() => {
        getFilmesPopulares().then(dados => setFilmes(dados));
    }, [language]);

    useEffect(() => {
        async function carregarComunidade() {
            const { data } = await supabase
                .from('content')
                .select('*')
                .eq('status', 'approved')
                .order('created_at', { ascending: false });
            setComunidade(data ?? []);
        }
        carregarComunidade();
    }, []);

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

            {comunidade.length > 0 && (
                <div className="comunidade-section">
                    <h2 className='title'>Adicionado pela Comunidade</h2>
                    <p>Conteúdo sugerido e aprovado pelos utilizadores</p>

                    <div className="cards-container">
                        {comunidade.map(item => (
                            <Card
                                key={item.id}
                                id={item.id}
                                titulo={item.title}
                                imagem={item.imageurl || '/flogo.png'}
                                date={item.state}
                                tipo={item.type}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;