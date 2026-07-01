import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Header.css';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

function Header() {
    const [searchText, setSearchText] = useState('');
    const [addMenuOpen, setAddMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useLanguage();
    const { user, signOut } = useAuth();

    const headerMenusRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                headerMenusRef.current &&
                !headerMenusRef.current.contains(event.target)
            ) {
                setAddMenuOpen(false);
                setUserMenuOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (location.pathname === '/pesquisa') {
            const query = new URLSearchParams(location.search).get('query') || '';
            setSearchText(query);
        } else {
            setSearchText('');
        }

        setAddMenuOpen(false);
        setUserMenuOpen(false);
    }, [location.pathname, location.search]);

    function handleSearchSubmit(event) {
        event.preventDefault();

        const termo = searchText.trim();

        if (termo === '') {
            return;
        }

        setAddMenuOpen(false);
        setUserMenuOpen(false);
        navigate(`/pesquisa?query=${encodeURIComponent(termo)}`);
    }

    function handleAddButtonClick(event) {
        event.stopPropagation();

        setAddMenuOpen((currentValue) => !currentValue);
        setUserMenuOpen(false);
    }

    function handleUserButtonClick(event) {
        event.stopPropagation();

        setUserMenuOpen((currentValue) => !currentValue);
        setAddMenuOpen(false);
    }

    function handleAddOption(path) {
        setAddMenuOpen(false);
        setUserMenuOpen(false);
        navigate(path);
    }

    async function handleLogout() {
        setAddMenuOpen(false);
        setUserMenuOpen(false);

        await signOut();
        navigate('/');
    }

    function handleLogin() {
        setAddMenuOpen(false);
        setUserMenuOpen(false);
        navigate('/login');
    }

    return (
        <header className="header">
            <Link to="/" className="header-brand" aria-label="Filmógrafo">
                <span className="header-brand-text">Filmógrafo</span>

                <div className="header-logo" aria-hidden="true">
                    <img
                        className="brand-logo-normal"
                        src="/flogo.png"
                        alt=""
                    />
                    <img
                        className="brand-logo-hover"
                        src="/flogo_amarelo.png"
                        alt=""
                    />
                </div>
            </Link>

            <div className="header-main">
                <form className="search-bar" onSubmit={handleSearchSubmit} role="search">
                    <button
                        type="submit"
                        className="search-icon-button"
                        aria-label={t('searchPlaceholder')}
                    >
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
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
                        type="search"
                        placeholder={t('searchPlaceholder')}
                        value={searchText}
                        onChange={(event) => setSearchText(event.target.value)}
                        aria-label={t('searchPlaceholder')}
                    />
                </form>

                <div className="header-icons" ref={headerMenusRef}>
                    <LanguageSwitcher />

                    {user && (
                        <div className="add-menu-wrapper">
                            <button
                                type="button"
                                className="add-button"
                                onClick={handleAddButtonClick}
                                aria-label={t('addContent')}
                                aria-expanded={addMenuOpen}
                                aria-controls="add-content-menu"
                                title={t('addContent')}
                            >
                                <svg
                                    width="56"
                                    height="56"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M6 12H18M12 6V18"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {addMenuOpen && (
                                <div className="add-dropdown" id="add-content-menu">
                                    <button
                                        type="button"
                                        onClick={() => handleAddOption('/adicionar/filme')}
                                    >
                                        {t('addMovie')}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleAddOption('/adicionar/serie')}
                                    >
                                        {t('addSeries')}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="user-menu-wrapper">
                        <button
                            type="button"
                            className="user-icon-button"
                            onClick={handleUserButtonClick}
                            aria-label={user ? t('userMenu') : t('login')}
                            aria-expanded={userMenuOpen}
                            aria-controls="user-menu"
                            title={user ? t('userMenu') : t('login')}
                        >
                            <svg
                                width="56"
                                height="56"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                            </svg>
                        </button>

                        {userMenuOpen && (
                            <div className="user-dropdown" id="user-menu">
                                {user ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleAddOption('/meus-pedidos')}
                                        >
                                            {t('myRequests')}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                        >
                                            {t('logout')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleLogin}
                                    >
                                        {t('login')}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;