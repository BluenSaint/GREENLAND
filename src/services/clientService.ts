import { supabase } from '../lib/supabase';
import type { Client, CreditScore, NegativeItem, Document, Communication } from '../lib/supabase';

// Fallback function to load local data
async function loadLocalData(filename: string) {
  try {
    const response = await fetch(`/data/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`Failed to load local data from ${filename}:`, error);
    return [];
  }
}

export const clientService = {
  async getClients(): Promise<Client[]> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          user:users!clients_user_id_fkey(id, first_name, last_name, email),
          assigned_specialist:users!clients_assigned_specialist_id_fkey(id, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, falling back to local data:', error);
      return await loadLocalData('clients.json');
    }
  },

  async getClientById(id: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          user:users!clients_user_id_fkey(id, first_name, last_name, email),
          assigned_specialist:users!clients_assigned_specialist_id_fkey(id, first_name, last_name, email)
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, falling back to local data:', error);
      const clients = await loadLocalData('clients.json');
      return clients.find((client: Client) => client.id === id) || null;
    }
  },

  async getClientByUserId(userId: string): Promise<Client | null> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          user:users!clients_user_id_fkey(id, first_name, last_name, email),
          assigned_specialist:users!clients_assigned_specialist_id_fkey(id, first_name, last_name, email)
        `)
        .eq('user_id', userId)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, falling back to local data:', error);
      const clients = await loadLocalData('clients.json');
      return clients.find((client: Client) => client.user_id === userId) || null;
    }
  },

  async createClient(clientData: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([clientData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating client creation:', error);
      // Return mock data for offline mode
      const mockClient: Client = {
        id: `mock-${Date.now()}`,
        user_id: clientData.user_id || null,
        case_number: clientData.case_number || `CASE-${Date.now()}`,
        status: clientData.status || 'pending',
        assigned_specialist_id: clientData.assigned_specialist_id || null,
        start_date: clientData.start_date || new Date().toISOString().split('T')[0],
        package_type: clientData.package_type || 'basic',
        monthly_fee: clientData.monthly_fee || 99.99,
        contract_signed: clientData.contract_signed || false,
        contract_signed_date: clientData.contract_signed_date || null,
        personal_info: clientData.personal_info || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...clientData
      };
      return mockClient;
    }
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating client update:', error);
      // Return mock updated data for offline mode
      const clients = await loadLocalData('clients.json');
      const existingClient = clients.find((client: Client) => client.id === id);
      return {
        ...existingClient,
        ...updates,
        updated_at: new Date().toISOString()
      };
    }
  }
};

export const creditScoreService = {
  async getCreditScores(clientId: string): Promise<CreditScore[]> {
    try {
      const { data, error } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('client_id', clientId)
        .order('score_date', { ascending: true });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, returning mock credit scores:', error);
      // Return mock credit score data
      return [
        {
          id: `mock-score-${clientId}`,
          client_id: clientId,
          equifax: 650,
          experian: 655,
          transunion: 645,
          average: 650,
          score_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        }
      ];
    }
  },

  async getLatestCreditScore(clientId: string): Promise<CreditScore | null> {
    try {
      const { data, error } = await supabase
        .from('credit_scores')
        .select('*')
        .eq('client_id', clientId)
        .order('score_date', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, returning mock latest credit score:', error);
      return {
        id: `mock-latest-${clientId}`,
        client_id: clientId,
        equifax: 650,
        experian: 655,
        transunion: 645,
        average: 650,
        score_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };
    }
  },

  async addCreditScore(scoreData: Omit<CreditScore, 'id' | 'created_at'>): Promise<CreditScore> {
    try {
      const { data, error } = await supabase
        .from('credit_scores')
        .insert([scoreData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating credit score addition:', error);
      return {
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...scoreData
      };
    }
  }
};

export const negativeItemService = {
  async getNegativeItems(clientId: string): Promise<NegativeItem[]> {
    try {
      const { data, error } = await supabase
        .from('negative_items')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, returning mock negative items:', error);
      // Return mock negative items data
      return [
        {
          id: `mock-item-${clientId}`,
          client_id: clientId,
          type: 'Collection',
          creditor: 'Sample Creditor',
          account: 'ACC123456',
          amount: 1500.00,
          status: 'pending',
          bureau: 'Equifax',
          dispute_reason: 'Not mine',
          date_reported: '2023-01-01',
          date_removed: null,
          last_disputed: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
    }
  },

  async createNegativeItem(itemData: Omit<NegativeItem, 'id' | 'created_at' | 'updated_at'>): Promise<NegativeItem> {
    try {
      const { data, error } = await supabase
        .from('negative_items')
        .insert([itemData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating negative item creation:', error);
      return {
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...itemData
      };
    }
  },

  async updateNegativeItem(id: string, updates: Partial<NegativeItem>): Promise<NegativeItem> {
    try {
      const { data, error } = await supabase
        .from('negative_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating negative item update:', error);
      return {
        id,
        client_id: 'mock-client',
        type: 'Collection',
        creditor: 'Sample Creditor',
        account: 'ACC123456',
        amount: 1500.00,
        status: 'pending',
        bureau: 'Equifax',
        dispute_reason: 'Not mine',
        date_reported: '2023-01-01',
        date_removed: null,
        last_disputed: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...updates
      };
    }
  }
};

export const documentService = {
  async getDocuments(clientId?: string): Promise<Document[]> {
    try {
      let query = supabase.from('documents').select('*');
      
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, returning mock documents:', error);
      // Return mock documents data
      return [
        {
          id: `mock-doc-${clientId || 'all'}`,
          client_id: clientId || null,
          name: 'Sample Document.pdf',
          type: 'credit_report',
          file_path: '/mock/path/document.pdf',
          file_size: 1024000,
          mime_type: 'application/pdf',
          uploaded_by: 'mock-user',
          created_at: new Date().toISOString()
        }
      ];
    }
  },

  async uploadDocument(documentData: Omit<Document, 'id' | 'created_at'>): Promise<Document> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert([documentData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating document upload:', error);
      return {
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...documentData
      };
    }
  }
};

export const communicationService = {
  async getCommunications(clientId: string): Promise<Communication[]> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .select('*')
        .eq('client_id', clientId)
        .order('sent_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, returning mock communications:', error);
      return [
        {
          id: `mock-comm-${clientId}`,
          client_id: clientId,
          type: 'email',
          subject: 'Welcome to Credit Repair Services',
          content: 'Thank you for choosing our credit repair services.',
          sent_by: 'mock-specialist',
          sent_at: new Date().toISOString(),
          status: 'sent'
        }
      ];
    }
  },

  async createCommunication(commData: Omit<Communication, 'id'>): Promise<Communication> {
    try {
      const { data, error } = await supabase
        .from('communications')
        .insert([commData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating communication creation:', error);
      return {
        id: `mock-${Date.now()}`,
        ...commData
      };
    }
  }
};