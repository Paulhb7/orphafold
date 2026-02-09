<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OrphaFold: Deep Structural Search for Rare Diseases

OrphaFold is an AI-powered platform designed to accelerate research into rare diseases by combining real-time API enrichment with advanced LLM reasoning. It leverages Google's Gemini 1.5 Pro to synthesize data from Orphanet, OMIM, UniProt, NCBI, and ClinVar.

## 🧬 What are the Agents?

OrphaFold orchestrates a Multi-Agent System (MAS) to analyze user queries from different biological perspectives. Each agent specializes in a specific domain:

### 1. 🏥 Clinical Grounding Agent
*   **Purpose:** Establishes the clinical baseline of the disease.
*   **Capabilities:**
    *   Retrieves prevalence data, inheritance patterns, and disease classifications from **Orphanet** and **OMIM**.
    *   Cross-references data with real-time **Google Search** to ensure up-to-date clinical statistics.
    *   Identifies validated pathogenic variants via **ClinVar**.

### 2. 🧪 Bio-Mechanism Agent
*   **Purpose:** Uncovers the molecular machinery driving the disease.
*   **Capabilities:**
    *   Maps **UniProt** IDs to functional domains and signaling pathways.
    *   Estimates structural confidence (pLDDT) and AlphaFold availability.
    *   Assesses **druggability** of key protein targets (e.g., Small Molecule, Biologic).
    *   Analyzes cellular vulnerabilities and tissue expression profiles.

### 3. 🔬 Discovery Agent
*   **Purpose:** Connects the disease to the broader research landscape.
*   **Capabilities:**
    *   Scans **ClinicalTrials.gov** for active recruitment and intervention status.
    *   Performs structural homology searches to find shared mechanisms with other diseases.
    *   Synthesizes a bibliography of key research papers from **PubMed**.

### 4. 💊 Drug Repurposing Agent (On-Demand)
*   **Purpose:** Proposes therapeutic candidates by bridging mechanism overlap.
*   **Capabilities:**
    *   Identifies FDA-approved drugs for *other* indications that might modulate the target pathways.
    *   Scores candidates based on molecular feasibility and mechanism of action.
    *   Provides specific validation steps for experimental verification.

---

## 🚀 How it Works

1.  **Input:** The user enters a rare disease name or description (e.g., "Cystic Fibrosis").
2.  **API Enrichment:** The system acts as a "Pre-Flight" layer, simultaneously querying:
    *   *Orphanet, OMIM, UniProt, NCBI Gene, ClinVar, PubMed.*
3.  **Agent Orchestration:** The gathered context is fed into the Multi-Agent System powered by **Gemini 1.5 Pro**.
4.  **Synthesis:** The agents reason over the data, perform additional Google Searches for missing info, and generate a structured report.
5.  **Visualization:** The frontend renders interactive molecular structures (pdb), clinical data cards, and research timelines.

---

## 💻 Installation

**Prerequisites:** Node.js (v18+)

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Paulhb7/orphafold.git
    cd orphafold
    ```

2.  **Install dependencies:**
    ```bash
    make install
    # OR
    npm install
    ```

3.  **Configure Environment:**
    *   Create a `.env.local` file in the root directory.
    *   Add your Gemini API Key:
        ```env
        GEMINI_API_KEY=your_api_key_here
        ```

4.  **Run Locally:**
    ```bash
    make dev
    # OR
    npm run dev
    ```

## 🌍 Deployment

This project is optimized for deployment on **Google AI Studio**.
