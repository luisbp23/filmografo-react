import { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { getPessoasPopulares } from '../../services/tmdb';
import { useLanguage } from '../../i18n/LanguageContext';
import '../Catalogo.css';

function Pessoas() {
    const [pessoas, setPessoas] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t, language } = useLanguage();

    useEffect(() => {
        async function carregarPessoas() {
            setLoading(true);
            const dados = await getPessoasPopulares();
            setPessoas(dados || []);
            setLoading(false);
        }

        carregarPessoas();
    }, [language]);

    return (
        <div className="catalogo-page">
            <h1>{t('people')}</h1>
            <p>{t('popular')}</p>

            {loading ? (
                <p className="catalogo-status">{t('loading')}</p>
            ) : (
                <div className="catalogo-grid">
                    {pessoas.map((pessoa) => (
                        <Card
                            key={pessoa.id}
                            id={pessoa.id}
                            titulo={pessoa.name}
                            imagem={
                                pessoa.profile_path
                                    ? `https://image.tmdb.org/t/p/w185${pessoa.profile_path}`
                                    : '/flogo.png'
                            }
                            subtitulo={pessoa.known_for_department}
                            link={`/pessoas/${pessoa.id}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Pessoas;