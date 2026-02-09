import { Type } from "@google/genai";
import { ai, MODEL_NAME } from "../llm";
import { DrugRepurposingCandidate } from "../../types";

/**
 * Independent Agent for Drug Repurposing (On-Demand)
 */
export const generateRepurposingCandidates = async (
    diseaseName: string,
    mechanism: string,
    targetProteins: any[]
): Promise<DrugRepurposingCandidate[]> => {

    const context = `
    DISEASE: ${diseaseName}
    MECHANISM: ${mechanism}
    TARGETS: ${targetProteins.map(p => p.name).join(", ")}
  `;

    try {
        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: `
        CONTEXT: ${context}
        
        TASK: Drug Repurposing Generator
        - Identify 3-5 existing approved drugs (from DrugBank/ChEMBL) that modulate the targets or pathways involved in this disease.
        - Focus on drugs approved for OTHER indications that share mechanism overlap.
        - Rate their feasibility (0-100).
        - Provide specific validation steps.
      `,
            config: {
                tools: [{ googleSearch: {} }],
                thinkingConfig: { thinkingBudget: 4096, includeThoughts: true },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        repurposingCandidates: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    drugName: { type: Type.STRING },
                                    originalIndication: { type: Type.STRING },
                                    mechanismOfAction: { type: Type.STRING },
                                    feasibilityScore: { type: Type.NUMBER },
                                    rationale: { type: Type.STRING },
                                    validationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                                },
                                required: ["drugName", "originalIndication", "mechanismOfAction", "feasibilityScore", "rationale", "validationSteps"]
                            }
                        }
                    }
                },
            },
        });

        const data = JSON.parse(response.text || "{}");
        return data.repurposingCandidates || [];

    } catch (error) {
        console.error("Repurposing agent failed:", error);
        return [];
    }
};
