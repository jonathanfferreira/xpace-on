'use client';

import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Props {
    userId: string;
    lessonId: string;
    videoDuration: number; // em segundos
}

/**
 * Hook que rastreia watch_time em intervalos de 30s.
 * Cria um registro watch_event ao iniciar e atualiza o percent_watched periodicamente.
 */
export function useWatchTimeTracker({ userId, lessonId, videoDuration }: Props) {
    const supabase = createClient();
    const eventIdRef = useRef<string | null>(null);
    const startRef = useRef<number>(Date.now());
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const createEvent = useCallback(async () => {
        const { data, error } = await supabase
            .from('watch_events')
            .insert({
                user_id: userId,
                lesson_id: lessonId,
                started_at: new Date().toISOString(),
                percent_watched: 0,
                duration_seconds: 0,
            })
            .select('id')
            .single();

        if (!error && data) {
            eventIdRef.current = data.id;
            startRef.current = Date.now();
        }
    }, [userId, lessonId, supabase]);

    const updateEvent = useCallback(async () => {
        if (!eventIdRef.current) return;

        const elapsed = Math.floor((Date.now() - startRef.current) / 1000);
        const percent = videoDuration > 0 ? Math.min((elapsed / videoDuration) * 100, 100) : 0;

        await supabase
            .from('watch_events')
            .update({
                ended_at: new Date().toISOString(),
                duration_seconds: elapsed,
                percent_watched: Math.round(percent * 100) / 100,
            })
            .eq('id', eventIdRef.current);
    }, [videoDuration, supabase]);

    useEffect(() => {
        createEvent();

        intervalRef.current = setInterval(() => {
            updateEvent();
        }, 30000); // Atualiza a cada 30 segundos

        // Ao sair da página, persiste o evento final
        const handleBeforeUnload = () => updateEvent();
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            updateEvent(); // Flush final
        };
    }, [createEvent, updateEvent]);

    return { updateEvent };
}
