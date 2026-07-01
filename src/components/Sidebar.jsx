import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { useLanguage } from '../i18n/LanguageContext';

function Sidebar() {
    const { t } = useLanguage();

    return (
        <aside className="sidebar">
            <NavLink to="/filmes" className="sidebar-option">
                <svg role="img" aria-label="icone de filme" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 4l2 4h-3l-2-4h3zm-5 0l2 4h-3l-2-4h3zM8 4l2 4H7L5 4h3zM4 6.5V20h16V10H4V6.5z" />
                </svg>
                <span>{t('movies')}</span>
            </NavLink>

            <NavLink to="/series" className="sidebar-option">
                <svg role="img" aria-label="icone de televisão" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 17H3V7h18v10zm0-12H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zM8 21h8v1H8zM8.5 2L12 5.5 15.5 2H17l-5 5-5-5h1.5z" />
                </svg>
                <span>{t('series')}</span>
            </NavLink>

            <NavLink to="/pessoas" className="sidebar-option">
                <svg role="img" aria-label="icone de pessoa" width="42" height="42" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                </svg>
                <span>{t('people')}</span>
            </NavLink>
        </aside>
    );
}

export default Sidebar;