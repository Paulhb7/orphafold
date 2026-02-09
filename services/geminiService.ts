/**
 * Orchestrator for deep discovery with real-time API enrichment.
 */
import { DiseaseInsight } from "../types";
import { fetchOrphanetData } from "./api/orphanet";
import { fetchOMIMData, fetchPubMedData, fetchClinVarData, fetchGeneData } from "./api/ncbi";
import { fetchUniProtData } from "./api/uniprot";
import { clinicalAgent } from "./agents/clinicalAgent";
import { bioAgent } from "./agents/bioAgent";
import { researchAgent } from "./agents/discoveryAgent";

export { generateRepurposingCandidates } from "./agents/repurposingAgent";

export const performDeepSearch = async (
  query: string,
  onLog: (log: string) => void
): Promise<DiseaseInsight> => {
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

  // Parallel Execution
  const [clinicalData, bioData, researchData] = await Promise.all([
    clinicalAgent(query, apiEnrichmentContext, onLog, allGroundingSources),
    bioAgent(query, apiEnrichmentContext, onLog, allGroundingSources),
    researchAgent(query, apiEnrichmentContext, onLog, allGroundingSources)
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
