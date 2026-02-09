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
        
        TASK: Structural Intelligence & Drug Repurposing Expert
        - Identify 3-5 approved drugs (DrugBank/ChEMBL) with high potential for repurposing.
        - **Binding Pocket Analysis**: Perform a deep comparative analysis of the protein binding pockets, catalytic sites, and allosteric domains of the target proteins.
        - **Structural Homology**: Focus on identifying drugs that target proteins with structurally similar 3D folds or binding motifs, even if the primary sequence similarity is low.
        - **Mechanism Mapping**: Prioritize drugs that can stabilize or inhibit specific functional domains (e.g., ATP-binding pockets, zinc fingers, protease active sites) identified in the bio-mechanism report.
        - Rate feasibility (0-100) based on structural compatibility and literature evidence.
        - Provide specific structural validation steps (e.g., molecular docking targets).
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
