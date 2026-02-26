"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Upload, X, CheckCircle } from 'lucide-react';
import Layout from '@/components/Layout';
import SEOHead from '@/components/SEOHead';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

const gpSchema = z.object({
  nome: z.string().min(2).max(50),
  idade: z.number({ coerce: true }).min(18).max(80),
  bairro: z.string().min(2),
  categoria: z.enum(['Luxo', 'Independente', 'Massagem', 'Acompanhante']),
  descricao: z.string().min(20).max(1000),
  whatsapp: z.string().regex(/^[0-9]{12,13}$/, 'Formato: DDI+DDD+número (ex: 5596912345678)'),
});

type GPForm = z.infer<typeof gpSchema>;

export default function CadastroGPPage() {
  const { user } = useAuth();
  const navigate = useRouter();
  const [fotos, setFotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<GPForm>({
    resolver: zodResolver(gpSchema),
  });

  if (!user) {
    return (
      <Layout>
        <div className="container flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <p className="mb-4 text-muted-foreground">Você precisa estar logada para se cadastrar como GP.</p>
            <button onClick={() => navigate('/auth')} className="rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Entrar / Cadastrar
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - fotos.length;
    const newFiles = files.slice(0, remaining);
    setFotos([...fotos, ...newFiles]);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews([...previews, ...newPreviews]);
  };

  const removePhoto = (idx: number) => {
    setFotos(fotos.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const uploadFoto = async (file: File, userId: string): Promise<string> => {
    const ext = file.name.split('.').pop();
    const path = `gp-photos/${userId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('profiles').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from('profiles').getPublicUrl(path);
    return data.publicUrl;
  };

  const onSubmit = async (data: GPForm) => {
    setSubmitting(true);
    try {
      // Upload fotos
      const fotosUrls: string[] = [];
      for (const foto of fotos) {
        const url = await uploadFoto(foto, user.id);
        fotosUrls.push(url);
      }

      // Insert gp_applications
      const { error } = await supabase.from('gp_applications').insert({
        user_id: user.id,
        nome: data.nome,
        idade: data.idade,
        bairro: data.bairro,
        categoria: data.categoria,
        descricao: data.descricao,
        whatsapp: data.whatsapp,
        fotos: fotosUrls,
        status: 'pendente',
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      toast({ title: 'Erro ao enviar', description: err.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="container flex min-h-[60vh] items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <CheckCircle size={64} className="mx-auto mb-4 text-primary" />
            <h2 className="font-display text-2xl font-bold text-foreground">Cadastro enviado! 🌸</h2>
            <p className="mt-2 text-muted-foreground">Seu perfil está em análise. Em breve você receberá uma resposta.</p>
            <button onClick={() => navigate('/')} className="mt-6 rounded-xl gradient-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Voltar ao início
            </button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary";
  const errorCls = "mt-1 text-xs text-red-400";

  return (
    <Layout>
      <SEOHead title="Cadastro GP" description="Cadastre-se como garota de programa no Gatinhas Club" canonical="/cadastro-gp" />

      <section className="gradient-hero py-10">
        <div className="container text-center">
          <h1 className="font-display text-3xl font-bold text-primary-foreground">Cadastro de Anunciante</h1>
          <p className="mt-2 text-sm text-primary-foreground/70">Preencha os dados abaixo. Seu perfil ficará pendente até aprovação.</p>
        </div>
      </section>

      <div className="container max-w-2xl py-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Nome artístico *</label>
              <input {...register('nome')} placeholder="Ex: Amanda" className={inputCls} />
              {errors.nome && <p className={errorCls}>{errors.nome.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Idade *</label>
              <input {...register('idade')} type="number" min={18} max={80} className={inputCls} />
              {errors.idade && <p className={errorCls}>{errors.idade.message}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Bairro *</label>
              <input {...register('bairro')} placeholder="Ex: Central" className={inputCls} />
              {errors.bairro && <p className={errorCls}>{errors.bairro.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">Categoria *</label>
              <select {...register('categoria')} className={inputCls}>
                <option value="">Selecione...</option>
                <option>Luxo</option>
                <option>Independente</option>
                <option>Massagem</option>
                <option>Acompanhante</option>
              </select>
              {errors.categoria && <p className={errorCls}>{errors.categoria.message}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">WhatsApp *</label>
            <input {...register('whatsapp')} placeholder="5596912345678" className={inputCls} />
            <p className="mt-1 text-xs text-muted-foreground">DDI + DDD + número, apenas números</p>
            {errors.whatsapp && <p className={errorCls}>{errors.whatsapp.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Descrição *</label>
            <textarea {...register('descricao')} rows={4} placeholder="Fale sobre você (mínimo 20 caracteres)..." className={inputCls} />
            {errors.descricao && <p className={errorCls}>{errors.descricao.message}</p>}
          </div>

          {/* Fotos */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">Fotos (até 3)</label>
            <div className="flex flex-wrap gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removePhoto(i)} className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {fotos.length < 3 && (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                  <Upload size={20} />
                  <span className="mt-1 text-xs">Adicionar</span>
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFotos} />
                </label>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-semibold text-primary-foreground hover:shadow-glow disabled:opacity-50 transition-all"
          >
            {submitting ? 'Enviando...' : 'Enviar cadastro'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

