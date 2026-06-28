import './Home.css'
import { useState, useEffect } from 'react';
import { getFilmesTendenciasHoje } from '../services/tmdb';
import { getFilmesTendenciasSemana } from '../services/tmdb';
import { getFilmesPopulares } from '../services/tmdb';
import Card from "../components/Card";

function Home() {
    const [filmes, setFilmes] = useState([]);

    useEffect(() => {
        getFilmesPopulares().then(dados => setFilmes(dados));
    }, []);

    return (
        <div className='home'>
            <h1 className='title'>Bem-vindo(a) ao Filmógrafo!</h1>
            <p>Explore um catálogo de centenas de filmes e séries de todo o mundo.</p>



            <h2 className='title'>Populares</h2>
            <p>Mais vistos de sempre</p>
            <div className="cards-container">
                {filmes.map(filme => (
                    <Card
                        key={filme.id} // identificador do card interno do React
                        id={filme.id}
                        titulo={filme.title}
                        imagem={`https://image.tmdb.org/t/p/w200${filme.poster_path}`}
                        date={filme.release_date}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home;