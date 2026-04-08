import { motion } from 'motion/react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Badge, Landmark, Map, Smartphone, Verified } from 'lucide-react';
import { SCHEMES } from '../constants';
import { useLanguage } from '../LanguageContext';

export default function SchemeDetailsScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const scheme = SCHEMES.find(s => s.id === id) || SCHEMES[0];

  return (
    <div className="font-body bg-surface text-on-surface min-h-screen">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="flex justify-between items-center w-full px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="hover:bg-surface-container transition-colors p-2 rounded-full active:scale-95 duration-150">
              <ArrowLeft className="w-6 h-6 text-primary" />
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/15">
            <img alt="User profile" className="w-full h-full object-cover" src="https://picsum.photos/seed/user/100/100" />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 border border-outline-variant/15 overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-[12px] font-bold font-label uppercase tracking-wider">{t('scheme.activeScheme')}</span>
                <span className="text-on-surface-variant font-label text-[12px]">{t('scheme.centralSector')}</span>
              </div>
              <h2 className="text-4xl font-extrabold text-primary font-headline mb-4 leading-tight">
                {scheme.titleKey ? t(scheme.titleKey) : scheme.title}
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-2xl">
                {scheme.descriptionKey ? t(scheme.descriptionKey) : scheme.description}
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="md:col-span-4 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between"
          >
            <div>
              <span className="material-symbols-outlined text-4xl mb-4">payments</span>
              <p className="font-label text-on-primary/70 text-sm">{t('tracker.dbt')}</p>
              <h3 className="text-3xl font-bold font-headline mt-2">{t('tracker.benefitAmount')}</h3>
            </div>
            <button 
              onClick={() => navigate(`/apply/${scheme.id}`)}
              className="bg-white text-primary font-bold py-3 px-6 rounded-full w-full text-center hover:opacity-90 transition-opacity mt-6"
            >
              {t('scheme.applyNow')}
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold font-headline text-primary mb-6 flex items-center gap-2">
              <Verified className="w-6 h-6" />
              {t('scheme.benefits')}
            </h3>
            <div className="space-y-6">
              {scheme.benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-surface-container-low rounded-lg">
                  <div className="bg-white p-2 rounded-full shadow-sm text-secondary">
                    <CheckCircle2 className="w-5 h-5 fill-secondary text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface">{t('scheme.benefitLabel')} {i + 1}</h4>
                    <p className="text-on-surface-variant text-sm mt-1">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-highest rounded-xl p-8">
            <h3 className="text-2xl font-bold font-headline text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">assignment_ind</span>
              {t('scheme.eligibility')}
            </h3>
            <ul className="space-y-4">
              {scheme.eligibility.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-on-surface font-medium">
                  <CheckCircle2 className="w-5 h-5 text-secondary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-8 border-t border-outline-variant/30">
              <h4 className="font-bold text-on-surface-variant font-label text-sm uppercase tracking-wide mb-4">{t('scheme.exclusions')}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {t('tracker.exclusionsDesc')}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-bold font-headline text-primary mb-8 text-center">{t('scheme.documentation')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col items-center text-center">
              <Badge className="w-8 h-8 text-primary mb-3" />
              <span className="font-bold text-sm">{t('scheme.aadhaarCard')}</span>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col items-center text-center">
              <Landmark className="w-8 h-8 text-primary mb-3" />
              <span className="font-bold text-sm">{t('scheme.bankPassbook')}</span>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col items-center text-center">
              <Map className="w-8 h-8 text-primary mb-3" />
              <span className="font-bold text-sm">{t('scheme.landRecords')}</span>
            </div>
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/15 flex flex-col items-center text-center">
              <Smartphone className="w-8 h-8 text-primary mb-3" />
              <span className="font-bold text-sm">{t('scheme.mobileNumber')}</span>
            </div>
          </div>
        </div>

        <div className="bg-primary-fixed/30 rounded-2xl overflow-hidden mb-16 flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 h-64 md:h-80 overflow-hidden">
            <img alt="Farmer in field" className="w-full h-full object-cover" src="https://picsum.photos/seed/farmer/800/600" />
          </div>
          <div className="p-8 md:p-12 w-full md:w-1/2">
            <h3 className="text-2xl font-bold font-headline text-primary mb-4">{t('scheme.empowering')}</h3>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              {t('scheme.empoweringDesc')}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://picsum.photos/seed/person${i}/100/100`} referrerPolicy="no-referrer" />
                ))}
              </div>
              <span className="text-sm font-bold text-primary">{t('scheme.trusted')}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
