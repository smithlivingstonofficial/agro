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

// Fetch data for a specific commodity (Used by AI for trends)
export const fetchFinancialTrendData = async (commodity: string): Promise<MandiRecord[]> => {
  try {
    const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50&filters[commodity]=${commodity}`;
    const response = await fetch(PROXY + encodeURIComponent(url));
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.error("Market Data Error:", error);
    return [];
  }
};

// Fetch general market data (Used by Price Monitoring page)
export const fetchLiveMandiPrices = async (): Promise<MandiRecord[]> => {
    try {
      const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${API_KEY}&format=json&limit=50`;
      const response = await fetch(PROXY + encodeURIComponent(url));
      const data = await response.json();
      return data.records || [];
    } catch (error) {
      return [];
    }
  };