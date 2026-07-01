import { supabase } from './supabaseClient';

async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
        throw new Error('Precisas de iniciar sessão.');
    }

    return data.user;
}

export async function criarPedidoConteudo(formData) {
    const user = await getCurrentUser();

    const payload = {
        creator: user.id,
        type: formData.type,
        title: formData.title.trim(),
        imageurl: formData.imageurl || null,
        genre: formData.genre || null,
        synopsis: formData.synopsis || null,
        state: formData.state || null,
        duration: formData.duration ? Number(formData.duration) : null,
        episodes: formData.episodes ? Number(formData.episodes) : null,
        status: 'pending'
    };

    const { data, error } = await supabase
        .from('content')
        .insert(payload)
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function listarMeusPedidos() {
    const user = await getCurrentUser();

    const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('creator', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        throw error;
    }

    return data;
}

export async function buscarPedidoConteudo(id) {
    const user = await getCurrentUser();

    const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('id', id)
        .eq('creator', user.id)
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function atualizarPedidoConteudo(id, formData) {
    const user = await getCurrentUser();

    const payload = {
        title: formData.title.trim(),
        imageurl: formData.imageurl || null,
        genre: formData.genre || null,
        synopsis: formData.synopsis || null,
        state: formData.state || null,
        duration: formData.duration ? Number(formData.duration) : null,
        episodes: formData.episodes ? Number(formData.episodes) : null
    };

    const { data, error } = await supabase
        .from('content')
        .update(payload)
        .eq('id', id)
        .eq('creator', user.id)
        .eq('status', 'pending')
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}

export async function removerPedidoConteudo(id) {
    const user = await getCurrentUser();

    const { error, count } = await supabase
        .from('content')
        .delete({ count: 'exact' })
        .eq('id', id)
        .eq('creator', user.id)
        .eq('status', 'pending');

    if (error) {
        throw error;
    }

    if (count === 0) {
        throw new Error('Não foi possível remover este pedido. Verifica se ainda está pendente.');
    }

    return true;
}