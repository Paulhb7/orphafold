# Devpost Submission: OrphaFold

## Project Title
OrphaFold: Deep Structural Search for Rare Diseases

## Tagline / Pitch (200 chars max)
OrphaFold orchestrates Gemini 3 agents to bridge Orphanet, UniProt, PubMed & AlphaFold. Our agentic pipeline automates rare disease research to discover hidden therapeutic connections.

---

## Gemini Integration Summary
OrphaFold utilizes **Gemini 3** as the core reasoning engine for its multi-agent architecture. The application is built around four specialized agents that collaborate to analyze rare diseases:

1. **Clinical Grounding:** Uses Search Grounding to verify prevalence and inheritance patterns from trusted medical sources.
2. **Bio-Mechanism:** Reasons over raw UniProt and NCBI data to map molecular pathways and druggability scores.
3. **Discovery:** Synthesizes literature and identifies ongoing clinical trials via PubMed.
4. **Hypothesis Lab (Repurposing):** Acts as the synthesis catalyst, using Gemini’s large context window to bridge disease mechanisms with existing drug properties through **structural homology analysis**.

Gemini is central to our project’s success, enabling us to perform **complex multi-step reasoning** over structured biological data and unstructured research papers simultaneously. We specifically leverage Gemini’s ability to maintain high-fidelity context across multiple specialized agent prompts, allowing for a 'synthetic researcher' experience. By integrating Gemini's reasoning with structural data from AlphaFold, we create a tool that moves beyond simple search into predictive discovery, optimized for the precision and low-latency requirements of modern scientific research.

---

## Project Story

### Inspiration
Today, 300 million people live with a rare disease, yet **95% of these 7,000+ conditions have no approved treatment**. Research is often hindered by fragmented data—clinical profiles are in one silo (Orphanet), molecular data in another (UniProt), and structural insights (AlphaFold) remain disconnected from the literature (PubMed). OrphaFold was inspired by the need to bridge these silos using **Structural Intelligence**. We wanted to see if an agentic system could mirror the workflow of a high-level geneticist, synthesizing complex biological data to identify drug repurposing opportunities that human researchers might miss.

### What it does
OrphaFold is an agentic research platform that automates the discovery phase for orphan diseases. It orchestrates a pipeline of 4 specialized Gemini 3 agents:
- **Clinical Grounding:** Establishes the baseline using Orphanet and OMIM APIs.
- **Bio-Mechanism:** Analyzes the molecular pathophysiology through UniProt and ClinVar.
- **Discovery Agent:** Synthesizes the latest research from PubMed and ClinicalTrials.gov.
- **Hypothesis Lab:** The "brain" that performs structural homology analysis to propose therapeutic candidates by bridging mechanism overlap.

The system generates a full structural report including interactive 3D protein visualizations and a comparative discovery analysis between different diseases.

### How we built it
The core of OrphaFold is a **Multi-Agent Orchestration layer** built on **Gemini 3**. 
- **The Engine:** We utilized Gemini’s deep reasoning and large context window to manage parallel API enrichment from Orphanet, UniProt, and NCBI.
- **The Frontend:** Built with React/Vite, we implemented a custom **Structural Proteomics Lab** using 3D rendering for AlphaFold pdb models.
- **Agentic Logic:** We designed a "Synthetic Researcher" workflow where agents don't just fetch data, but cross-reference it. For example, verifying if a mutation found in ClinVar aligns with a functional domain identified in UniProt using a weighted scoring logic:
  $$S = \sum_{i=1}^{n} w_i \cdot \text{conf}(i)$$ 
  where $S$ is the hypothesis confidence score and $\text{conf}(i)$ represents the pLDDT or clinical significance values.

### Challenges we ran into
The biggest challenge was **Data Synthesis latency**. Orchestrating 4 agents while querying multiple REST APIs simultaneously requires precise prompt engineering to prevent "hallucinations" in a medical context. We solved this by implementing a **"Pre-Flight" layer** that fetches raw structural data first, feeding it into Gemini as a grounded context, ensuring that every hypothesis is backed by a verified UniProt ID or PubMed citation.

### Accomplishments that we're proud of
- **Structural Homology Hypotheses:** We are proud of the "Hypothesis Lab" which can identify that two very different diseases might share a similar structural defect, potentially opening the door for shared drug treatments.
- **Seamless Integration:** Mapping 3D AlphaFold structures directly to real-time clinical trial data in a single dashboard. 
- **Researcher-Ready Exports:** Implementing the RIS export feature, allowing researchers to instantly save synthesized bibliographies into Zotero or Mendeley.

### What we learned
We learned that **Gemini 3’s reasoning capabilities** are a game-changer for scientific research. Unlike previous models, Gemini 3 can follow complex biological "logic chains" (e.g., "If mutation X affects domain Y, then drug Z which targets that domain might work"). We also realized the power of **agentic workflows** to handle the "cold start" problem in rare disease research, where data is extremely scarce.

### What's next for OrphaFold
Our next step is to integrate **direct docking simulations**. We want to transform our hypotheses into predictive scores by running in-silico simulations directly within the agentic loop. We are also exploring a transition to the **Agent Development Kit (ADK)** framework to leverage its more comprehensive orchestration capabilities. Finally, winning this hackathon would provide the necessary visibility to launch pilot **beta tests** with geneticists and rare disease researchers, accelerating our journey from discovery to impact.
