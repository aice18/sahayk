import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Menu, ArrowRight, FileText, Verified, Wheat, School, Building2, History, Bot, User, Plus, Home, ChevronRight, HeartPulse } from 'lucide-react';
import { SCHEMES, LANGUAGES } from '../constants';
import { useLanguage } from '../LanguageContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CategoryIcon = ({ category, className }: { category: string; className?: string }) => {
  switch (category) {
    case 'Farmer': return <Wheat className={className} />;
    case 'Health': return <HeartPulse className={className} />;
    case 'Housing': return <Home className={className} />;
    default: return <FileText className={className} />;
  }
};

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [dbSchemes, setDbSchemes] = useState<any[]>([]);

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const profileData = localStorage.getItem('sahayk_profile');
    let occupationFilter = null;
    if (profileData) {
      const profile = JSON.parse(profileData);
      setUserProfile(profile);
      occupationFilter = profile.occupation;
    }

    const fetchSchemes = async () => {
      let query = supabase.from('schemes').select('*');
      
      // If student -> Education/General, farmer -> Agriculture, business -> Entrepreneurship
      if (occupationFilter === 'farmer') {
        query = query.eq('category', 'Agriculture');
      } else if (occupationFilter === 'business') {
        query = query.in('category', ['Entrepreneurship & Loans', 'Business']);
      } else if (occupationFilter === 'student') {
        query = query.in('category', ['Education', 'Digital India']);
      }
      // Else fetch generically or everything
      
      const { data, error } = await query;
      if (data && data.length > 0) {
        setDbSchemes(data);
      }
    };
    
    fetchSchemes();
  }, []);

  const currentLang = LANGUAGES.find(l => l.id === language);
  let baseSchemes = dbSchemes.length > 0 ? dbSchemes : SCHEMES;

  if (userProfile) {
    if (userProfile.occupation === 'farmer') {
      baseSchemes = baseSchemes.filter(s => ['Farmer', 'Agriculture'].includes(s.category));
    } else if (userProfile.occupation === 'business') {
      baseSchemes = baseSchemes.filter(s => ['Business', 'Entrepreneurship & Loans'].includes(s.category));
    } else if (userProfile.occupation === 'student') {
      baseSchemes = baseSchemes.filter(s => ['Education', 'Digital India'].includes(s.category));
    }
  }

  // Ensure at least some fallback items show up if the filter completely blanks out the view
  const activeSchemes = baseSchemes.length > 0 ? baseSchemes : SCHEMES;

  if (activeSchemes.length === 0) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center p-10">
        <div className="text-center">
          <h2 className="text-2xl font-black font-headline mb-4">No Specialized Schemes Found</h2>
          <p className="opacity-70 mb-8">Try adjusting your profile to see more recommendations.</p>
          <button onClick={() => navigate('/profile')} className="bg-primary text-white px-8 py-3 rounded-full font-black">Edit Profile</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-40">
      <header className="bg-surface/90 backdrop-blur-xl flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-black tracking-tighter text-primary font-headline">{t('appName').toUpperCase()}</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-90">
          <User className="w-6 h-6 text-primary" />
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 relative overflow-hidden rounded-[2.5rem] p-10 bg-primary text-on-primary shadow-2xl"
        >
          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">Live Dashboard</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black font-headline leading-[0.9] mb-6 tracking-tighter text-white">
              {t('dashboard.greeting', { name: 'Rajesh' })}
            </h2>
            <p className="text-xl opacity-80 font-body mb-10 leading-relaxed max-w-lg">
              {t('dashboard.eligibleCount', { count: 12 })} {t('dashboard.lastApp', { scheme: 'PM Kisan' })}
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate('/report')} className="bg-white text-primary px-8 py-4 rounded-full font-black text-sm flex items-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95">
                <FileText className="w-5 h-5" />
                {t('dashboard.checkEligibility')}
              </button>
              <button onClick={() => navigate('/profile')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-full font-black text-sm hover:bg-white/20 transition-all active:scale-95">
                {t('dashboard.viewProfile')}
              </button>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-[80px]"></div>
        </motion.section>

        <section className="mb-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] font-label mb-2 block">Personalized</span>
              <h3 className="text-4xl font-black font-headline text-on-surface tracking-tighter">{t('dashboard.bestForYou')}</h3>
            </div>
            <button onClick={() => navigate('/discover')} className="text-primary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all">
              {t('dashboard.exploreAll')} <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              onClick={() => navigate(`/scheme/${activeSchemes[0].id}`)}
              className="lg:col-span-2 group relative h-[480px] rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <img alt="Scheme visual" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" src={activeSchemes[0].imageUrl || 'https://picsum.photos/800/600'} />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-10 w-full">
                <span className="bg-secondary text-on-secondary px-4 py-1.5 rounded-full text-[10px] font-black font-label mb-6 inline-block tracking-widest uppercase">{t('dashboard.mostPopular')}</span>
                <div className="flex items-center gap-4 mb-4">
                  <CategoryIcon category={activeSchemes[0].category} className="w-8 h-8 text-white/90" />
                  <h4 className="text-white text-4xl font-black font-headline tracking-tighter">
                    {activeSchemes[0].titleKey ? t(activeSchemes[0].titleKey) : activeSchemes[0].title}
                  </h4>
                </div>
                <p className="text-white/70 font-body mb-8 max-w-xl text-lg leading-relaxed">
                  {activeSchemes[0].descriptionKey ? t(activeSchemes[0].descriptionKey) : activeSchemes[0].description}
                </p>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/apply/${activeSchemes[0].id}`);
                  }}
                  className="bg-white text-primary px-10 py-4 rounded-full font-black text-sm hover:bg-primary-fixed transition-all shadow-lg"
                >
                  {t('dashboard.applyNow')}
                </button>
              </div>
            </motion.div>

            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/15 flex flex-col justify-between shadow-lg hover:shadow-xl transition-all">
              {activeSchemes.length > 1 ? (
                <>
                  <div>
                    <div className="w-16 h-16 rounded-2xl bg-primary-fixed flex items-center justify-center mb-8 shadow-inner">
                      <CategoryIcon category={activeSchemes[1].category} className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                      <CategoryIcon category={activeSchemes[1].category} className="w-5 h-5 text-primary/40" />
                      <h4 className="text-2xl font-black font-headline tracking-tight">
                        {activeSchemes[1].titleKey ? t(activeSchemes[1].titleKey) : activeSchemes[1].title}
                      </h4>
                    </div>
                    <p className="text-on-surface-variant text-base font-body leading-relaxed">
                      {activeSchemes[1].descriptionKey ? t(activeSchemes[1].descriptionKey) : activeSchemes[1].description}
                    </p>
                  </div>
                  <div className="mt-10">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-secondary/5 rounded-2xl border border-secondary/10">
                      <Verified className="w-5 h-5 text-secondary" />
                      <span className="text-xs font-black text-secondary tracking-wider uppercase">{t('dashboard.verifiedEligibility')}</span>
                    </div>
                    <button onClick={() => navigate(`/scheme/${activeSchemes[1].id}`)} className="w-full py-4 rounded-full bg-surface-container-high text-on-surface font-black text-sm hover:bg-primary hover:text-white transition-all shadow-sm">{t('dashboard.viewDetails')}</button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full opacity-50">
                   <p className="font-bold text-center">Complete more profile details to unlock secondary matches.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-3xl font-black font-headline tracking-tighter">{t('dashboard.eligibleSchemes')}</h3>
              <button className="p-3 rounded-2xl border border-outline-variant/30 hover:bg-surface-container transition-all active:scale-90">
                <Menu className="w-5 h-5 text-primary" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {activeSchemes.map((scheme: any) => (
                <motion.div 
                  key={scheme.id}
                  whileHover={{ x: 10, scale: 1.01 }}
                  onClick={() => navigate(`/scheme/${scheme.id}`)}
                  className="p-8 rounded-[2rem] bg-surface-container-low hover:bg-white hover:shadow-2xl transition-all flex items-center gap-8 cursor-pointer group border border-transparent hover:border-outline-variant/20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-outline-variant/10 group-hover:bg-primary-fixed transition-colors">
                    <CategoryIcon category={scheme.category} className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon category={scheme.category} className="w-4 h-4 text-primary/40" />
                        <h4 className="font-black text-xl font-headline group-hover:text-primary transition-colors tracking-tight">
                          {scheme.titleKey ? t(scheme.titleKey) : scheme.title}
                        </h4>
                      </div>
                      <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest ${
                        scheme.category === 'Farmer' ? 'bg-secondary-container text-secondary' : 'bg-primary-fixed text-primary'
                      }`}>
                        {scheme.category || 'General'}
                      </span>
                    </div>
                    <p className="text-on-surface-variant text-sm font-body line-clamp-2 leading-relaxed opacity-80">
                      {scheme.descriptionKey ? t(scheme.descriptionKey) : scheme.description}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-4 space-y-10">
            <div className="bg-surface-container-lowest p-10 rounded-[2.5rem] border border-outline-variant/15 shadow-lg">
              <h3 className="text-xl font-black font-headline mb-8 tracking-tight">{t('dashboard.recentlyViewed')}</h3>
              <div className="space-y-8">
                <div className="flex gap-5 items-start group cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-primary mt-2 ring-4 ring-primary/10"></div>
                  <div>
                    <p className="text-base font-black font-body leading-tight group-hover:text-primary transition-colors">{t('dashboard.nsap')}</p>
                    <p className="text-xs text-on-surface-variant font-label mt-2 opacity-60">{t('dashboard.viewedHours', { count: 2 })}</p>
                  </div>
                </div>
                <div className="flex gap-5 items-start group cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-secondary mt-2 ring-4 ring-secondary/10"></div>
                  <div>
                    <p className="text-base font-black font-body leading-tight group-hover:text-secondary transition-colors">{t('dashboard.mudra')}</p>
                    <p className="text-xs text-on-surface-variant font-label mt-2 opacity-60">{t('dashboard.viewedYesterday')}</p>
                  </div>
                </div>
              </div>
              <button className="w-full mt-10 text-primary font-black text-xs uppercase tracking-widest border-t border-outline-variant/10 pt-6 text-center hover:opacity-70 transition-opacity">{t('dashboard.clearHistory')}</button>
            </div>

            <div className="bg-primary p-10 rounded-[2.5rem] text-on-primary relative overflow-hidden shadow-2xl group cursor-pointer">
              <div className="relative z-10">
                <h4 className="text-2xl font-black font-headline mb-3 tracking-tighter">{t('dashboard.askAi')}</h4>
                <p className="text-base text-on-primary/70 mb-8 leading-relaxed">{t('dashboard.askAiPlaceholder')}</p>
                <button onClick={() => navigate('/assistant')} className="bg-white text-primary px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">{t('dashboard.tryNow')}</button>
              </div>
              <Bot className="absolute -bottom-6 -right-6 w-32 h-32 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function ChevronRightIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
  )
}
