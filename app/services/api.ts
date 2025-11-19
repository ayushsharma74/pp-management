import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiService = {
  // Add new daily entry
  addEntry: async (entryData: any) => {
    try {
      const response = await api.post("/entries", entryData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to add entry");
    }
  },

  // Get all entries
  getEntries: async () => {
    try {
      const response = await api.get("/entries");
      return response.data.entries;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch entries"
      );
    }
  },

  // Export entries as CSV
  exportEntries: async () => {
    try {
      const response = await api.get("/entries/export");
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to export entries"
      );
    }
  },

  deleteEntry: async (id: string) => {
    try {
      const response = await api.delete(`/entries?id=${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete entry"
      );
    }
  },

  getUdhaars: async () => {
    try {
      const response = await api.get("/entries");
      const entries: any[] = response.data.entries;
      
      interface Udhaar {
        id: string;
        name: string;
        date: string;
        amount: number;
        paid: boolean;
      }

      let udhaars: Udhaar[] = [];

      entries.map((e) => {
        e.udhaar.map((u: any) => {
          udhaars.push({ ...u, id: e._id });
        });
      });

      return udhaars;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch entries"
      );
    }
  },

  updateUdhaar: async (u: any) => {
    try {
      const res = await api.patch(
        `/entries?entryID=${u.id}&udhaarName=${u.name}`
      );
      return res
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to patch entries"
      );
    }
  },
};

export default api;
