import './LanguageSwitcher.css';
import { useLanguage } from '../i18n/LanguageContext';

function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="language-switcher">
            <button
                type="button"
                className={`language-button ${language === 'pt' ? 'active' : ''}`}
                onClick={() => setLanguage('pt')}
                aria-label="Selecionar idioma Português"
                title="Português"
            >
                <img src="/flags/flag-pt.webp" alt="Bandeira de Portugal" />
            </button>

            <button
                type="button"
                className={`language-button ${language === 'en' ? 'active' : ''}`}
                onClick={() => setLanguage('en')}
                aria-label="Select English language"
                title="English"
            >
                <img src="/flags/flag-en.jpg" alt="Bandeira de Inglaterra" />
            </button>
        </div>
    );
}

export default LanguageSwitcher;