import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AgeGate = ({ children }: { children: React.ReactNode }) => {
  const [verified, setVerified] = useState(true); // começa true para não bloquear o DOM
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('age_verified');
    if (stored !== 'true') {
      setVerified(false); // só mostra gate se não verificado
    }
    setChecking(false);
  }, []);

  const handleConfirm = () => {
    sessionStorage.setItem('age_verified', 'true');
    setVerified(true);
  };

  // SEMPRE renderiza children — conteúdo real está no DOM para o Googlebot
  return (
    <>
      {children}
      <AnimatePresence>
        {!checking && !verified && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            // OVERLAY CSS — não bloqueia renderização do DOM
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className='gradient-hero bg-background/95 backdrop-blur-sm'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='mx-4 max-w-md rounded-2xl bg-card p-8 text-center shadow-card border border-border'
            >
              <h2 className='mb-2 font-display text-3xl font-bold text-gradient'>
                Gatinhas Club
              </h2>
              <p className='mb-6 text-sm text-muted-foreground'>Macapá – AP</p>
              
              <div className='mb-6 rounded-xl border border-border bg-secondary/50 p-4 text-left'>
                <p className='text-sm font-medium text-foreground'>
                  ⚠️ Este site contém conteúdo destinado exclusivamente para maiores de 18 anos.
                </p>
                <p className='mt-2 text-xs text-muted-foreground'>
                  Ao continuar, você declara ter 18 anos ou mais e concorda com nossos{" "}
                  <a href="/termos" className="text-primary underline">Termos de Uso</a> e{" "}
                  <a href="/privacidade" className="text-primary underline">Política de Privacidade</a>.
                </p>
              </div>

              <button 
                onClick={handleConfirm}
                className='w-full rounded-xl gradient-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:shadow-glow'
              >
                Tenho 18 anos ou mais – Entrar
              </button>
              
              <a 
                href='https://www.google.com'
                className='mt-4 block text-sm text-muted-foreground hover:text-foreground transition-colors'
              >
                Sou menor de 18 anos – Sair
              </a>

              <p className="mt-6 text-[10px] text-muted-foreground">
                Plataforma de classificados independentes em Macapá. Não intermediamos serviços.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AgeGate;
