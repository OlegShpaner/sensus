import { User, DayEntry, Campaign } from '../types';

const KEY_USER = 'sensus_user';
const KEY_ENTRIES = 'sensus_entries';
const KEY_GOALS = 'sensus_goals';

// Simulate network latency (200ms) to ensure pending states work
const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // USER API
  async getUser(): Promise<User | null> {
    await delay();
    const data = localStorage.getItem(KEY_USER);
    return data ? JSON.parse(data) : null;
  },

  async saveUser(user: User): Promise<void> {
    await delay();
    localStorage.setItem(KEY_USER, JSON.stringify(user));
  },

  async logout(): Promise<void> {
    await delay();
    localStorage.removeItem(KEY_USER);
  },

  // ENTRIES API
  async getEntries(): Promise<Record<string, DayEntry>> {
    await delay();
    const data = localStorage.getItem(KEY_ENTRIES);
    return data ? JSON.parse(data) : {};
  },

  async getEntry(date: string): Promise<DayEntry | null> {
    const entries = await this.getEntries();
    return entries[date] || null;
  },

  async saveEntry(entry: DayEntry): Promise<void> {
    const entries = await this.getEntries();
    entries[entry.date] = entry;
    await delay();
    localStorage.setItem(KEY_ENTRIES, JSON.stringify(entries));
  },

  // CAMPAIGNS API
  async getCampaigns(): Promise<Campaign[]> {
    await delay();
    const data = localStorage.getItem(KEY_GOALS);
    return data ? JSON.parse(data) : [];
  },

  async addCampaign(campaign: Campaign): Promise<void> {
    const campaigns = await this.getCampaigns();
    campaigns.push(campaign);
    localStorage.setItem(KEY_GOALS, JSON.stringify(campaigns));
  },

  async updateCampaign(id: string, updatedFields: Partial<Campaign>): Promise<void> {
    const campaigns = await this.getCampaigns();
    const index = campaigns.findIndex(c => c.id === id);
    if (index !== -1) {
      campaigns[index] = { ...campaigns[index], ...updatedFields };
      localStorage.setItem(KEY_GOALS, JSON.stringify(campaigns));
    }
  },

  async deleteCampaign(id: string): Promise<void> {
    const campaigns = await this.getCampaigns();
    const filtered = campaigns.filter(c => c.id !== id);
    localStorage.setItem(KEY_GOALS, JSON.stringify(filtered));
  }
};
