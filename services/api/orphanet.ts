/**
 * Orphanet API Service
 */
export const fetchOrphanetData = async (query: string) => {
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
