const BASE_URL = process.env.REACT_APP_TMDB_URL;
const API_KEY = process.env.REACT_APP_TMDB_KEY;

export async function getGeneros() {
  const resposta = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados.genres;
}

export async function getFilmesTendenciasHoje() {
  const resposta = await fetch(`${BASE_URL}/trending/movie/day?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados.results;
}

export async function getFilmesTendenciasSemana() {
  const resposta = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados.results;
}

export async function getFilmesPopulares() {
  const resposta = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados.results;
}

export async function getSeriesPopulares() {
  const resposta = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados.results;
}

export async function getFilmeDetalhe(id) {
  const resposta = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=pt-PT`);
  const dados = await resposta.json();
  return dados;
}