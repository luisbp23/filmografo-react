import { Link, useNavigate, useParams } from 'react-router-dom';
import ContentForm from '../../components/ContentForm';
import { criarPedidoConteudo } from '../../services/contentService';
import { useLanguage } from '../../i18n/LanguageContext';
import './AdicionarConteudo.css';

function AdicionarConteudo() {
    const { tipo } = useParams();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const mediaType = tipo === 'serie' ? 'series' : 'movie';

    const tituloPagina =
        mediaType === 'series'
            ? t('addSeriesTitle')
            : t('addMovieTitle');

    async function handleSubmit(formData) {
        try {
            await criarPedidoConteudo({
                ...formData,
                type: mediaType
            });

            navigate('/meus-pedidos', {
                state: {
                    success: t('requestCreatedSuccess')
                }
            });
        } catch (error) {
            alert(error.message);
        }
    }

    return (
        <div className="adicionar-page">
            <Link to="/meus-pedidos" className="meus-pedidos-link">
                {t('myRequests')}
            </Link>

            <section className="adicionar-card">
                <h1>{tituloPagina}</h1>
                <p>{t('addContentText')}</p>

                <ContentForm
                    type={mediaType}
                    onSubmit={handleSubmit}
                    submitLabel={t('sendRequest')}
                />
            </section>
        </div>
    );
}

export default AdicionarConteudo;