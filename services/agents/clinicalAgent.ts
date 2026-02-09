import { Type } from "@google/genai";
import { runAgent } from "../llm";

export const clinicalAgent = (
    query: string,
    apiEnrichmentContext: string,
    onLog: (log: string) => void,
    allGroundingSources: { title: string; uri: string }[]
) => runAgent(
    "Clinical Agent",
    `Extract clinical statistics for "${query}".
  
  STRATEGY:
  - Use the Orphanet/OMIM data from your internal knowledge.
  - AND ACTIVELY SEARCH GOOGLE for "latest prevalence ${query} 2024" or "updated clinical classification ${query}".
  - Combine sources to ensure the prevalence data is up-to-date.
  `,
    {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            prevalence: { type: Type.STRING },
            inheritance: { type: Type.STRING },
            classification: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING },
                        subgroups: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            },
            classificationSummary: { type: Type.STRING },
            orphanetId: { type: Type.STRING },
            omimId: { type: Type.STRING },
        },
        required: ["name", "prevalence", "inheritance", "classification"]
    },
    ["Querying Orphanet Registry...", "Cross-referencing inheritance patterns..."],
    apiEnrichmentContext,
    onLog,
    allGroundingSources
);
