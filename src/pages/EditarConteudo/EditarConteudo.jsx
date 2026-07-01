import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
import {
    atualizarPedidoConteudo,
    buscarPedidoConteudo
} from '../../services/contentService';
import { useLanguage } from '../../i18n/LanguageContext';
import './EditarConteudo.css';

function EditarConteudo() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        async function carregarPedido() {
            try {
                setLoading(true);
                setErro('');

                const dados = await buscarPedidoConteudo(id);

                if (dados.status !== 'pending') {
                    setErro(t('onlyPendingCanBeEdited'));
                    return;
                }

                setPedido(dados);
            } catch (error) {
                setErro(error.message);
            } finally {
                setLoading(false);
            }
        }

        carregarPedido();
    }, [id, t]);

    async function handleSubmit(formData) {
        try {
            await atualizarPedidoConteudo(id, formData);

            navigate('/meus-pedidos', {
                state: {
                    success: t('requestUpdatedSuccess')
                }
            });
        } catch (error) {
            alert(error.message);
        }
    }

    if (loading) {
        return (
            <div className="editar-page">
                <p>{t('loading')}</p>
            </div>
        );
    }

    if (erro) {
        return (
            <div className="editar-page">
                <p className="editar-error">{erro}</p>
            </div>
        );
    }

    if (!pedido) {
        return null;
    }

    return (
        <div className="editar-page">
            <section className="editar-card">
                <h1>{t('editRequest')}</h1>

                <ContentForm
                    initialData={pedido}
                    type={pedido.type}
                    onSubmit={handleSubmit}
                    submitLabel={t('saveChanges')}
                />
            </section>
        </div>
    );
}

export default EditarConteudo;