import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pesquisarConteudo } from '../../services/tmdb';
import './Pesquisa.css';
import { useLanguage } from '../../i18n/LanguageContext';

function Pesquisa() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query') || '';

    const [resultados, setResultados] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState('todos');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState('');

    const { t, language, locale } = useLanguage();

    useEffect(() => {
        async function carregarResultados() {
            if (query.trim() === '') {
                setResultados([]);
                return;
            }

            try {
                setLoading(true);
                setErro('');
                setTipoSelecionado('todos');

                const dados = await pesquisarConteudo(query);

                const dadosFiltrados = dados.filter((item) =>
                    item.media_type === 'movie' ||
                    item.media_type === 'tv' ||
                    item.media_type === 'person'
                );

                setResultados(dadosFiltrados);
            } catch (error) {
                console.error('Erro ao pesquisar:', error);
                setErro(t('noResults'));
            } finally {
                setLoading(false);
            }
        }

        carregarResultados();
    }, [query, language, t]);

    const resultadosFiltrados = useMemo(() => {
        if (tipoSelecionado === 'todos') {
            return resultados;
        }

        return resultados.filter((item) => item.media_type === tipoSelecionado);
    }, [resultados, tipoSelecionado]);

    return (
        <div className="pesquisa-page">
            <div className="pesquisa-header">
                <h1>{t('searchResults')}</h1>

                <p>
                    {t('searchFor')}: <strong>{query}</strong>
                </p>
            </div>

            <div className="pesquisa-filtros">
                <button
                    type="button"
                    className={tipoSelecionado === 'todos' ? 'active' : ''}
                    onClick={() => setTipoSelecionado('todos')}
                >
                    {t('all')}
                </button>

                <button
                    type="button"
                    className={tipoSelecionado === 'movie' ? 'active' : ''}
                    onClick={() => setTipoSelecionado('movie')}
                >
                    {t('movies')}
                </button>

                <button
                    type="button"
                    className={tipoSelecionado === 'tv' ? 'active' : ''}
                    onClick={() => setTipoSelecionado('tv')}
                >
                    {t('series')}
                </button>

                <button
                    type="button"
                    className={tipoSelecionado === 'person' ? 'active' : ''}
                    onClick={() => setTipoSelecionado('person')}
                >
                    {t('people')}
                </button>
            </div>

            {loading && <p className="pesquisa-info">{t('loading')}</p>}

            {erro && <p className="pesquisa-error">{erro}</p>}

            {!loading && !erro && resultadosFiltrados.length === 0 && (
                <p className="pesquisa-info">{t('noResults')}</p>
            )}

            {!loading && !erro && resultadosFiltrados.length > 0 && (
                <div className="pesquisa-resultados">
                    {resultadosFiltrados.map((item) => (
                        <ResultadoPesquisaCard
                            key={`${item.media_type}-${item.id}`}
                            item={item}
                            t={t}
                            locale={locale}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function ResultadoPesquisaCard({ item, t, locale }) {
    const tipo = item.media_type;

    const titulo = item.title || item.name || 'Sem título';
    const descricao = item.overview || item.known_for_department || t('noResults');
    const data = item.release_date || item.first_air_date || '';
    const imagem = item.poster_path || item.profile_path;

    const tipoLabel = {
        movie: t('movie'),
        tv: t('tv'),
        person: t('person')
    }[tipo];

    const detalhePath = {
        movie: `/filmes/${item.id}`,
        tv: `/series/${item.id}`,
        person: `/pessoas/${item.id}`
    }[tipo];

    return (
        <Link to={detalhePath} className="resultado-card">
            <div className="resultado-imagem-wrapper">
                <img
                    src={
                        imagem
                            ? `https://image.tmdb.org/t/p/w185${imagem}`
                            : '/flogo.png'
                    }
                    alt={titulo}
                    className="resultado-imagem"
                />
            </div>

            <div className="resultado-info">
                <div className="resultado-topo">
                    <h2>{titulo}</h2>
                    <span>{tipoLabel}</span>
                </div>

                {data && (
                    <p className="resultado-data">
                        {new Date(data).toLocaleDateString(locale, {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                )}

                <p className="resultado-descricao">{descricao}</p>
            </div>
        </Link>
    );
}

export default Pesquisa;