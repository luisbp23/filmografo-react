import './ReportForm.css';
import { useEffect, useRef, useState } from 'react';

const MOTIVOS_DENUNCIA = [
    { value: '', label: 'Selecione um motivo...' },
    { value: 'spam', label: 'Spam' },
    { value: 'ofensivo', label: 'Conteúdo ofensivo' },
    { value: 'assedio', label: 'Assédio ou bullying' },
    { value: 'discurso_odio', label: 'Discurso de ódio' },
    { value: 'informacao_falsa', label: 'Informação falsa' },
    { value: 'conteudo_impropio', label: 'Conteúdo impróprio/adulto' },
    { value: 'outro', label: 'Outro' },
];

function ReportForm({ onSubmit, onClose }) {
    const [motivo, setMotivo] = useState('');
    const [descricao, setDescricao] = useState('');

    const modalRef = useRef(null);
    const closeButtonRef = useRef(null);
    const elementoAnteriorRef = useRef(null);

    // guarda o elemento que tinha o foco antes de abrir, foca o modal,
    // e devolve o foco a esse elemento quando o modal fechar
    useEffect(() => {
        elementoAnteriorRef.current = document.activeElement;
        closeButtonRef.current?.focus();

        return () => {
            elementoAnteriorRef.current?.focus?.();
        };
    }, []);

    // fecha com Esc e mantem o Tab a circular dentro do modal (focus trap)
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onClose();
                return;
            }

            if (e.key === 'Tab' && modalRef.current) {
                const focaveis = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                if (focaveis.length === 0) return;

                const primeiro = focaveis[0];
                const ultimo = focaveis[focaveis.length - 1];

                if (e.shiftKey && document.activeElement === primeiro) {
                    e.preventDefault();
                    ultimo.focus();
                } else if (!e.shiftKey && document.activeElement === ultimo) {
                    e.preventDefault();
                    primeiro.focus();
                }
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ motivo, descricao });
        setMotivo('');
        setDescricao('');
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onClose(); // fecha se clicar no overlay
        }
    }

    return (
        <div className="denuncia-overlay" onClick={handleOverlayClick}>
            <div
                className="denuncia-modal"
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="denuncia-titulo"
            >
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="mb-0" id="denuncia-titulo">Denunciar conteúdo</h3>
                    <button
                        type="button"
                        className="btn-close"
                        aria-label="Fechar"
                        onClick={onClose}
                        ref={closeButtonRef}
                    />
                </div>

                <form onSubmit={handleSubmit} className="denuncia-form">
                    {/* motivo */}
                    <div className="mb-3">
                        <label htmlFor="motivo" className="form-label">Motivo</label>
                        <select
                            id="motivo"
                            className="form-select"
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            required
                        >
                            {MOTIVOS_DENUNCIA.map((opcao) => (
                                <option key={opcao.value} value={opcao.value} disabled={opcao.value === ''}>
                                    {opcao.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* descricao */}
                    <div className="mb-3">
                        <label htmlFor="descricao" className="form-label">Descrição</label>
                        <textarea
                            className="form-control"
                            id="descricao"
                            rows="4"
                            placeholder="Descreva o motivo da denúncia com mais detalhe..."
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />
                    </div>

                    <div className="text-end mt-3 d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-danger">
                            Submeter denúncia
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default ReportForm;