import './Card.css';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';

function Card({ id, titulo, imagem, date, link, subtitulo }) {
    const { locale } = useLanguage();

    const dataValida = date && !Number.isNaN(new Date(date).getTime());

    const dataFormatada = dataValida
        ? new Date(date).toLocaleDateString(locale, {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
          })
        : null;

    return (
        <article className="movie-card">
            <Link to={link || `/filmes/${id}`} className="movie-card-link">
                <div className="movie-card-image-wrapper">
                    <img
                        src={imagem}
                        className="movie-card-img"
                        alt={titulo}
                    />
                </div>

                <div className="movie-card-info">
                    <h3 className="movie-card-title">{titulo}</h3>

                    {subtitulo && (
                        <p className="movie-card-date">{subtitulo}</p>
                    )}

                    {!subtitulo && dataFormatada && (
                        <p className="movie-card-date">{dataFormatada}</p>
                    )}
                </div>
            </Link>
        </article>
    );
}

export default Card;