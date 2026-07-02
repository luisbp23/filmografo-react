import { supabase } from './supabaseClient';

export async function getConteudoPendente(tipo) {
    const { data, error } = await supabase
        .from('content')
        .select('*')
        .eq('type', tipo)
        .eq('status', 'pending');

    if (error) console.error(error);
    return data ?? [];
}

export async function getDenunciasPendentes() {
    const { data: reports, error } = await supabase
        .from('report')
        .select('*')
        .eq('state', 'pending');

    if (error || !reports) return [];

    const result = await Promise.all(reports.map(async (report) => {
        const { data: review } = await supabase
            .from('review')
            .select('text, userid')
            .eq('id', report.reportedcontent)
            .single();

        const { data: reporter } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', report.reporter)
            .single();

        const { data: reviewed } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', review?.userid)
            .single();

        return {
            ...report,
            reporter_username: reporter?.username,
            review_text: review?.text,
            reviewed_username: reviewed?.username
        };
    }));

    return result;
}

export async function aprovar(id) {
    const { error } = await supabase.from('content').update({ status: 'approved' }).eq('id', id);
    if (error) console.error(error);
}

export async function rejeitar(id) {
    const { error } = await supabase.from('content').update({ status: 'rejected' }).eq('id', id);
    if (error) console.error(error);
}

export async function resolverDenuncia(id, reviewId) {
    await supabase
        .from('review')
        .update({ hidden: true })
        .eq('id', reviewId);

    await supabase
        .from('report')
        .update({ state: 'resolved' })
        .eq('id', id);
}

export async function ignorarDenuncia(id) {
    const { error } = await supabase
        .from('report')
        .update({ state: 'ignored' })
        .eq('id', id);
    if (error) console.error(error);
}