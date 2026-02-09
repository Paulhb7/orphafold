import { GoogleGenAI } from "@google/genai";

export const MODEL_NAME = 'gemini-3-pro-preview';
export const THINKING_BUDGET = 8192;

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const runAgent = async (
    agentName: string,
    prompt: string,
    schema: any,
    startLogs: string[],
    apiEnrichmentContext: string,
    onLog: (log: string) => void,
    allGroundingSources: { title: string; uri: string }[]
): Promise<any> => {
    startLogs.forEach(log => onLog(`[${agentName}] ${log}`));

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `${apiEnrichmentContext}\n\nINSTRUCTION: ${prompt}`,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: THINKING_BUDGET, includeThoughts: true },
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });

        const text = response.text || "{}";
        const data = JSON.parse(text);

        // Capture thinking/thoughts - part.thought is boolean, content is in part.text
        const thoughts = response.candidates?.[0]?.content?.parts
            ?.filter((part: any) => part.thought === true)
            ?.map((part: any) => part.text) || [];

        if (thoughts.length > 0) {
            thoughts.forEach((thought: string) => {
                onLog(`[${agentName} 💭] ${thought}`);
            });
        }

        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .filter((c: any) => c.web)
            .map((c: any) => ({
                title: c.web.title || "Scientific Resource",
                uri: c.web.uri,
            }));

        sources.forEach(src => {
            if (!allGroundingSources.some(gs => gs.uri === src.uri)) {
                allGroundingSources.push(src);
            }
        });

        onLog(`[${agentName}] Data synthesis complete.`);
        return data;
    } catch (e) {
        onLog(`[${agentName}] error. Reverting to internal knowledge.`);
        console.error(e);
        return {};
    }
};
