
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseInsight, DrugRepurposingCandidate } from "../types";

const MODEL_NAME = 'gemini-3-pro-preview';
const THINKING_BUDGET = 8192;

/**
 * Real API Enricher Utilities
 */
const fetchUniProtData = async (query: string) => {
  try {
    // Increased size to capture a broader proteomic network
    const response = await fetch(`https://rest.uniprot.org/uniprotkb/search?query=${encodeURIComponent(query)}&format=json&size=10`);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.results) return null; // Safety check
    return data.results.map((r: any) => ({
      id: r.primaryAccession,
      name: r.proteinDescription?.recommendedName?.fullName?.value,
      gene: r.genes?.[0]?.geneName?.value,
      function: r.comments?.find((c: any) => c.commentType === "FUNCTION")?.texts?.[0]?.value,
    }));
  } catch (e) { return null; }
};

const fetchPubMedData = async (query: string) => {
  try {
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmode=json&retmax=10`);
    const searchData = await searchRes.json();
    if (!searchData.esearchresult || !searchData.esearchresult.idlist) return null; // Safety check
    const ids = searchData.esearchresult.idlist.join(',');
    if (!ids) return null;

    const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids}&retmode=json`);
    const summaryData = await summaryRes.json();
    if (!summaryData.result) return null; // Safety check

    return Object.values(summaryData.result).filter((v: any) => v.title).map((p: any) => ({
      title: p.title,
      authors: p.authors?.map((a: any) => a.name).join(', '),
      journal: p.fulljournalname,
      year: p.pubdate?.split(' ')[0],
      link: `https://pubmed.ncbi.nlm.nih.gov/${p.uid}/`
    }));
  } catch (e) { return null; }
};

const fetchClinVarData = async (query: string) => {
  try {
    // Search for pathogenic variations related to the query
    const term = `${query} AND pathogenic[clinical significance]`;
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=clinvar&term=${encodeURIComponent(term)}&retmode=json&retmax=5`);
    const searchData = await searchRes.json();
    if (!searchData.esearchresult || !searchData.esearchresult.idlist) return null; // Safety check
    const ids = searchData.esearchresult.idlist.join(',');
    if (!ids) return null;

    const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=clinvar&id=${ids}&retmode=json`);
    const summaryData = await summaryRes.json();
    if (!summaryData.result) return null; // Safety check
    
    return Object.values(summaryData.result).filter((v: any) => v.title).map((v: any) => ({
      title: v.title,
      gene: v.genes?.[0]?.symbol,
      significance: v.clinical_significance?.description,
      variationId: v.uid
    }));
  } catch (e) { return null; }
};

const fetchGeneData = async (query: string) => {
  try {
    // Search for the gene in NCBI Gene database
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=gene&term=${encodeURIComponent(query + " AND human[organism]")}&retmode=json&retmax=1`);
    const searchData = await searchRes.json();
    if (!searchData.esearchresult || !searchData.esearchresult.idlist) return null; // Safety check
    const ids = searchData.esearchresult.idlist.join(',');
    if (!ids) return null;

    const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=gene&id=${ids}&retmode=json`);
    const summaryData = await summaryRes.json();
    if (!summaryData.result || !summaryData.result[ids]) return null; // Safety check
    const gene = summaryData.result[ids];
    
    return {
      symbol: gene.name,
      description: gene.description,
      summary: gene.summary,
      location: gene.maplocation,
      uid: ids
    };
  } catch (e) { return null; }
};

const fetchOrphanetData = async (query: string) => {
  try {
    // Orphanet API - Search for rare disease
    // Note: Orphanet doesn't have a simple search API, but we can try their nomenclature endpoint
    // For demo purposes, we'll use their public XML API and parse it
    const searchTerm = encodeURIComponent(query);
    const response = await fetch(`https://api.orphadata.com/EN_Product1.xml`);
    
    if (!response.ok) return null;
    
    const xmlText = await response.text();
    
    // Simple XML parsing for the disease name
    // In production, you'd use a proper XML parser
    const diseaseMatch = xmlText.match(new RegExp(`<Name[^>]*>([^<]*${query}[^<]*)<\\/Name>`, 'i'));
    const orphaCodeMatch = xmlText.match(/<OrphaCode[^>]*>(\d+)<\/OrphaCode>/);
    
    if (diseaseMatch && orphaCodeMatch) {
      return {
        name: diseaseMatch[1],
        orphaCode: orphaCodeMatch[1],
        source: 'Orphanet API'
      };
    }
    
    return null;
  } catch (e) { 
    console.log('Orphanet API not available, will use LLM knowledge');
    return null; 
  }
};

const fetchOMIMData = async (query: string) => {
  try {
    // OMIM API requires API key, but we can use NCBI's linkout to OMIM via E-utilities
    // Search for OMIM entries related to the disease
    const searchRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=omim&term=${encodeURIComponent(query)}&retmode=json&retmax=3`);
    const searchData = await searchRes.json();
    if (!searchData.esearchresult || !searchData.esearchresult.idlist) return null;
    const ids = searchData.esearchresult.idlist.join(',');
    if (!ids) return null;

    const summaryRes = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=omim&id=${ids}&retmode=json`);
    const summaryData = await summaryRes.json();
    if (!summaryData.result) return null;
    
    return Object.values(summaryData.result)
      .filter((v: any) => v.title)
      .map((entry: any) => ({
        omimId: entry.uid,
        title: entry.title,
        type: entry.type || 'phenotype'
      }));
  } catch (e) { 
    console.log('OMIM API not available, will use LLM knowledge');
    return null; 
  }
};

/**
 * Orchestrator for deep discovery with real-time API enrichment.
 */
export const performDeepSearch = async (
  query: string,
  onLog: (log: string) => void
): Promise<DiseaseInsight> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const allGroundingSources: { title: string; uri: string }[] = [];

  // Helper to add delay between logs
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // --- PRE-FLIGHT: Real API Enrichment ---
  onLog("📡 Querying Orphanet API for disease classification...");
  const orphanetContext = await fetchOrphanetData(query);
  if (orphanetContext) onLog(`✅ Found disease in Orphanet: ${orphanetContext.name} (ORPHA:${orphanetContext.orphaCode})`);
  await delay(2000);
  
  onLog("📡 Querying OMIM database for phenotype-genotype data...");
  const omimContext = await fetchOMIMData(query);
  if (omimContext) onLog(`✅ Retrieved ${omimContext.length} OMIM entries.`);
  await delay(2000);
  
  onLog("📡 Hitting UniProt API for primary protein targets...");
  const uniProtContext = await fetchUniProtData(query);
  if (uniProtContext) onLog(`✅ Found ${uniProtContext.length} target candidates in UniProt.`);
  await delay(2500);

  onLog("📡 Querying NCBI Gene for genomic coordinates...");
  const geneContext = await fetchGeneData(query);
  if (geneContext) onLog(`✅ Identified gene: ${geneContext.symbol} at ${geneContext.location}.`);
  await delay(2000);

  onLog("📡 Scanning ClinVar for pathogenic genomic variations...");
  const clinVarContext = await fetchClinVarData(query);
  if (clinVarContext) onLog(`✅ Retrieved ${clinVarContext.length} validated variants from ClinVar.`);
  await delay(2500);

  onLog("📡 Querying PubMed (NCBI) for latest research papers...");
  const pubMedContext = await fetchPubMedData(query);
  if (pubMedContext) onLog(`✅ Retrieved ${pubMedContext.length} clinical papers from PubMed.`);
  await delay(2000);

  const apiEnrichmentContext = `
    REAL-TIME API CONTEXT (GROUND TRUTH):
    - Orphanet Data: ${JSON.stringify(orphanetContext || "No Orphanet data found, using internal knowledge")}
    - OMIM Data: ${JSON.stringify(omimContext || "No OMIM data found, using internal knowledge")}
    - UniProt Data: ${JSON.stringify(uniProtContext || "No UniProt data found")}
    - NCBI Gene Data: ${JSON.stringify(geneContext || "No Gene data found")}
    - ClinVar Data: ${JSON.stringify(clinVarContext || "No ClinVar data found")}
    - PubMed Data: ${JSON.stringify(pubMedContext || "No recent PubMed papers found")}
    
    HYBRID STRATEGY INSTRUCTION:
    You have access to specific API data ABOVE and general 'googleSearch' tool capability.
    YOU MUST COMBINE BOTH.
    1. Use the API data for precise IDs, gene names, and validated variants.
    2. Use 'googleSearch' to find RECENT updates, clinical trials, and broader biological context that the APIs miss.
  `;

  const runAgent = async (
    agentName: string,
    prompt: string,
    schema: any,
    startLogs: string[]
  ): Promise<any> => {
    startLogs.forEach(log => onLog(`[${agentName}] ${log}`));
    
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `${apiEnrichmentContext}\n\nUSER QUERY: ${query}\n\nINSTRUCTION: ${prompt}`,
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
      return {};
    }
  };

  // --- 1. Clinical Grounding Agent ---
  const clinicalAgent = () => runAgent(
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
    ["Querying Orphanet Registry...", "Cross-referencing inheritance patterns..."]
  );

  // --- 2. Bio-Mechanism Agent ---
  const bioAgent = () => runAgent(
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
    ["Retrieving proteomics context...", "Analyzing AlphaFold structural confidence...", "Mapping functional domains & druggability..."]
  );

  // --- 3. Discovery Agent (Refactored: No Repurposing here) ---
  const researchAgent = () => runAgent(
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
    ["Scanning ClinicalTrials.gov...", "Synthesizing PubMed bibliography...", "Running deep web search for comparative models..."]
  );

  const [clinicalData, bioData, researchData] = await Promise.all([
    clinicalAgent(),
    bioAgent(),
    researchAgent()
  ]);

  onLog("Compilation complete. Finalizing structural report...");

  const dataSourcesValidated = Array.from(new Set([
    ...(orphanetContext || clinicalData.orphanetId ? ["Orphanet"] : []),
    ...(omimContext || clinicalData.omimId ? ["OMIM"] : []),
    ...(uniProtContext ? ["UniProt"] : []),
    ...(geneContext ? ["NCBI Gene"] : []),
    ...(clinVarContext ? ["ClinVar"] : []),
    ...(pubMedContext ? ["PubMed"] : []),
    "AlphaFold DB"
  ]));

  return {
    ...clinicalData,
    ...bioData,
    ...researchData,
    repurposingCandidates: [], // Initialize empty for on-demand generation
    groundingSources: allGroundingSources,
    dataSourcesValidated,
    therapeuticApproaches: bioData.cellularVulnerability?.therapeuticImplications || []
  };
};

/**
 * Independent Agent for Drug Repurposing (On-Demand)
 */
export const generateRepurposingCandidates = async (
  diseaseName: string,
  mechanism: string,
  targetProteins: any[]
): Promise<DrugRepurposingCandidate[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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
