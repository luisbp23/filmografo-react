import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useLanguage } from '../../i18n/LanguageContext';
import './Login.css';

function toFakeEmail(username) {
    return `${username.toLowerCase().trim()}@filmografo.com`;
}

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const [modo, setModo] = useState('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const voltarPara = location.state?.from || '/';

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setErro('');
        setMensagem('');

        const fakeEmail = toFakeEmail(username);

        try {
            if (modo === 'register') {
                const { error } = await supabase.auth.signUp({
                    email: fakeEmail,
                    password,
                    options: {
                        data: { username }
                    }
                });
                if (error) throw error;
                setMensagem(t('registerSuccess'));

            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email: fakeEmail,
                    password
                });
                if (error) throw error;
                navigate(voltarPara);
            }
        } catch (error) {
            setErro(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <section className="login-card">
                <h1>
                    {modo === 'login' ? t('login') : t('register')}
                </h1>

                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        {t('username')}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        {t('password')}
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading
                            ? t('loading')
                            : modo === 'login'
                                ? t('login')
                                : t('register')}
                    </button>
                </form>

                {mensagem && <p className="login-success">{mensagem}</p>}
                {erro && <p className="login-error">{erro}</p>}

                <button
                    type="button"
                    className="login-mode-btn"
                    onClick={() => setModo(modo === 'login' ? 'register' : 'login')}
                >
                    {modo === 'login' ? t('goToRegister') : t('goToLogin')}
                </button>
            </section>
        </div>
    );
}

export default Login;