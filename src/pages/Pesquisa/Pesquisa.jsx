import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { pesquisarConteudo } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import './Pesquisa.css';

function Pesquisa() {
    const location = useLocation();
    const query = new URLSearchParams(location.search).get('query') || '';

    const [resultados, setResultados] = useState([]);
    const [tipoSelecionado, setTipoSelecionado] = useState('todos');
    const [anoSelecionado, setAnoSelecionado] = useState('todos');
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
                setAnoSelecionado('todos');

                const dados = await pesquisarConteudo(query);

                const dadosFiltrados = dados.filter((item) =>
                    item.media_type === 'movie' ||
                    item.media_type === 'tv' ||
                    item.media_type === 'person'
                );

                setResultados(dadosFiltrados);
            } catch (error) {
                console.error('Erro ao pesquisar:', error);
                setErro(t('searchError'));
            } finally {
                setLoading(false);
            }
        }

        carregarResultados();
    }, [query, language, t]);

    function getAno(item) {
        const data = item.release_date || item.first_air_date;

        if (!data) {
            return null;
        }

        return new Date(data).getFullYear();
    }

    const anosDisponiveis = useMemo(() => {
        const anos = resultados
            .map((item) => getAno(item))
            .filter(Boolean);

        return [...new Set(anos)].sort((a, b) => b - a);
    }, [resultados]);

    const resultadosFiltrados = useMemo(() => {
        return resultados.filter((item) => {
            const passaTipo =
                tipoSelecionado === 'todos' ||
                item.media_type === tipoSelecionado;

            const anoItem = getAno(item);

            const passaAno =
                anoSelecionado === 'todos' ||
                Number(anoSelecionado) === anoItem;

            return passaTipo && passaAno;
        });
    }, [resultados, tipoSelecionado, anoSelecionado]);

    return (
        <div className="pesquisa-page">
            <aside className="pesquisa-sidebar">
                <h2>{t('filters')}</h2>

                <div className="pesquisa-filtros-card">
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

                    <div className="pesquisa-filtro-linha" />

                    <label htmlFor="ano">{t('year')}</label>

                    <select
                        id="ano"
                        value={anoSelecionado}
                        onChange={(event) => setAnoSelecionado(event.target.value)}
                    >
                        <option value="todos">{t('all')}</option>

                        {anosDisponiveis.map((ano) => (
                            <option key={ano} value={ano}>
                                {ano}
                            </option>
                        ))}
                    </select>
                </div>
            </aside>

            <main className="pesquisa-conteudo">
                <h1>
                    {t('resultsFor')} <strong>"{query}"</strong>
                </h1>

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
            </main>
        </div>
    );
}

function ResultadoPesquisaCard({ item, t, locale }) {
    const tipo = item.media_type;

    const titulo = item.title || item.name || 'Sem título';
    const descricao =
        item.overview ||
        item.known_for_department ||
        t('noSynopsisAvailable');

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