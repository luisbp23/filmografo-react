import { supabase } from './supabaseClient';

export async function denunciarReview(reviewId, reason, description) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Não autenticado' };

    const { error } = await supabase
        .from('report')
        .insert({
            reporter: user.id,
            reportedcontent: reviewId,
            reason: reason,
            description: description,
            state: 'pending'
        });

    return { error };
}