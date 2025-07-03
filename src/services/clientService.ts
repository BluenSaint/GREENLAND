import { supabase } from '../lib/supabase';
import type { Client, CreditScore, NegativeItem, Document, Communication } from '../lib/supabase';

export const clientService = {
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        user:users!clients_user_id_fkey(id, first_name, last_name, email),
        assigned_specialist:users!clients_assigned_specialist_id_fkey(id, first_name, last_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      throw new Error('Failed to fetch clients');
    }

    return data || [];
  },

  async getClientById(id: string): Promise<Client | null> {
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
      console.error('Error fetching client:', error);
      return null;
    }

    return data;
  },

  async getClientByUserId(userId: string): Promise<Client | null> {
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
      console.error('Error fetching client by user ID:', error);
      return null;
    }

    return data;
  },

  async createClient(clientData: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert([clientData])
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      throw new Error('Failed to create client');
    }

    return data;
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating client:', error);
      throw new Error('Failed to update client');
    }

    return data;
  }
};

export const creditScoreService = {
  async getCreditScores(clientId: string): Promise<CreditScore[]> {
    const { data, error } = await supabase
      .from('credit_scores')
      .select('*')
      .eq('client_id', clientId)
      .order('score_date', { ascending: true });

    if (error) {
      console.error('Error fetching credit scores:', error);
      throw new Error('Failed to fetch credit scores');
    }

    return data || [];
  },

  async getLatestCreditScore(clientId: string): Promise<CreditScore | null> {
    const { data, error } = await supabase
      .from('credit_scores')
      .select('*')
      .eq('client_id', clientId)
      .order('score_date', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching latest credit score:', error);
      return null;
    }

    return data;
  },

  async addCreditScore(scoreData: Omit<CreditScore, 'id' | 'created_at'>): Promise<CreditScore> {
    const { data, error } = await supabase
      .from('credit_scores')
      .insert([scoreData])
      .select()
      .single();

    if (error) {
      console.error('Error adding credit score:', error);
      throw new Error('Failed to add credit score');
    }

    return data;
  }
};

export const negativeItemService = {
  async getNegativeItems(clientId: string): Promise<NegativeItem[]> {
    const { data, error } = await supabase
      .from('negative_items')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching negative items:', error);
      throw new Error('Failed to fetch negative items');
    }

    return data || [];
  },

  async createNegativeItem(itemData: Omit<NegativeItem, 'id' | 'created_at' | 'updated_at'>): Promise<NegativeItem> {
    const { data, error } = await supabase
      .from('negative_items')
      .insert([itemData])
      .select()
      .single();

    if (error) {
      console.error('Error creating negative item:', error);
      throw new Error('Failed to create negative item');
    }

    return data;
  },

  async updateNegativeItem(id: string, updates: Partial<NegativeItem>): Promise<NegativeItem> {
    const { data, error } = await supabase
      .from('negative_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating negative item:', error);
      throw new Error('Failed to update negative item');
    }

    return data;
  }
};

export const documentService = {
  async getDocuments(clientId?: string): Promise<Document[]> {
    let query = supabase.from('documents').select('*');
    
    if (clientId) {
      query = query.eq('client_id', clientId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      throw new Error('Failed to fetch documents');
    }

    return data || [];
  },

  async uploadDocument(documentData: Omit<Document, 'id' | 'created_at'>): Promise<Document> {
    const { data, error } = await supabase
      .from('documents')
      .insert([documentData])
      .select()
      .single();

    if (error) {
      console.error('Error uploading document:', error);
      throw new Error('Failed to upload document');
    }

    return data;
  }
};

export const communicationService = {
  async getCommunications(clientId: string): Promise<Communication[]> {
    const { data, error } = await supabase
      .from('communications')
      .select('*')
      .eq('client_id', clientId)
      .order('sent_at', { ascending: false });

    if (error) {
      console.error('Error fetching communications:', error);
      throw new Error('Failed to fetch communications');
    }

    return data || [];
  },

  async createCommunication(commData: Omit<Communication, 'id'>): Promise<Communication> {
    const { data, error } = await supabase
      .from('communications')
      .insert([commData])
      .select()
      .single();

    if (error) {
      console.error('Error creating communication:', error);
      throw new Error('Failed to create communication');
    }

    return data;
  }
};