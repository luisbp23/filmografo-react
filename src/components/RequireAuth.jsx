import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

function RequireAuth({ children }) {
    const { user, loading } = useAuth();
    const { t } = useLanguage();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ padding: '32px' }}>
                <p>{t('loading')}</p>
            </div>
        );
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    return children;
}

export default RequireAuth;