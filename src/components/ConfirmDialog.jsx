import './ConfirmDialog.css';
import { useEffect, useRef } from 'react';

function ConfirmDialog({ titulo, mensagem, confirmarTexto = 'Confirmar', cancelarTexto = 'Cancelar', onConfirmar, onCancelar, perigo = false }) {
    const modalRef = useRef(null);
    const confirmarButtonRef = useRef(null);
    const elementoAnteriorRef = useRef(null);

    // guarda o elemento com foco antes de abrir, foca o modal,
    // e devolve o foco a esse elemento ao fechar
    useEffect(() => {
        elementoAnteriorRef.current = document.activeElement;
        confirmarButtonRef.current?.focus();

        return () => {
            elementoAnteriorRef.current?.focus?.();
        };
    }, []);

    // fecha com Esc e mantém o Tab a circular dentro do modal (focus trap)
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                onCancelar();
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
    }, [onCancelar]);

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onCancelar();
        }
    }

    return (
        <div className="confirm-overlay" onClick={handleOverlayClick}>
            <div
                className="confirm-modal"
                ref={modalRef}
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-titulo"
                aria-describedby="confirm-mensagem"
            >
                <h3 id="confirm-titulo">{titulo}</h3>
                <p id="confirm-mensagem">{mensagem}</p>

                <div className="confirm-acoes">
                    <button type="button" className="confirm-cancelar" onClick={onCancelar}>
                        {cancelarTexto}
                    </button>
                    <button
                        type="button"
                        className={`confirm-confirmar ${perigo ? 'confirm-perigo' : ''}`}
                        onClick={onConfirmar}
                        ref={confirmarButtonRef}
                    >
                        {confirmarTexto}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;