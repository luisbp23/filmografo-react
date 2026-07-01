import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    listarMeusPedidos,
    removerPedidoConteudo
} from '../../services/contentService';
import { useLanguage } from '../../i18n/LanguageContext';
import './MeusPedidos.css';

function MeusPedidos() {
    const { t, language } = useLanguage();

    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    const localText = {
        removeRequest: language === 'en' ? 'Remove request' : 'Remover pedido',
        confirmRemove: language === 'en'
            ? 'Are you sure you want to remove this pending request?'
            : 'Tens a certeza que queres remover este pedido pendente?',
        removeError: language === 'en'
            ? 'It was not possible to remove this request.'
            : 'Não foi possível remover este pedido.',
        removing: language === 'en' ? 'Removing...' : 'A remover...'
    };

    useEffect(() => {
        async function carregarPedidos() {
            try {
                setLoading(true);
                setErro('');

                const dados = await listarMeusPedidos();
                setPedidos(dados || []);
            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        }

        carregarPedidos();
    }, []);

    async function handleRemoverPedido(id) {
        const confirmar = window.confirm(localText.confirmRemove);

        if (!confirmar) {
            return;
        }

        try {
            setDeletingId(id);
            setErro('');

            await removerPedidoConteudo(id);

            setPedidos((pedidosAtuais) =>
                pedidosAtuais.filter((pedido) => pedido.id !== id)
            );
        } catch (error) {
            setErro(error.message || localText.removeError);
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="meus-pedidos-page">
            <div className="meus-pedidos-header">
                <h1>{t('myRequests')}</h1>
            </div>

            {loading && <p>{t('loading')}</p>}
            {erro && <p className="pedido-error">{erro}</p>}

            {!loading && !erro && pedidos.length === 0 && (
                <p>{t('noRequests')}</p>
            )}

            {!loading && !erro && pedidos.length > 0 && (
                <div className="pedidos-lista">
                    {pedidos.map((pedido) => (
                        <article className="pedido-card" key={pedido.id}>
                            <div className="pedido-imagem-wrapper">
                                <img
                                    src={pedido.imageurl || '/flogo.png'}
                                    alt={pedido.title}
                                    className="pedido-imagem"
                                    onError={(event) => {
                                        event.currentTarget.src = '/flogo.png';
                                    }}
                                />
                            </div>

                            <div className="pedido-info">
                                <div className="pedido-topo">
                                    <h2>{pedido.title}</h2>
                                    <span className={`status-badge ${pedido.status}`}>
                                        {t(pedido.status)}
                                    </span>
                                </div>

                                <p>
                                    <strong>{t('type')}:</strong>{' '}
                                    {pedido.type === 'series' ? t('series') : t('movie')}
                                </p>

                                {pedido.genre && (
                                    <p>
                                        <strong>{t('genre')}:</strong> {pedido.genre}
                                    </p>
                                )}

                                {pedido.synopsis && (
                                    <p className="pedido-sinopse">{pedido.synopsis}</p>
                                )}

                                {pedido.status === 'pending' && (
                                    <div className="pedido-actions">
                                        <Link
                                            to={`/editar-conteudo/${pedido.id}`}
                                            className="editar-pedido-btn"
                                        >
                                            {t('editRequest')}
                                        </Link>

                                        <button
                                            type="button"
                                            className="remover-pedido-btn"
                                            onClick={() => handleRemoverPedido(pedido.id)}
                                            disabled={deletingId === pedido.id}
                                        >
                                            {deletingId === pedido.id
                                                ? localText.removing
                                                : localText.removeRequest}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MeusPedidos;