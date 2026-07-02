import './ReviewForm.css';
import { useState } from 'react';
import { adicionarReview } from '../services/reviewService';

function ReviewForm({ contentId, contentType, onReviewAdicionada }) {
    const [titulo, setTitulo] = useState('');
    const [nota, setNota] = useState(5);
    const [comentario, setComentario] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');
    const [sucesso, setSucesso] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErro('');
        setSucesso('');

        try {
            await adicionarReview(titulo, nota, comentario, contentId, contentType);
            
            // limpa o formulario
            setTitulo('');
            setNota(5);
            setComentario('');
            
            // chama esta prop para que o componente pai recarregue as reviews, se necessario
            if (onReviewAdicionada) onReviewAdicionada(); 
            
            setSucesso('Avaliação submetida com sucesso!');
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="review-form">
            <h3>Sua avaliação</h3>
            {erro && <p role="alert" style={{color: 'red'}}>{erro}</p>}
            {sucesso && <p role="status" style={{color: 'green'}}>{sucesso}</p>}

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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'A submeter...' : 'Submeter'}
                </button>
            </div>
        </form>
    )
}
export default ReviewForm;