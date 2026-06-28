import './Card.css'
import { Link } from 'react-router-dom';

function Card(props) {
    return (
        <Link to={`/filmes/${props.id}`} className="text-decoration-none">
        <div className="card">
            <img src={props.imagem} className="card-img" alt={props.titulo} />
            <div className="card-body">
                <h5 className="card-title">{props.titulo}</h5>
                <p className="card-text">{props.date?.slice(0, 4)}</p>
            </div>
        </div>
        </Link>
    )
}

export default Card;