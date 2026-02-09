import { useState, useRef, useEffect } from 'react';
import { performDeepSearch, generateRepurposingCandidates } from '../services/geminiService';
import { SearchState, DiseaseInsight } from '../types';

export const useDeepSearch = () => {
    const [query, setQuery] = useState('');
    const [state, setState] = useState<SearchState>({
        loading: false,
        error: null,
        insight: null,
        thinking: false,
        logs: []
    });
    const [repurposingLoading, setRepurposingLoading] = useState(false);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setState({
            loading: true,
            error: null,
            insight: null,
            thinking: true,
            logs: []
        });
        setRepurposingLoading(false);

        const initialLogs = [
            "Initializing Orphafold Deep Research Agent...",
            "Establishing connection to global Bio-Grid...",
            "Mounting UniProt, NCBI Gene & ClinVar API clients...",
            "Activating search grounding protocols..."
        ];

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (const log of initialLogs) {
            setState(prev => ({ ...prev, logs: [...prev.logs, log] }));
            await delay(800);
        }

        try {
            const insight = await performDeepSearch(query, (log) => {
                setState(prev => ({ ...prev, logs: [...prev.logs, log] }));
            });
            setState(prev => ({ ...prev, loading: false, error: null, insight, thinking: false }));
        } catch (err) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: "Bioinformatics agent failure. API rate limit or connection issue.",
                insight: null,
                thinking: false
            }));
        }
    };

    const handleRepurposingGeneration = async () => {
        if (!state.insight) return;
        setRepurposingLoading(true);
        try {
            const candidates = await generateRepurposingCandidates(
                state.insight.name,
                state.insight.molecularMechanism,
                state.insight.targetProteins
            );

            setState(prev => ({
                ...prev,
                insight: prev.insight ? { ...prev.insight, repurposingCandidates: candidates } : null
            }));
        } catch (e) {
            console.error("Repurposing failed", e);
        } finally {
            setRepurposingLoading(false);
        }
    };

    const resetSearch = () => {
        setState({
            loading: false,
            error: null,
            insight: null,
            thinking: false,
            logs: []
        });
        setQuery('');
    }

    return {
        query,
        setQuery,
        state,
        repurposingLoading,
        handleSearch,
        handleRepurposingGeneration,
        resetSearch
    };
};
