import { supabase } from '../lib/supabase';
import type { DisputeTemplate, NegativeItem } from '../lib/supabase';

export interface Dispute {
  id: string;
  clientId: string;
  clientName: string;
  type: string;
  creditor: string;
  account: string;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  bureau: string;
  disputeReason: string;
  dateSent: string;
  responseDate?: string;
  followUpDate?: string;
  templateUsed: string;
}

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

export const disputeTemplateService = {
  async getTemplates(): Promise<DisputeTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('dispute_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.warn('Supabase unavailable, falling back to local dispute templates:', error);
      return await loadLocalData('dispute-templates.json');
    }
  },

  async getTemplateById(id: string): Promise<DisputeTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('dispute_templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, falling back to local dispute templates:', error);
      const templates = await loadLocalData('dispute-templates.json');
      return templates.find((template: DisputeTemplate) => template.id === id) || null;
    }
  },

  async createTemplate(templateData: Omit<DisputeTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DisputeTemplate> {
    try {
      const { data, error } = await supabase
        .from('dispute_templates')
        .insert([templateData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.warn('Supabase unavailable, simulating template creation:', error);
      return {
        id: `mock-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        ...templateData
      };
    }
  }
};

export const disputeService = {
  async getDisputes(): Promise<Dispute[]> {
    try {
      // Get negative items with client information to create dispute objects
      const { data: negativeItems, error } = await supabase
        .from('negative_items')
        .select(`
          *,
          client:clients!negative_items_client_id_fkey(
            id,
            user:users!clients_user_id_fkey(first_name, last_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform negative items into dispute format
      const disputes: Dispute[] = (negativeItems || []).map((item: any) => ({
        id: item.id,
        clientId: item.client_id,
        clientName: `${item.client.user.first_name} ${item.client.user.last_name}`,
        type: item.type,
        creditor: item.creditor,
        account: item.account,
        amount: item.amount,
        status: item.status === 'removed' ? 'completed' : 
                item.status === 'in_progress' ? 'in_progress' : 
                item.status === 'verified' ? 'rejected' : 'pending',
        bureau: item.bureau,
        disputeReason: item.dispute_reason,
        dateSent: item.last_disputed || item.created_at,
        responseDate: item.date_removed,
        templateUsed: 'template-001' // Default template
      }));

      return disputes;
    } catch (error) {
      console.warn('Supabase unavailable, returning mock disputes:', error);
      // Return mock dispute data
      return [
        {
          id: 'mock-dispute-1',
          clientId: 'mock-client-1',
          clientName: 'John Doe',
          type: 'Collection',
          creditor: 'Sample Creditor',
          account: 'ACC123456',
          amount: 1500.00,
          status: 'pending',
          bureau: 'Equifax',
          disputeReason: 'Not mine',
          dateSent: new Date().toISOString(),
          templateUsed: 'template-001'
        },
        {
          id: 'mock-dispute-2',
          clientId: 'mock-client-2',
          clientName: 'Jane Smith',
          type: 'Late Payment',
          creditor: 'Credit Card Company',
          account: 'CC789012',
          amount: 500.00,
          status: 'in_progress',
          bureau: 'Experian',
          disputeReason: 'Inaccurate date',
          dateSent: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          templateUsed: 'template-002'
        }
      ];
    }
  },

  async createDispute(disputeData: {
    clientId: string;
    negativeItemId: string;
    templateId: string;
    bureau: string;
  }): Promise<void> {
    try {
      // Update the negative item status to in_progress and set last_disputed date
      const { error } = await supabase
        .from('negative_items')
        .update({
          status: 'in_progress',
          last_disputed: new Date().toISOString().split('T')[0]
        })
        .eq('id', disputeData.negativeItemId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.warn('Supabase unavailable, simulating dispute creation:', error);
      // In offline mode, just log the action
      console.log('Mock dispute created:', disputeData);
    }
  }
};