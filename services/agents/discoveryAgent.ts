import { Type } from "@google/genai";
import { runAgent } from "../llm";

export const researchAgent = (
    query: string,
    apiEnrichmentContext: string,
    onLog: (log: string) => void,
    allGroundingSources: { title: string; uri: string }[]
) => runAgent(
    "Discovery Agent",
    `Generate a Clinical Pipeline & Comparative Report for "${query}".
  
  STRATEGY:
  1. COMBINE the provided PubMed API context with a fresh 'googleSearch'.
  2. SEARCH QUERY 1: "active clinical trials ${query} recruitment status". Use this to fill 'clinicalTrials'.
  3. SEARCH QUERY 2: "structural homology ${query} other diseases" or "shared biological pathway ${query} mechanism". Use this for 'crossDiseaseInsights'.
  
  NOTE: Do NOT perform drug repurposing search in this step. That is handled by a separate agent.
  `,
    {
        type: Type.OBJECT,
        properties: {
            clinicalTrials: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        phase: { type: Type.STRING },
                        status: { type: Type.STRING },
                        intervention: { type: Type.STRING },
                        identifier: { type: Type.STRING },
                    },
                    required: ["title", "phase", "status", "intervention"],
                }
            },
            clinicalTrialsSummary: { type: Type.STRING },
            crossDiseaseInsights: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        diseaseName: { type: Type.STRING },
                        sharedMechanism: { type: Type.STRING },
                        researchOpportunity: { type: Type.STRING },
                        sharedGenes: { type: Type.ARRAY, items: { type: Type.STRING } },
                        pathwayOverlap: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific biological pathways shared (Reactome/KEGG)" },
                        structuralSimilarity: { type: Type.STRING, description: "Brief analysis of protein structural homology" },
                    },
                    required: ["diseaseName", "sharedMechanism", "researchOpportunity"],
                }
            },
            crossDiseaseSummary: { type: Type.STRING },
            bibliography: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING },
                        authors: { type: Type.STRING },
                        journal: { type: Type.STRING },
                        year: { type: Type.STRING },
                        link: { type: Type.STRING },
                    },
                    required: ["title", "authors", "journal", "year", "link"],
                }
            },
            bibliographySummary: { type: Type.STRING },
            researchSynthesis: { type: Type.STRING },
        },
        required: ["clinicalTrials", "crossDiseaseInsights", "bibliography", "researchSynthesis", "bibliographySummary"]
    },
    ["Scanning ClinicalTrials.gov...", "Synthesizing PubMed bibliography...", "Running deep web search for comparative models..."],
    apiEnrichmentContext,
    onLog,
    allGroundingSources
);
