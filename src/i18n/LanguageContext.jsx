import { createContext, useContext, useMemo, useState } from 'react';

const translations = {
    pt: {
        // Header / Navegação
        searchPlaceholder: 'Pesquisar...',
        movies: 'Filmes',
        series: 'Séries',
        people: 'Pessoas',

        // Home
        welcomeTitle: 'Bem-vindo(a) ao Filmógrafo!',
        welcomeSubtitle: 'Explore um catálogo de centenas de filmes e séries de todo o mundo.',
        trending: 'Tendências',
        today: 'Hoje',
        thisWeek: 'Esta Semana',
        popular: 'Populares',
        mostViewed: 'Mais vistos de sempre',

        // Pesquisa
        searchResults: 'Resultados de pesquisa',
        searchFor: 'Pesquisa por',
        all: 'Todos',
        movie: 'Filme',
        tv: 'Série',
        person: 'Pessoa',

        // Estados gerais
        loading: 'A carregar...',
        noResults: 'Não foram encontrados resultados.',
        back: 'Voltar',

        // Detalhes de Filme
        releaseDate: 'Data de lançamento',
        duration: 'Duração',
        genres: 'Géneros',
        tmdbRating: 'Avaliação TMDB',
        synopsis: 'Sinopse',
        actors: 'Atores e Atrizes',
        trailer: 'Trailer',
        noTrailer: 'Não existe trailer disponível.',
        unknownDate: 'Data desconhecida',
        unknownGenre: 'Género desconhecido',
        unknownDuration: 'Duração desconhecida',
        noSynopsisMovie: 'Este filme ainda não tem sinopse disponível.',
        noCast: 'Não existe elenco disponível.',

        // Detalhes de Série
        firstAirDate: 'Data de estreia',
        status: 'Estado',
        seasons: 'Temporadas',
        episodes: 'Episódios',
        noSynopsisSeries: 'Esta série ainda não tem sinopse disponível.',

        // Detalhes de Pessoa
        knownFor: 'Conhecido por',
        birthDate: 'Data de nascimento',
        deathDate: 'Data de falecimento',
        birthPlace: 'Local de nascimento',
        biography: 'Biografia',
        noBiography: 'Ainda não existe biografia disponível para esta pessoa.',
        noKnownWorks: 'Não existem filmes ou séries disponíveis.',
        unknownPlace: 'Local desconhecido',
        unknownInfo: 'Informação desconhecida',

        // Catálogo
        catalogMoviesSubtitle: 'Filmes populares',
        catalogSeriesSubtitle: 'Séries populares',
        catalogPeopleSubtitle: 'Pessoas populares',

        // Mensagens de erro
        movieDetailsError: 'Não foi possível carregar os detalhes deste filme.',
        seriesDetailsError: 'Não foi possível carregar os detalhes desta série.',
        personDetailsError: 'Não foi possível carregar os detalhes desta pessoa.',
        searchError: 'Não foi possível carregar os resultados da pesquisa.',
        trendingError: 'Não foi possível carregar as tendências neste momento.',

        // Footer
        academicYear: 'TWAM - 2026'
    },

    en: {
        // Header / Navigation
        searchPlaceholder: 'Search...',
        movies: 'Movies',
        series: 'Series',
        people: 'People',

        // Home
        welcomeTitle: 'Welcome to Filmógrafo!',
        welcomeSubtitle: 'Explore a catalogue of hundreds of movies and series from around the world.',
        trending: 'Trending',
        today: 'Today',
        thisWeek: 'This Week',
        popular: 'Popular',
        mostViewed: 'Most viewed',

        // Search
        searchResults: 'Search results',
        searchFor: 'Search for',
        all: 'All',
        movie: 'Movie',
        tv: 'Series',
        person: 'Person',

        // General states
        loading: 'Loading...',
        noResults: 'No results found.',
        back: 'Back',

        // Movie details
        releaseDate: 'Release date',
        duration: 'Duration',
        genres: 'Genres',
        tmdbRating: 'TMDB rating',
        synopsis: 'Overview',
        actors: 'Cast',
        trailer: 'Trailer',
        noTrailer: 'No trailer available.',
        unknownDate: 'Unknown date',
        unknownGenre: 'Unknown genre',
        unknownDuration: 'Unknown duration',
        noSynopsisMovie: 'This movie does not have an overview yet.',
        noCast: 'No cast available.',

        // Series details
        firstAirDate: 'First air date',
        status: 'Status',
        seasons: 'Seasons',
        episodes: 'Episodes',
        noSynopsisSeries: 'This series does not have an overview yet.',

        // Person details
        knownFor: 'Known for',
        birthDate: 'Birth date',
        deathDate: 'Death date',
        birthPlace: 'Place of birth',
        biography: 'Biography',
        noBiography: 'There is no biography available for this person yet.',
        noKnownWorks: 'There are no movies or series available.',
        unknownPlace: 'Unknown place',
        unknownInfo: 'Unknown information',

        // Catalogue
        catalogMoviesSubtitle: 'Popular movies',
        catalogSeriesSubtitle: 'Popular series',
        catalogPeopleSubtitle: 'Popular people',

        // Error messages
        movieDetailsError: 'It was not possible to load this movie details.',
        seriesDetailsError: 'It was not possible to load this series details.',
        personDetailsError: 'It was not possible to load this person details.',
        searchError: 'It was not possible to load the search results.',
        trendingError: 'It was not possible to load trending content right now.',

        // Footer
        academicYear: 'TWAM - 2026'
    }
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
    const [language, setLanguageState] = useState(() => {
        return localStorage.getItem('filmografo-language') || 'pt';
    });

    function setLanguage(newLanguage) {
        localStorage.setItem('filmografo-language', newLanguage);
        setLanguageState(newLanguage);
    }

    const value = useMemo(() => {
        function t(key) {
            return translations[language]?.[key] || translations.pt[key] || key;
        }

        const locale = language === 'en' ? 'en-GB' : 'pt-PT';
        const tmdbLanguage = language === 'en' ? 'en-US' : 'pt-PT';

        return {
            language,
            setLanguage,
            t,
            locale,
            tmdbLanguage
        };
    }, [language]);

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
    }

    return context;
}