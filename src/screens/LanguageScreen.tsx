import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Globe, ArrowRight, X } from 'lucide-react';
import { LANGUAGES } from '../constants';
import { useLanguage } from '../LanguageContext';

export default function LanguageScreen() {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();

  const handleContinue = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
      </header>

      <main className="flex-1 mt-20 px-6 pb-32 max-w-4xl mx-auto w-full">
        <section className="mt-8 mb-10 text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold font-headline text-on-surface tracking-tight mb-4 leading-tight">
            {t('language.choose')}
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl font-body">
            {t('language.selectDesc')}
          </p>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setLanguage(lang.id as any)}
              className={`relative group flex flex-col items-start p-6 rounded-xl transition-all duration-300 text-left ${
                language === lang.id 
                  ? 'bg-surface-container-lowest border-2 border-primary ring-4 ring-primary/5' 
                  : 'bg-surface-container-lowest border border-transparent hover:border-primary/20 hover:shadow-lg'
              }`}
            >
              {language === lang.id && (
                <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-primary fill-primary text-white" />
              )}
              <span className={`font-headline text-2xl mb-1 ${language === lang.id ? 'text-primary' : 'text-primary-fixed-dim'}`}>
                {lang.symbol}
              </span>
              <span className="text-on-surface font-semibold text-lg">{lang.native}</span>
              <span className="text-on-surface-variant text-sm font-label">{lang.label}</span>
            </motion.button>
          ))}
        </div>
      </main>

      <div className="fixed bottom-0 w-full z-50 p-6 flex justify-center pointer-events-none">
        <div className="w-full max-w-xl bg-white/40 backdrop-blur-xl border border-outline-variant/15 rounded-[2rem] shadow-[0px_12px_32px_rgba(25,28,30,0.06)] p-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-label text-on-surface-variant leading-none">{t('language.selected')}</p>
              <p className="text-sm font-bold text-primary font-headline">
                {LANGUAGES.find(l => l.id === language)?.label}
              </p>
            </div>
          </div>
          <button 
            onClick={handleContinue}
            className="h-14 px-8 bg-primary text-on-primary rounded-full font-bold font-headline hover:shadow-lg active:scale-95 duration-200 flex items-center gap-2"
          >
            {t('language.continue')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] bg-primary"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full blur-[100px] bg-secondary"></div>
      </div>
    </div>
  );
}
