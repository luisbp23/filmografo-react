const BASE_URL = process.env.REACT_APP_TMDB_URL;
const API_KEY = process.env.REACT_APP_TMDB_KEY;

function getApiLanguage() {
    const language = localStorage.getItem('filmografo-language') || 'pt';
    return language === 'en' ? 'en-US' : 'pt-PT';
}

async function fetchTMDB(endpoint, params = {}, returnsResults = true) {
    if (!BASE_URL || !API_KEY) {
        console.error("Erro: variáveis de ambiente TMDB não configuradas.");
        return returnsResults ? [] : null;
    }

    try {
        const queryParams = new URLSearchParams({
            api_key: API_KEY,
            language: getApiLanguage(),
            ...params
        });

        const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (!resposta.ok) {
            console.error("Erro da API TMDB:", dados);
            return returnsResults ? [] : null;
        }

        return returnsResults ? dados.results || [] : dados;
    } catch (erro) {
        console.error("Erro ao ligar à TMDB:", erro);
        return returnsResults ? [] : null;
    }
}

export async function getFilmesPopulares() {
    return fetchTMDB('/movie/popular');
}

export async function getSeriesPopulares() {
    return fetchTMDB('/tv/popular');
}

export async function getPessoasPopulares() {
    return fetchTMDB('/person/popular');
}

export async function getFilmesTendenciasHoje() {
    return fetchTMDB('/trending/movie/day');
}

export async function getFilmesTendenciasSemana() {
    return fetchTMDB('/trending/movie/week');
}

export async function pesquisarConteudo(termo) {
    if (!termo || termo.trim() === '') {
        return [];
    }

    return fetchTMDB('/search/multi', {
        query: termo.trim(),
        include_adult: 'false'
    });
}

export async function getFilmeDetalhe(id) {
    return fetchTMDB(
        `/movie/${id}`,
        {
            append_to_response: 'credits,videos'
        },
        false
    );
}

export async function getSerieDetalhe(id) {
    return fetchTMDB(
        `/tv/${id}`,
        {
            append_to_response: 'credits,videos'
        },
        false
    );
}

export async function getPessoaDetalhe(id) {
    return fetchTMDB(
        `/person/${id}`,
        {
            append_to_response: 'combined_credits'
        },
        false
    );
}