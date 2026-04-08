import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, FileCheck, Verified, Lightbulb, Download, Share2, CheckSquare, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../LanguageContext';

const MOCK_DATA = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
];

export default function ReportGeneratorScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [lang, setLang] = useState('English');
  const [filters, setFilters] = useState({
    applied: true,
    eligibility: true,
    status: false
  });

  const toggleFilter = (key: keyof typeof filters) => {
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <nav className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-surface-container transition-colors">
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden border-2 border-outline-variant/15">
          <img alt="User Profile" className="w-full h-full object-cover" src="https://picsum.photos/seed/user/100/100" />
        </div>
      </nav>

      <main className="pt-24 pb-48 px-6 max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-[3.5rem] leading-[0.9] font-extrabold font-headline tracking-tighter text-primary mb-4">{t('report.title').split(' ').join('<br/>')}</h2>
              <p className="text-lg font-body text-on-surface-variant max-w-md">{t('report.subtitle')}</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold font-label text-outline uppercase tracking-widest">{t('report.langLabel')}</span>
              <div className="bg-surface-container-lowest p-1.5 rounded-full flex gap-1 border border-outline-variant/15 shadow-sm">
                {['English', 'Hindi', 'Marathi'].map(l => (
                  <button 
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${lang === l ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface-container'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xs font-bold font-label text-outline uppercase tracking-[0.2em] mb-4">{t('report.selectComponents')}</h3>
            
            <motion.div 
              onClick={() => toggleFilter('applied')}
              className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${filters.applied ? 'bg-surface-container-lowest border-primary shadow-md' : 'bg-surface-container-low border-transparent opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${filters.applied ? 'bg-primary-fixed text-primary' : 'bg-surface-container-highest text-outline'}`}>
                  <FileCheck className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${filters.applied ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                  {filters.applied && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t('report.appliedSchemes')}</h4>
              <p className="text-sm text-on-surface-variant font-body">{t('report.appliedDesc')}</p>
            </motion.div>

            <motion.div 
              onClick={() => toggleFilter('eligibility')}
              className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${filters.eligibility ? 'bg-primary text-on-primary border-primary shadow-md' : 'bg-surface-container-low border-transparent opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${filters.eligibility ? 'bg-white/10 text-white' : 'bg-surface-container-highest text-outline'}`}>
                  <Verified className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${filters.eligibility ? 'bg-white border-white' : 'border-white/20'}`}>
                  {filters.eligibility && <CheckSquare className="w-4 h-4 text-primary" />}
                </div>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t('report.eligibilitySummary')}</h4>
              <p className={`text-sm font-body ${filters.eligibility ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{t('report.eligibilityDesc')}</p>
            </motion.div>

            <motion.div 
              onClick={() => toggleFilter('status')}
              className={`p-6 rounded-[1.5rem] border-2 transition-all cursor-pointer ${filters.status ? 'bg-surface-container-lowest border-primary shadow-md' : 'bg-surface-container-low border-transparent opacity-60'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${filters.status ? 'bg-surface-container-highest text-on-surface' : 'bg-surface-container-highest text-outline'}`}>
                  <Lightbulb className="w-6 h-6" />
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${filters.status ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                  {filters.status && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
              </div>
              <h4 className="text-xl font-bold font-headline mb-2">{t('report.statusOverview')}</h4>
              <p className="text-sm text-on-surface-variant font-body">{t('report.statusDesc')}</p>
            </motion.div>
          </div>

          <div className="lg:col-span-7 sticky top-24">
            <h3 className="text-xs font-bold font-label text-outline uppercase tracking-[0.2em] mb-4">{t('report.interactivePreview')}</h3>
            <div className="bg-white border border-outline-variant/20 rounded-[2rem] shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
              <div className="bg-primary p-8 text-on-primary">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold font-headline">{t('report.officialReport')}</h1>
                  <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full">{t('report.confidential')}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t('report.generatedFor')}</p>
                    <p className="font-bold">Rajesh Kumar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{t('report.date')}</p>
                    <p className="font-bold">Oct 24, 2024</p>
                  </div>
                </div>
              </div>

              <div className="p-8 flex-1 space-y-8">
                {filters.applied && (
                  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/10 pb-2">{t('report.activeApps')}</h5>
                    <div className="space-y-3">
                      {[1, 2].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 bg-surface-container-lowest border border-outline-variant/10 rounded-lg">
                          <div>
                            <p className="text-sm font-bold">{t('scheme.pmKisanTitle')}</p>
                            <p className="text-[10px] text-outline">ID: SK-2024-00{i}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-1 bg-secondary-container/20 text-secondary rounded">{t('report.verified')}</span>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {filters.eligibility && (
                  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/10 pb-2">{t('report.analytics')}</h5>
                    <div className="h-48 w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={MOCK_DATA}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                          <YAxis hide />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
                            cursor={{ fill: '#f7f9fb' }}
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {MOCK_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#00236f' : '#006e2d'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.section>
                )}

                {filters.status && (
                  <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h5 className="text-xs font-bold text-primary uppercase tracking-widest mb-4 border-b border-primary/10 pb-2">{t('report.progress')}</h5>
                    <div className="space-y-4">
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-3/4"></div>
                      </div>
                      <p className="text-[10px] text-on-surface-variant text-center">{t('report.progressDesc', { percent: 75 })}</p>
                    </div>
                  </motion.section>
                )}

                {!filters.applied && !filters.eligibility && !filters.status && (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <BarChart3 className="w-12 h-12 text-outline-variant mb-4" />
                    <p className="text-on-surface-variant font-body">{t('report.selectToBuild')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-lg z-40">
          <div className="bg-white/80 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-[2rem] shadow-2xl flex items-center justify-between gap-4">
            <button className="flex-1 bg-primary text-on-primary py-4 rounded-full font-bold font-headline flex items-center justify-center gap-3 active:scale-95 transition-transform hover:shadow-lg">
              <Download className="w-5 h-5" />
              {t('report.generatePdf')}
            </button>
            <button className="p-4 bg-surface-container-highest text-primary rounded-full hover:bg-surface-variant transition-colors active:scale-90 duration-200">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
