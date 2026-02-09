import { Type } from "@google/genai";
import { runAgent } from "../llm";

export const bioAgent = (
    query: string,
    apiEnrichmentContext: string,
    onLog: (log: string) => void,
    allGroundingSources: { title: string; uri: string }[]
) => runAgent(
    "Bio-Mechanism Agent",
    `Analyze molecular pathophysiology for "${query}".
  
  STRATEGY:
  1. START with the UniProt IDs provided in the API Context.
  2. USE 'googleSearch' to EXPAND this list. Search for "protein interaction network ${query}" or "downstream signaling effectors ${query}".
  3. The user wants a rich "Structural Proteomics Lab". Aim for 5-8 distinct proteins (e.g. including chaperones, receptors).
  4. For each protein, use the API data for the ID, but use Google Search/Internal knowledge to fill in 'domains', 'pLDDT', and 'druggability' if not obvious.
  `,
    {
        type: Type.OBJECT,
        properties: {
            molecularMechanism: { type: Type.STRING },
            targetProteins: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        uniprotId: { type: Type.STRING },
                        function: { type: Type.STRING },
                        molecularFunction: { type: Type.STRING, description: "Detailed molecular function description" },
                        alphaFoldStatus: { type: Type.STRING },
                        plddt: { type: Type.STRING, description: "Estimated pLDDT confidence score range (e.g. 'High > 90')" },
                        domains: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Functional domains (Pfam/InterPro)" },
                        pathways: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Signaling pathways involved" },
                        tissueExpression: { type: Type.STRING, description: "Primary tissue expression" },
                        druggability: { type: Type.STRING, description: "Assessment of druggability (e.g. 'Small Molecule', 'Biologic')" },
                        interactionPartners: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key protein-protein interaction partners" },
                        sequence: { type: Type.STRING },
                        mutations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    hgvs: { type: Type.STRING },
                                    clinvarId: { type: Type.STRING },
                                    significance: { type: Type.STRING }
                                },
                                required: ["hgvs"]
                            }
                        },
                    },
                    required: ["name", "uniprotId", "mutations", "molecularFunction", "domains"],
                }
            },
            cellularVulnerability: {
                type: Type.OBJECT,
                properties: {
                    cellTypesInvolved: { type: Type.ARRAY, items: { type: Type.STRING } },
                    keyVulnerabilityFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                    therapeuticImplications: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["cellTypesInvolved", "keyVulnerabilityFactors"]
            }
        },
        required: ["molecularMechanism", "targetProteins", "cellularVulnerability"]
    },
    ["Retrieving proteomics context...", "Analyzing AlphaFold structural confidence...", "Mapping functional domains & druggability..."],
    apiEnrichmentContext,
    onLog,
    allGroundingSources
);
