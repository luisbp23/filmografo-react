import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';

function Header() {
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    useEffect(() => {
        if (location.pathname === '/') {
            setSearchText('');
        }
    }, [location.pathname]);

    function handleSearchSubmit(event) {
        event.preventDefault();

        const termo = searchText.trim();

        if (termo === '') {
            return;
        }

        navigate(`/pesquisa?query=${encodeURIComponent(termo)}`);
    }

    return (
        <header className="header">
            <Link to="/" className="header-brand">
                <span className="header-brand-text">Filmógrafo</span>

                <div className="header-logo">
                    <img className="brand-logo-normal" src="/flogo.png" alt="Logótipo Filmógrafo" />
                    <img className="brand-logo-hover" src="/flogo_amarelo.png" alt="Logótipo Filmógrafo" />
                </div>
            </Link>

            <div className="header-main">
                <form className="search-bar" onSubmit={handleSearchSubmit}>
                    <button
                        type="submit"
                        className="search-icon-button"
                        aria-label={t('searchPlaceholder')}
                    >
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>

                    <input
                        type="text"
                        placeholder={t('searchPlaceholder')}
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                    />
                </form>

                <div className="header-icons">
                    <LanguageSwitcher />

                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M6 12H18M12 6V18"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>

                    <svg width="56" height="56" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                    </svg>
                </div>
            </div>
        </header>
    );
}

export default Header;