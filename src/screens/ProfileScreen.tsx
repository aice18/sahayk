import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, Edit, ChevronRight, Lock, Accessibility, Palette, Contrast, Type, Shield, Fingerprint, Bell, LogOut } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { 
    t,
    colorBlindMode, setColorBlindMode, 
    largeFontMode, setLargeFontMode 
  } = useLanguage();

  const accessibilityOptions = [
    { 
      label: t('profile.colorBlind'), 
      desc: t('profile.colorBlindDesc'), 
      icon: Palette, 
      color: 'text-tertiary', 
      bg: 'bg-tertiary-fixed-dim/20',
      active: colorBlindMode,
      toggle: () => setColorBlindMode(!colorBlindMode)
    },
    { 
      label: t('profile.largeFont'), 
      desc: t('profile.largeFontDesc'), 
      icon: Type, 
      color: 'text-secondary', 
      bg: 'bg-secondary-fixed-dim/20',
      active: largeFontMode,
      toggle: () => setLargeFontMode(!largeFontMode)
    },
  ];

  const signupData = {
    name: "Rajesh Kumar",
    occupation: t('onboarding.occupations.farmer'),
    location: "Wardha, Maharashtra",
    email: "rajesh.k@farmer.in",
    phone: "+91 98765 43210",
    aadhaar: "XXXX-XXXX-4291",
    income: t('onboarding.incomeRanges.below25'),
    age: "42"
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50 transition-colors duration-150">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
      </header>

      <main className="pt-24 px-6 max-w-2xl mx-auto">
        <section className="mb-10 text-center md:text-left md:flex md:items-center md:gap-8">
          <div className="relative inline-block group mb-6 md:mb-0">
            <div className="w-32 h-32 rounded-full ring-4 ring-primary-fixed p-1">
              <img alt="User profile" className="w-full h-full object-cover rounded-full shadow-lg" src="https://picsum.photos/seed/user/200/200" />
            </div>
            <button className="absolute bottom-1 right-1 bg-primary text-on-primary p-2 rounded-full shadow-md hover:scale-105 transition-transform">
              <Edit className="w-4 h-4" />
            </button>
          </div>
          <div>
            <h2 className="text-3xl font-bold font-headline text-on-surface mb-1">{signupData.name}</h2>
            <p className="text-on-surface-variant font-body mb-4">{signupData.occupation} • {signupData.location}</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-label font-medium text-primary">{t('profile.verifiedCitizen')}</span>
              <span className="px-3 py-1 bg-secondary-container/30 rounded-full text-xs font-label font-medium text-secondary">{t('profile.premiumUser')}</span>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-primary">person_outline</span>
              <h3 className="text-lg font-bold font-headline">{t('profile.personalInfo')}</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: t('profile.email'), value: signupData.email },
                { label: t('profile.phone'), value: signupData.phone },
                { label: t('profile.aadhaar'), value: signupData.aadhaar, locked: true },
                { label: t('profile.occupation'), value: signupData.occupation },
                { label: t('profile.income'), value: signupData.income },
                { label: t('profile.age'), value: signupData.age },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer">
                  <div>
                    <p className="text-xs font-label text-outline mb-1">{item.label}</p>
                    <p className="font-body text-on-surface">{item.value}</p>
                  </div>
                  {item.locked ? <Lock className="w-4 h-4 text-outline" /> : <ChevronRight className="w-4 h-4 text-outline group-hover:text-primary transition-colors" />}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 rounded-xl p-6 border-2 border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <Accessibility className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold font-headline text-primary">{t('profile.accessibility')}</h3>
            </div>
            <p className="text-sm text-on-surface-variant font-body mb-6">{t('profile.accessibilityDesc')}</p>
            <div className="space-y-4">
              {accessibilityOptions.map((toggle, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full ${toggle.bg} flex items-center justify-center`}>
                      <toggle.icon className={`w-5 h-5 ${toggle.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface font-headline">{toggle.label}</p>
                      <p className="text-xs text-outline font-body">{toggle.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={toggle.toggle}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${toggle.active ? 'bg-primary' : 'bg-surface-container-highest'}`}
                  >
                    <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${toggle.active ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_12px_32px_rgba(25,28,30,0.06)]">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold font-headline">{t('profile.security')}</h3>
            </div>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <Fingerprint className="w-5 h-5 text-outline group-hover:text-primary" />
                  <span className="font-body font-medium">{t('profile.biometric')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-low transition-colors text-left group">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-outline group-hover:text-primary" />
                  <span className="font-body font-medium">{t('profile.notifications')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </button>
            </div>
          </div>

          <button onClick={() => navigate('/auth')} className="w-full py-4 text-red-600 font-headline font-bold hover:bg-red-50 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            {t('profile.signOut')}
          </button>
        </div>
      </main>
    </div>
  );
}
