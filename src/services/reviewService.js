import { supabase } from './supabaseClient';

export async function adicionarReview(titulo, nota, comentario, contentId, contentType) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Precisas de iniciar sessão para avaliar.');

    const { data, error } = await supabase
        .from('review')
        .insert({
            userid: user.id,
            contentid: contentId,
            contenttype: contentType,
            aval: nota,
            text: comentario,
            title: titulo
        });

    if (error) throw error;
    return data;
}

export async function getReviewsByContent(contentId, contentType) {
    const { data, error } = await supabase
        .from('review')
        .select('*, profiles(username)')
        .eq('contentid', contentId)
        .eq('contenttype', contentType)
        .eq('hidden', false);
    
    if (error) console.error(error);
    return data ?? [];
}

export function calcularMedia(reviews) {
    if (!reviews || !reviews.length) return 0;
    const soma = reviews.reduce((acc, r) => acc + r.aval, 0);
    return Math.round((soma / reviews.length) * 10) / 10;
}