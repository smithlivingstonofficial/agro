export interface MandiRecord {
    state: string;
    district: string;
    market: string;
    commodity: string;
    variety: string;
    arrival_date: string;
    min_price: string;
    max_price: string;
    modal_price: string;
}

const API_KEY = import.meta.env.VITE_OGD_API_KEY;
const RESOURCE_ID = "9ef84268-d588-465a-a308-a864a43d0070";
const PROXY = "https://corsproxy.io/?";

export const PriceService = {
    /**
     * Fetches real-time commodity prices from Agmarknet
     * @param limit Number of records to fetch
     * @param commodity Optional filter for specific crop
     */
    async getLivePrices(limit: number = 50, commodity?: string): Promise<MandiRecord[]> {
        try {
            let url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=${limit}`;
            
            if (commodity) {
                url += `&filters[commodity]=${commodity}`;
            }

            const response = await fetch(PROXY + encodeURIComponent(url));
            if (!response.ok) throw new Error("Network response was not ok");
            
            const data = await response.json();
            return data.records || [];
        } catch (error) {
            console.error("PriceService Error:", error);
            return [];
        }
    }
};