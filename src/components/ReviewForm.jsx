import './ReviewForm.css';
import { useState } from 'react';

function ReviewForm({ onSubmit }) {
    const [titulo, setTitulo] = useState('');
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ titulo, nota, comentario });
        setTitulo('');
        setNota(5);
        setComentario('');
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Sua avaliação</h3>

            {/* titulo */}
            <div className="mb-3">
                <label htmlFor='titulo' className="form-label">Título</label>
                <input
                    type="text"
                    id='titulo'
                    className="form-control"
                    placeholder="Dê um título à sua crítica..."
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    required
                />
            </div>

            {/* nota e critica */}
            <div className="d-flex gap-4">
                <div className="text-center">
                    <label className="form-label">Classificação</label>
                    <div className="circulo-nota-grande">{nota}</div>
                    <input
                        type="range"
                        id='nota'
                        aria-label='Classificação da crítica de 1 a 10'
                        className="form-range"
                        min="1"
                        max="10"
                        step="1"
                        value={nota}
                        onChange={(e) => setNota(parseFloat(e.target.value))}
                    />
                </div>

                <div className="flex-grow-1">
                    <label htmlFor='critica' className="form-label">Crítica</label>
                    <textarea
                        className="form-control"
                        id='critica'
                        rows="4"
                        placeholder="Escreva a sua crítica..."
                        value={comentario}
                        onChange={(e) => setComentario(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="text-end mt-3">
                <button type="submit" className="btn btn-primary">Submeter</button>
            </div>
        </form>
    )
}
export default ReviewForm;