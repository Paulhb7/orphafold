/**
 * UniProt API Service
 */
export const fetchUniProtData = async (query: string) => {
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
