/**
 * NCBI E-Utilities API Service
 * Handles PubMed, ClinVar, Gene, and OMIM (via NCBI linkout)
 */

export const fetchPubMedData = async (query: string) => {
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

export const fetchClinVarData = async (query: string) => {
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

export const fetchGeneData = async (query: string) => {
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

export const fetchOMIMData = async (query: string) => {
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
