import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nome: string;
          idade: number;
          bairro: string;
          categoria: string;
          descricao: string;
          foto_principal: string | null;
          fotos: string[];
          whatsapp: string;
          verificada: boolean;
          destaque: boolean;
          plano: 'basico' | 'destaque' | 'premium';
          ativo: boolean;
          visualizacoes: number;
          cliques_whatsapp: number;
          created_at: string;
          updated_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at' | 'visualizacoes' | 'cliques_whatsapp'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
  };
}
