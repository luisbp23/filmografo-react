import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null); 
    const [loading, setLoading] = useState(true);

    async function carregarPerfil(userId) {
        const { data } = await supabase
            .from('profiles')
            .select('username, role')
            .eq('id', userId)
            .single();
        setProfile(data ?? null);
    }

    useEffect(() => {
        async function carregarSessao() {
            const { data, error } = await supabase.auth.getSession();

            if (!error) {
                setSession(data.session);
                setUser(data.session?.user || null);

                // busca o perfil se houver sessao
                if (data.session?.user) {
                    await carregarPerfil(data.session.user.id);
                }
            }

            setLoading(false);
        }

        carregarSessao();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, novaSessao) => {
                setSession(novaSessao);
                setUser(novaSessao?.user || null);

                // ← atualiza o perfil quando a sessão muda
                if (novaSessao?.user) {
                    await carregarPerfil(novaSessao.user.id);
                } else {
                    setProfile(null); // limpa o perfil ao fazer logout
                }
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
        setProfile(null);
    }

    const value = useMemo(() => {
        return {
            session,
            user,
            profile,
            loading,
            signOut
        };
    }, [session, user, profile, loading]); // adiciona profile as dependencias

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