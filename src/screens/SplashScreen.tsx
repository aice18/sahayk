import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showNative, setShowNative] = useState(false);

  useEffect(() => {
    const nativeTimer = setTimeout(() => {
      setShowNative(true);
    }, 1500);

    const timer = setTimeout(() => {
      navigate('/language');
    }, 3500);
    return () => {
      clearTimeout(nativeTimer);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center overflow-hidden bg-surface">
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex flex-col items-center justify-center w-full max-w-md px-8 text-center"
      >
        <div className="flex flex-col items-center space-y-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="relative flex items-center justify-center w-24 h-24"
          >
            <img src="/logo.png" alt="Sahayk Logo" className="w-24 h-24 object-contain" />
            <div className="absolute inset-0 rounded-[2rem]"></div>
          </motion.div>

          <div className="space-y-2 h-20 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
              {!showNative ? (
                <motion.h1 
                  key="english"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-headline text-5xl font-extrabold tracking-tighter text-primary"
                >
                  {t('appName')}
                </motion.h1>
              ) : (
                <motion.h1 
                  key="native"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-headline text-5xl font-extrabold tracking-tighter text-primary"
                >
                  सहायक
                </motion.h1>
              )}
            </AnimatePresence>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="font-body text-on-surface-variant tracking-wide font-medium"
            >
              {t('splash.tagline')}
            </motion.p>
          </div>
        </div>

        <div className="mt-32 space-y-4">
          <div className="flex items-center justify-center space-x-2 text-secondary font-label font-semibold uppercase tracking-widest text-[10px]">
            <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span>{t('splash.initiative')}</span>
          </div>
          
          <div className="flex justify-center space-x-1.5 h-1">
            <motion.div 
              animate={{ width: [8, 32, 8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-8 h-full bg-primary rounded-full"
            />
            <div className="w-1.5 h-full bg-primary-fixed-dim rounded-full"></div>
            <div className="w-1.5 h-full bg-primary-fixed-dim rounded-full"></div>
          </div>
        </div>
      </motion.main>

      <div className="fixed bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-primary/10 via-transparent to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}
