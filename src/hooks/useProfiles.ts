import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { mockProfiles, type Profile } from '@/data/mockProfiles';

const isSupabaseConfigured = () => {
  return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
};

export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async (): Promise<Profile[]> => {
      if (!isSupabaseConfigured()) return mockProfiles;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('ativo', true)
        .order('destaque', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProfile = (id: string) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: async (): Promise<Profile | null> => {
      if (!isSupabaseConfigured()) {
        return mockProfiles.find((p) => p.id === id) || null;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .eq('ativo', true)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!id,
  });
};

export const trackWhatsappClick = async (profileId: string) => {
  // GA4 Event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'whatsapp_click', {
      'profile_id': profileId,
      'event_category': 'conversion',
      'event_label': 'WhatsApp Contact'
    });
  }
  
  if (!isSupabaseConfigured()) return;
  await supabase.rpc('increment_whatsapp_click', { profile_id: profileId });
};

export const trackProfileView = async (profileId: string) => {
  if (!isSupabaseConfigured()) return;
  await supabase.rpc('increment_profile_view', { profile_id: profileId });
};
