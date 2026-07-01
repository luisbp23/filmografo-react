import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { useLanguage } from '../../i18n/LanguageContext';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useLanguage();

    const [modo, setModo] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [erro, setErro] = useState('');

    const voltarPara = location.state?.from || '/';

    async function handleSubmit(event) {
        event.preventDefault();

        setLoading(true);
        setErro('');
        setMensagem('');

        try {
            if (modo === 'register') {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            username
                        }
                    }
                });

                if (error) {
                    throw error;
                }

                setMensagem(t('registerSuccess'));
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                });

                if (error) {
                    throw error;
                }

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
                    {modo === 'register' && (
                        <label>
                            {t('username')}
                            <input
                                type="text"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                        </label>
                    )}

                    <label>
                        {t('email')}
                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </label>

                    <label>
                        {t('password')}
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
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
                    {modo === 'login'
                        ? t('goToRegister')
                        : t('goToLogin')}
                </button>
            </section>
        </div>
    );
}

export default Login;