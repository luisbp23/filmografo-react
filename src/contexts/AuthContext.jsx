import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function carregarSessao() {
            const { data, error } = await supabase.auth.getSession();

            if (!error) {
                setSession(data.session);
                setUser(data.session?.user || null);
            }

            setLoading(false);
        }

        carregarSessao();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, novaSessao) => {
                setSession(novaSessao);
                setUser(novaSessao?.user || null);
            }
        );

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    async function signOut() {
        await supabase.auth.signOut();
        setSession(null);
        setUser(null);
    }

    const value = useMemo(() => {
        return {
            session,
            user,
            loading,
            signOut
        };
    }, [session, user, loading]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth deve ser usado dentro de AuthProvider');
    }

    return context;
}