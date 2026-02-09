
export interface Mutation {
  hgvs: string;
  clinvarId?: string;
  significance?: string;
}

export interface TherapeuticDetail {
  approach: string;
  mechanismOfAction?: string;
  drugBankId?: string;
}

export interface BibliographyEntry {
  title: string;
  authors: string;
  journal: string;
  year: string;
  doi?: string;
  link: string;
}

export interface ClinicalTrial {
  title: string;
  phase: string;
  status: string;
  intervention: string;
  identifier?: string;
}

export interface CrossDiseaseInsight {
  diseaseName: string;
  sharedMechanism: string;
  researchOpportunity: string;
  sharedGenes: string[];
  // New comparative fields
  pathwayOverlap?: string[]; // e.g. ["Lysosomal recycling", "mTORC1 signaling"]
  structuralSimilarity?: string; // e.g. "Both targets share a TIM barrel fold"
}

export interface DrugRepurposingCandidate {
  drugName: string;
  originalIndication: string;
  mechanismOfAction: string;
  feasibilityScore: number; // 0-100
  rationale: string;
  validationSteps: string[];
}

export interface DiseaseClassification {
  category: string;
  subgroups: string[];
}

export interface CellularVulnerability {
  cellTypesInvolved: string[];
  keyVulnerabilityFactors: string[];
  nonCellAutonomousMechanisms?: string[];
  therapeuticImplications: string[];
  evidenceLinks?: string[];
}

export interface DiseaseInsight {
  name: string;
  prevalence: string;
  inheritance: string;
  classification: DiseaseClassification[];
  classificationSummary: string;
  molecularMechanism: string;
  omimId?: string;
  orphanetId?: string;
  targetProteins: {
    name: string;
    uniprotId: string;
    function: string;
    molecularFunction: string;
    alphaFoldStatus: string;
    plddt?: string;
    domains?: string[];
    pathways?: string[];
    tissueExpression?: string;
    druggability?: string;
    interactionPartners?: string[];
    sequence: string;
    mutations: Mutation[];
  }[];
  therapeuticApproaches: string[];
  clinicalTrials: ClinicalTrial[];
  clinicalTrialsSummary: string;
  crossDiseaseInsights: CrossDiseaseInsight[];
  crossDiseaseSummary: string;
  repurposingCandidates: DrugRepurposingCandidate[];
  cellularVulnerability: CellularVulnerability;
  researchSynthesis: string;
  bibliography: BibliographyEntry[];
  bibliographySummary: string;
  groundingSources: {
    title: string;
    uri: string;
  }[];
  dataSourcesValidated: string[];
  qualityWarnings?: string[];
}

export interface SearchState {
  loading: boolean;
  error: string | null;
  insight: DiseaseInsight | null;
  thinking: boolean;
  logs: string[];
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'disease' | 'protein' | 'pathway' | 'drug' | 'variant';
}

export interface NetworkLink {
  source: string;
  target: string;
}
