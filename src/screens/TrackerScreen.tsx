import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, CheckCircle2, FileText, Clock, Building2, Wheat, ClipboardCheck, ExternalLink, Phone, Sparkles, ChevronRight, Volume2, User } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function TrackerScreen() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const speakData = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    // Map our language IDs to BCP 47 tags for SpeechSynthesis
    const langMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      ta: 'ta-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      pa: 'pa-IN'
    };
    utterance.lang = langMap[language] || 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const activeApplication = {
    id: 'SH-8829-2024',
    title: t('scheme.pmayTitle'),
    status: t('tracker.pending'),
    desc: t('scheme.pmayDesc'),
    estimated: t('tracker.oct24')
  };

  const handleSpeak = () => {
    const textToSpeak = `${t('tracker.title')}. ${activeApplication.title}. ${t('tracker.pending')}. ${activeApplication.desc}. ${t('tracker.estimated')}: ${activeApplication.estimated}`;
    speakData(textToSpeak);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center w-full px-6 py-4">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-90">
          <User className="w-6 h-6 text-primary" />
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-8 pb-32">
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-label text-sm uppercase tracking-widest text-primary font-semibold mb-2 block">{t('tracker.serviceDashboard')}</span>
              <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">{t('tracker.title')}</h2>
            </div>
            <div className="bg-surface-container-low px-6 py-4 rounded-xl flex items-center gap-8">
              <div className="text-center">
                <span className="block text-2xl font-headline font-bold text-primary">04</span>
                <span className="font-label text-[10px] text-outline uppercase tracking-wider">{t('tracker.active')}</span>
              </div>
              <div className="w-[1px] h-10 bg-outline-variant opacity-20"></div>
              <div className="text-center">
                <span className="block text-2xl font-headline font-bold text-secondary">12</span>
                <span className="font-label text-[10px] text-outline uppercase tracking-wider">{t('tracker.completed')}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 transition-all hover:shadow-[0px_12px_32px_rgba(25,28,30,0.06)] group"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-primary-fixed text-primary text-[10px] font-bold font-label uppercase tracking-widest rounded-full">{activeApplication.status}</span>
                  <span className="text-outline font-label text-xs">ID: {activeApplication.id}</span>
                </div>
                <h3 className="text-2xl font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{activeApplication.title}</h3>
                <p className="text-on-surface-variant font-body mt-1">{activeApplication.desc}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-outline font-label mb-1">{t('tracker.estimated')}</span>
                <span className="text-sm font-semibold text-on-surface">{activeApplication.estimated}</span>
              </div>
            </div>

            <div className="relative pt-8">
              <div className="absolute top-[52px] left-4 right-4 h-0.5 bg-surface-container-highest"></div>
              <div className="absolute top-[52px] left-4 w-1/3 h-0.5 bg-primary"></div>
              <div className="relative flex justify-between">
                {[
                  { label: t('tracker.submitted'), date: t('tracker.sep12'), status: 'success', icon: CheckCircle2 },
                  { label: t('tracker.verification'), date: t('tracker.inProgress'), status: 'active', icon: FileText },
                  { label: t('tracker.siteVisit'), date: t('tracker.upcoming'), status: 'pending', icon: Building2 },
                  { label: t('tracker.sanction'), date: t('tracker.waiting'), status: 'pending', icon: ClipboardCheck },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center w-24">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 mb-3 shadow-sm ${
                      step.status === 'success' ? 'bg-secondary text-on-secondary' :
                      step.status === 'active' ? 'bg-primary text-on-primary ring-4 ring-primary-fixed' :
                      'bg-surface-container-highest text-outline'
                    }`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold font-label ${step.status === 'active' ? 'text-primary' : 'text-on-surface'}`}>{step.label}</span>
                    <span className={`text-[10px] font-label ${step.status === 'active' ? 'text-primary' : 'text-outline'}`}>{step.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-outline-variant/10 flex justify-end gap-3">
              <button className="px-6 py-2.5 text-primary font-label text-sm font-semibold hover:bg-surface-container-high rounded-full transition-colors">{t('dashboard.viewDetails')}</button>
              <button className="px-6 py-2.5 bg-primary text-on-primary font-label text-sm font-semibold rounded-full transition-all active:scale-95 duration-150">{t('tracker.uploadDocs')}</button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-primary text-on-primary rounded-xl p-8 relative overflow-hidden">
              <div className="relative z-10">
                <Sparkles className="w-8 h-8 mb-4 text-primary-fixed-dim" />
                <h4 className="text-xl font-headline font-bold mb-2 leading-tight">{t('tracker.aiInsights')}</h4>
                <p className="text-primary-fixed-dim text-sm leading-relaxed mb-6 font-body">{t('tracker.aiInsightPmay')}</p>
                <button className="w-full py-3 bg-white text-primary font-bold rounded-full text-sm">{t('tracker.optimize')}</button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full"></div>
            </div>

            <div className="bg-surface-container rounded-xl p-6">
              <h4 className="text-sm font-label font-bold uppercase tracking-wider text-outline mb-4">{t('tracker.quickLinks')}</h4>
              <ul className="space-y-4">
                {[
                  { label: t('tracker.trackSms'), icon: ChevronRight },
                  { label: t('tracker.officialPortal'), icon: ExternalLink },
                  { label: t('tracker.contactNodal'), icon: Phone },
                ].map((link, i) => (
                  <li key={i}>
                    <a className="flex items-center justify-between group" href="#">
                      <span className="font-body text-on-surface group-hover:text-primary transition-colors">{link.label}</span>
                      <link.icon className="w-4 h-4 text-outline group-hover:text-primary" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 bg-surface-container-lowest rounded-xl p-8 transition-all hover:shadow-[0px_12px_32px_rgba(25,28,30,0.06)] border-l-4 border-secondary">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold font-label uppercase tracking-widest rounded-full">{t('tracker.approved')}</span>
                <h3 className="text-xl font-headline font-bold text-on-surface mt-3">{t('scheme.pmKisanTitle')}</h3>
              </div>
              <div className="w-12 h-12 bg-secondary-container/20 rounded-xl flex items-center justify-center">
                <Wheat className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-body">{t('tracker.benefitAmount')}</span>
                <span className="font-bold text-on-surface">₹6,000 / {t('tracker.yearly')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-on-surface-variant font-body">{t('tracker.lastDisbursement')}</span>
                <span className="font-bold text-on-surface">{t('tracker.aug15')}</span>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low rounded-lg flex items-center gap-4">
              <CheckCircle2 className="w-5 h-5 text-secondary fill-secondary text-white" />
              <span className="text-xs font-body font-medium">{t('tracker.paymentCredit')}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
