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

export const disputeTemplateService = {
  async getTemplates(): Promise<DisputeTemplate[]> {
    const { data, error } = await supabase
      .from('dispute_templates')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error fetching dispute templates:', error);
      throw new Error('Failed to fetch dispute templates');
    }

    return data || [];
  },

  async getTemplateById(id: string): Promise<DisputeTemplate | null> {
    const { data, error } = await supabase
      .from('dispute_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching dispute template:', error);
      return null;
    }

    return data;
  },

  async createTemplate(templateData: Omit<DisputeTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<DisputeTemplate> {
    const { data, error } = await supabase
      .from('dispute_templates')
      .insert([templateData])
      .select()
      .single();

    if (error) {
      console.error('Error creating dispute template:', error);
      throw new Error('Failed to create dispute template');
    }

    return data;
  }
};

export const disputeService = {
  async getDisputes(): Promise<Dispute[]> {
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
      console.error('Error fetching disputes:', error);
      throw new Error('Failed to fetch disputes');
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
  },

  async createDispute(disputeData: {
    clientId: string;
    negativeItemId: string;
    templateId: string;
    bureau: string;
  }): Promise<void> {
    // Update the negative item status to in_progress and set last_disputed date
    const { error } = await supabase
      .from('negative_items')
      .update({
        status: 'in_progress',
        last_disputed: new Date().toISOString().split('T')[0]
      })
      .eq('id', disputeData.negativeItemId);

    if (error) {
      console.error('Error creating dispute:', error);
      throw new Error('Failed to create dispute');
    }
  }
};