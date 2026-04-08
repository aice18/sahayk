import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Fingerprint, Verified, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function AuthScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');

  const handleAction = () => {
    if (step === 'input') {
      setStep('otp');
    } else {
      if (isSignUp) {
        navigate('/onboarding');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center">
      <main className="w-full max-w-md px-6 pt-16 pb-12 flex flex-col min-h-screen">
        <div className="mb-12 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 shadow-sm"
          >
            <span className="material-symbols-outlined text-white text-3xl">account_balance</span>
          </motion.div>
          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-primary mb-2">{t('appName')}</h1>
          <p className="text-on-surface-variant font-body text-base">{t('tagline')}</p>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {step === 'input' ? (
                <motion.div 
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-on-surface mb-1">
                      {isSignUp ? t('auth.signUp') : t('auth.signIn')}
                    </h2>
                    <p className="text-on-surface-variant text-sm">
                      {isSignUp ? t('auth.aadhaarSignUp') : t('auth.welcome')}
                    </p>
                  </div>

                  <div className="space-y-6">
                    {isSignUp && (
                      <div className="space-y-2">
                        <label className="font-label text-xs font-medium text-on-surface-variant ml-1">{t('auth.aadhaarLabel')}</label>
                        <div className="bg-surface-container-highest rounded-xl flex items-center px-4 py-4 border border-transparent focus-within:border-primary/20 transition-all">
                          <input 
                            className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline text-base" 
                            maxLength={12} 
                            placeholder={t('auth.aadhaarPlaceholder')} 
                            type="tel"
                            value={aadhaar}
                            onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="font-label text-xs font-medium text-on-surface-variant ml-1">{t('auth.phoneLabel')}</label>
                      <div className="flex gap-3">
                        <div className="w-20 bg-surface-container-highest rounded-xl flex items-center justify-center px-3 py-4 text-on-surface font-medium border border-transparent">
                          <span className="text-sm">+91</span>
                        </div>
                        <div className="flex-1 bg-surface-container-highest rounded-xl flex items-center px-4 py-4 border border-transparent focus-within:border-primary/20 transition-all">
                          <input 
                            className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline text-base" 
                            maxLength={10} 
                            placeholder={t('auth.phonePlaceholder')} 
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handleAction}
                      disabled={phone.length !== 10 || (isSignUp && aadhaar.length !== 12)}
                      className="w-full bg-primary text-on-primary font-body font-semibold py-4 rounded-full transition-transform active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{t('auth.getOtp')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>

                    <div className="text-center">
                      <button 
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-primary text-sm font-medium hover:underline"
                      >
                        {isSignUp ? t('auth.hasAccount') : t('auth.noAccount')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="otp"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button onClick={() => setStep('input')} className="mb-6 p-2 -ml-2 rounded-full hover:bg-surface-container transition-colors">
                    <ArrowLeft className="w-5 h-5 text-primary" />
                  </button>
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-on-surface mb-1">{t('auth.verifyOtp')}</h2>
                    <p className="text-on-surface-variant text-sm">{t('auth.sentTo', { phone })}</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-surface-container-highest rounded-xl flex items-center px-4 py-4 border border-transparent focus-within:border-primary/20 transition-all">
                      <input 
                        className="bg-transparent border-none focus:ring-0 w-full text-on-surface placeholder:text-outline text-base text-center tracking-[1em] font-bold" 
                        maxLength={6} 
                        placeholder="000000" 
                        type="tel"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <button 
                      onClick={handleAction}
                      disabled={otp.length !== 6}
                      className="w-full bg-primary text-on-primary font-body font-semibold py-4 rounded-full transition-transform active:scale-95 duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <span>{isSignUp ? t('auth.completeSignup') : t('auth.login')}</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-auto pt-12 text-center space-y-6">
          <div className="flex flex-col items-center gap-2 opacity-60">
            <div className="flex gap-1 items-center">
              <Verified className="w-4 h-4 text-secondary fill-secondary text-white" />
              <span className="text-[11px] font-label font-medium uppercase tracking-wider text-secondary">{t('auth.securePlatform')}</span>
            </div>
            <p className="text-[11px] font-label text-on-surface-variant max-w-[200px]">{t('auth.dataProtected')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
