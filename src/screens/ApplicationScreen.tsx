import { motion } from 'motion/react';
import { useNavigate, useParams } from 'react-router-dom';
import { Menu, ChevronLeft, Upload, CheckCircle2, AlertCircle, FileText, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { SCHEMES } from '../constants';
import { useLanguage } from '../LanguageContext';

export default function ApplicationScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const scheme = SCHEMES.find(s => s.id === id);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!scheme) return <div className="p-10 text-center">{t('scheme.notFound')}</div>;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 2000);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-surface min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-secondary-container text-secondary rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>
        <h2 className="text-3xl font-black font-headline text-primary mb-4 tracking-tighter">{t('scheme.appSubmitted')}</h2>
        <p className="text-on-surface-variant font-body mb-10 max-w-xs">
          {t('scheme.appReceived', { scheme: scheme.title })}
          <br />
          {t('scheme.trackingId')}: <span className="font-bold text-primary">SH-2024-{Math.floor(Math.random() * 9000) + 1000}</span>
        </p>
        <button 
          onClick={() => navigate('/tracker')}
          className="w-full max-w-xs bg-primary text-on-primary py-4 rounded-full font-black text-sm shadow-xl active:scale-95 transition-all"
        >
          {t('tracker.title')}
        </button>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-primary font-black text-sm"
        >
          {t('scheme.backToDash')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40">
      <header className="bg-surface/90 backdrop-blur-xl flex items-center w-full px-6 py-4 sticky top-0 z-50 border-b border-outline-variant/10">
        <button onClick={() => navigate(-1)} className="p-2.5 rounded-xl hover:bg-surface-container transition-all active:scale-90 mr-2">
          <ChevronLeft className="w-6 h-6 text-primary" />
        </button>
        <img src="/logo.png" alt="Sahayk Logo" className="w-8 h-8 object-contain mr-3" />
        <div>
          <h1 className="text-lg font-black tracking-tight text-primary font-headline uppercase">{t('scheme.applyFor')}</h1>
          <p className="text-[10px] font-bold text-outline uppercase tracking-widest">{scheme.title}</p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10">
        <div className="flex justify-between mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-surface-container-highest -translate-y-1/2 z-0"></div>
          <div className={`absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500`} style={{ width: `${(step - 1) * 50}%` }}></div>
          {[1, 2, 3].map(s => (
            <div key={s} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all duration-300 ${
              step >= s ? 'bg-primary text-on-primary shadow-lg' : 'bg-surface-container-highest text-outline'
            }`}>
              {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
            </div>
          ))}
        </div>

        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/15 shadow-xl"
        >
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black font-headline text-primary tracking-tight">{t('scheme.personalDetails')}</h3>
              <p className="text-sm text-on-surface-variant font-body mb-8">{t('scheme.verifyPreFilled')}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black font-label text-outline uppercase tracking-widest mb-1 block">{t('onboarding.fullName')}</label>
                  <input type="text" defaultValue="Rajesh Kumar" className="w-full bg-surface-container-low border-none rounded-2xl p-4 font-bold text-on-surface focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-[10px] font-black font-label text-outline uppercase tracking-widest mb-1 block">{t('auth.aadhaarLabel')}</label>
                  <input type="text" defaultValue="XXXX-XXXX-4291" disabled className="w-full bg-surface-container-highest border-none rounded-2xl p-4 font-bold text-outline cursor-not-allowed" />
                </div>
                <div className="flex items-center gap-3 p-4 bg-secondary/5 rounded-2xl border border-secondary/10">
                  <ShieldCheck className="w-5 h-5 text-secondary" />
                  <p className="text-xs font-bold text-secondary">{t('scheme.aadhaarVerified')}</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black font-headline text-primary tracking-tight">{t('scheme.docUpload')}</h3>
              <p className="text-sm text-on-surface-variant font-body mb-8">{t('scheme.docUploadDesc')}</p>
              
              <div className="space-y-4">
                {scheme.documents.map((doc, i) => (
                  <div key={i} className="p-5 border-2 border-dashed border-outline-variant/30 rounded-2xl flex items-center justify-between group hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-surface-container rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-outline" />
                      </div>
                      <div>
                        <p className="text-sm font-black font-headline">{doc}</p>
                        <p className="text-[10px] text-outline font-label uppercase">{t('scheme.maxSize')}</p>
                      </div>
                    </div>
                    <Upload className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black font-headline text-primary tracking-tight">{t('scheme.reviewSubmit')}</h3>
              <p className="text-sm text-on-surface-variant font-body mb-8">{t('scheme.reviewDesc')}</p>
              
              <div className="bg-surface-container-low p-6 rounded-2xl space-y-4">
                <div className="flex justify-between border-b border-outline-variant/10 pb-3">
                  <span className="text-xs font-bold text-outline">{t('scheme.title')}</span>
                  <span className="text-xs font-black text-right">{scheme.title}</span>
                </div>
                <div className="flex justify-between border-b border-outline-variant/10 pb-3">
                  <span className="text-xs font-bold text-outline">{t('scheme.applicant')}</span>
                  <span className="text-xs font-black">Rajesh Kumar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-outline">{t('scheme.documents')}</span>
                  <span className="text-xs font-black text-secondary">{scheme.documents.length} {t('scheme.filesUploaded')}</span>
                </div>
              </div>

              <div className="flex gap-3 p-4 bg-primary-fixed/30 rounded-2xl border border-primary/10">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[10px] font-bold text-primary leading-relaxed">
                  {t('scheme.declaration')}
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 flex gap-4">
            {step > 1 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 py-4 rounded-full border-2 border-outline-variant/20 font-black text-sm hover:bg-surface-container transition-all"
              >
                {t('scheme.back')}
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={isSubmitting}
              className={`flex-grow py-4 rounded-full font-black text-sm shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
                isSubmitting ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary text-on-primary'
              }`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                step === 3 ? t('scheme.submitApp') : t('language.continue')
              )}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
