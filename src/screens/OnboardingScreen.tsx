import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, ShieldCheck, Bot, ChevronLeft, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import { InterestSelector } from '../components/InterestSelector';
import { api } from '../lib/api';

const OCCUPATIONS = [
  { id: 'farmer', icon: 'agriculture' },
  { id: 'salaried', icon: 'work' },
  { id: 'student', icon: 'person_search' },
  { id: 'business', icon: 'storefront' },
  { id: 'artisan', icon: 'engineering' },
  { id: 'other', icon: 'more_horiz' },
];

const INTERESTS = [
  { id: 'agriculture', name: 'Agriculture & Farming', icon: '🌾', color: '#60A744' },
  { id: 'healthcare', name: 'Healthcare & Medical', icon: '🏥', color: '#E74C3C' },
  { id: 'education', name: 'Education & Scholarships', icon: '📚', color: '#3498DB' },
  { id: 'housing', name: 'Housing & Infrastructure', icon: '🏠', color: '#E67E22' },
  { id: 'business', name: 'Business & Entrepreneurship', icon: '💼', color: '#9B59B6' },
  { id: 'women', name: 'Women Empowerment', icon: '👩', color: '#F39C12' },
  { id: 'youth', name: 'Youth & Sports', icon: '⚽', color: '#1ABC9C' },
  { id: 'elderly', name: 'Elderly & Pension', icon: '👴', color: '#95A5A6' },
  { id: 'disability', name: 'Disability & Welfare', icon: '♿', color: '#34495E' },
  { id: 'employment', name: 'Employment & Skill', icon: '💪', color: '#16A085' },
  { id: 'finance', name: 'Financial Services', icon: '🏦', color: '#D35400' },
  { id: 'environment', name: 'Environment & Climate', icon: '🌱', color: '#27AE60' },
  { id: 'social', name: 'Social Welfare', icon: '🤝', color: '#2980B9' },
  { id: 'digital', name: 'Digital & Technology', icon: '💻', color: '#2C3E50' },
  { id: 'energy', name: 'Energy & Renewable', icon: '⚡', color: '#F1C40F' },
];

const CASTE_CATEGORIES = [
  { id: 'general', name: 'General', label: 'General' },
  { id: 'obc', name: 'OBC', label: 'Other Backward Class' },
  { id: 'sc', name: 'SC', label: 'Scheduled Caste' },
  { id: 'st', name: 'ST', label: 'Scheduled Tribe' },
  { id: 'prefer_not_to_say', name: 'Prefer Not to Say', label: 'Prefer Not to Say' },
];

const RATION_CARD_TYPES = [
  { id: 'apl', name: 'APL', label: 'Above Poverty Line' },
  { id: 'bpl', name: 'BPL', label: 'Below Poverty Line' },
  { id: 'antyodaya', name: 'Antyodaya', label: 'Antyodaya Anna Yojana' },
  { id: 'none', name: 'No Ration Card', label: 'No Ration Card' },
];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [occupation, setOccupation] = useState('student');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [caste, setCaste] = useState('');
  const [rationCard, setRationCard] = useState('');
  const [schemes, setSchemes] = useState<any[]>([]);
  const [selectedSchemes, setSelectedSchemes] = useState<string[]>([]);
  const [digiLockerConnected, setDigiLockerConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const totalSteps = 6;

  // Fetch schemes on component mount
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const schemesData = await api.getSchemes();
        setSchemes(schemesData || []);
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
      }
    };
    fetchSchemes();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      const nameInput = document.getElementById('full_name') as HTMLInputElement;
      const ageInput = document.getElementById('age') as HTMLInputElement;
      const incomeSelect = document.getElementById('income') as HTMLSelectElement;
      
      const profile = {
        name: nameInput?.value,
        age: ageInput?.value,
        income: incomeSelect?.value,
        occupation,
        interests: selectedInterests,
        caste,
        rationCard,
        appliedSchemes: digiLockerConnected ? selectedSchemes : [],
      };
      localStorage.setItem('sahayk_profile', JSON.stringify(profile));

      // Auto-apply for schemes if DigiLocker connected
      if (digiLockerConnected && selectedSchemes.length > 0) {
        for (const schemeId of selectedSchemes) {
          try {
            await api.applyForScheme(schemeId);
          } catch (error) {
            console.error(`Failed to apply for scheme ${schemeId}:`, error);
          }
        }
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during onboarding:', error);
      alert('Error completing onboarding. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 fixed top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
      </header>

      <main className="flex-grow pt-24 pb-12 px-6 flex flex-col items-center">
        <div className="w-full max-w-xl mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="font-label text-sm font-semibold text-primary">
              {t('onboarding.step')} {step}/{totalSteps}
            </span>
          </div>
          <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="w-full max-w-xl">
          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* STEP 1: Basic Info */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    {t('onboarding.basicInfo') || 'Basic Information'}
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    {t('onboarding.basicInfoDesc') || 'Tell us about yourself to personalize your experience'}
                  </p>
                </div>

                <div className="mb-8 p-4 bg-primary-container/20 rounded-xl border border-primary/20 flex flex-col items-center justify-center text-center">
                  <ShieldCheck className="w-8 h-8 text-primary mb-2" />
                  <h3 className="font-headline font-bold text-on-surface mb-1">Verify with DigiLocker</h3>
                  <p className="font-body text-sm text-on-surface-variant mb-4">Securely import your Aadhaar and Income profile instantly.</p>
                  <button 
                    type="button"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      (document.getElementById('full_name') as HTMLInputElement).value = 'Ayush Kumar'; 
                      (document.getElementById('age') as HTMLInputElement).value = '21'; 
                      (document.getElementById('income') as HTMLSelectElement).value = 'Below ₹2.5L'; 
                      setOccupation('student'); 
                      alert('Successfully connected to DigiLocker!'); 
                    }}
                    className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-headline font-bold px-6 py-3 rounded-full shadow transition-all active:scale-95"
                  >
                    Connect to DigiLocker
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="full_name">
                    {t('onboarding.fullName')}
                  </label>
                  <input 
                    className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all font-body" 
                    id="full_name" 
                    placeholder={t('onboarding.fullName')} 
                    type="text" 
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="age">
                      {t('onboarding.age')}
                    </label>
                    <input 
                      className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary/20 transition-all font-body" 
                      id="age" 
                      placeholder={t('onboarding.age')} 
                      type="number" 
                      required
                    />
                  </div>
                  <div className="md:col-span-3 space-y-2">
                    <label className="font-label text-sm font-semibold text-on-surface-variant px-1" htmlFor="income">
                      {t('onboarding.income')}
                    </label>
                    <select className="w-full bg-surface-container-highest border-none rounded-xl px-4 py-4 text-on-surface focus:ring-2 focus:ring-primary/20 transition-all font-body appearance-none" id="income" required>
                      <option disabled value="">{t('onboarding.incomeRanges.select')}</option>
                      <option>{t('onboarding.incomeRanges.below25')}</option>
                      <option>{t('onboarding.incomeRanges.between25_5')}</option>
                      <option>{t('onboarding.incomeRanges.between5_10')}</option>
                      <option>{t('onboarding.incomeRanges.above10')}</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Occupation */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    {t('onboarding.selectOccupation') || 'What\'s your occupation?'}
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    {t('onboarding.selectOccupationDesc') || 'This helps us recommend relevant schemes'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant px-1">
                    {t('onboarding.occupation')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {OCCUPATIONS.map((occ) => (
                      <button 
                        key={occ.id}
                        type="button"
                        onClick={() => setOccupation(occ.id)}
                        className={`group flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                          occupation === occ.id 
                            ? 'bg-primary-fixed border-primary/20' 
                            : 'bg-surface-container-low border-transparent hover:border-primary/20 hover:bg-surface-container-lowest'
                        }`}
                      >
                        <span className={`material-symbols-outlined mb-2 ${occupation === occ.id ? 'text-primary' : 'text-outline group-hover:text-primary'}`} style={{ fontVariationSettings: occupation === occ.id ? "'FILL' 1" : "" }}>
                          {occ.icon}
                        </span>
                        <span className={`font-label text-xs ${occupation === occ.id ? 'font-bold text-primary' : 'font-medium text-on-surface-variant group-hover:text-primary'}`}>
                          {t(`onboarding.occupations.${occ.id}`)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Caste & Ration Card Info */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    Additional Information
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    This helps us identify all eligible schemes for you
                  </p>
                </div>

                {/* Caste Information */}
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant px-1">
                    Caste Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {CASTE_CATEGORIES.map((cat) => (
                      <button 
                        key={cat.id}
                        type="button"
                        onClick={() => setCaste(cat.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          caste === cat.id 
                            ? 'bg-primary-fixed border-primary/50' 
                            : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/30'
                        }`}
                      >
                        <p className={`font-headline font-bold ${caste === cat.id ? 'text-primary' : 'text-on-surface'}`}>
                          {cat.name}
                        </p>
                        <p className={`font-body text-xs ${caste === cat.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {cat.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ration Card Type */}
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant px-1">
                    Ration Card Type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {RATION_CARD_TYPES.map((rct) => (
                      <button 
                        key={rct.id}
                        type="button"
                        onClick={() => setRationCard(rct.id)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          rationCard === rct.id 
                            ? 'bg-primary-fixed border-primary/50' 
                            : 'bg-surface-container-low border-outline-variant/30 hover:border-primary/30'
                        }`}
                      >
                        <p className={`font-headline font-bold ${rationCard === rct.id ? 'text-primary' : 'text-on-surface'}`}>
                          {rct.name}
                        </p>
                        <p className={`font-body text-xs ${rationCard === rct.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {rct.label}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Interests */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    {t('onboarding.selectInterests') || 'What interests you?'}
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    {t('onboarding.selectInterestsDesc') || 'Pick areas relevant to your needs'}
                  </p>
                </div>

                <div className="space-y-4">
                  <InterestSelector
                    interests={INTERESTS}
                    selectedInterests={selectedInterests}
                    onSelectionChange={setSelectedInterests}
                    maxSelections={5}
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 5: All Schemes */}
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    Available Schemes
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    Connect with DigiLocker to auto-apply for eligible schemes
                  </p>
                </div>

                {/* DigiLocker Connection */}
                <div className={`p-6 rounded-xl border-2 transition-all ${
                  digiLockerConnected 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-primary-container/20 border-primary/20'
                }`}>
                  <div className="flex items-start gap-3 mb-4">
                    {digiLockerConnected ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    ) : (
                      <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-headline font-bold text-on-surface mb-1">
                        {digiLockerConnected ? 'DigiLocker Connected' : 'Verify with DigiLocker'}
                      </h3>
                      <p className="font-body text-sm text-on-surface-variant mb-4">
                        {digiLockerConnected 
                          ? 'You can now auto-apply for all eligible schemes' 
                          : 'Securely connect your Aadhaar to auto-apply for schemes'}
                      </p>
                    </div>
                  </div>
                  
                  {!digiLockerConnected && (
                    <button 
                      type="button"
                      onClick={() => {
                        setDigiLockerConnected(true);
                        // Auto-select all relevant schemes based on profile
                        const relevantSchemes = schemes.map(s => s.id);
                        setSelectedSchemes(relevantSchemes);
                        alert('Successfully connected to DigiLocker! All eligible schemes have been selected.');
                      }}
                      className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-headline font-bold px-6 py-3 rounded-lg shadow transition-all active:scale-95"
                    >
                      Connect to DigiLocker
                    </button>
                  )}
                </div>

                {/* All Schemes Display */}
                <div className="space-y-2">
                  <label className="font-label text-sm font-semibold text-on-surface-variant px-1">
                    Select Schemes to Apply
                  </label>
                  <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                    {schemes.length > 0 ? (
                      schemes.map((scheme) => (
                        <label 
                          key={scheme.id}
                          className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant/30 hover:bg-surface-container/50 cursor-pointer transition-all"
                        >
                          <input 
                            type="checkbox"
                            checked={selectedSchemes.includes(scheme.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSchemes([...selectedSchemes, scheme.id]);
                              } else {
                                setSelectedSchemes(selectedSchemes.filter(id => id !== scheme.id));
                              }
                            }}
                            disabled={!digiLockerConnected}
                            className="w-5 h-5 rounded text-primary focus:ring-2 focus:ring-primary/20 flex-shrink-0 mt-1"
                          />
                          <div className="flex-1">
                            <p className="font-headline font-bold text-on-surface">
                              {scheme.name}
                            </p>
                            <p className="font-body text-sm text-on-surface-variant mt-1">
                              {scheme.description}
                            </p>
                            {scheme.category && (
                              <div className="mt-2">
                                <span className="inline-block px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">
                                  {scheme.category}
                                </span>
                              </div>
                            )}
                          </div>
                        </label>
                      ))
                    ) : (
                      <p className="text-center text-on-surface-variant py-8">Loading schemes...</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Summary */}
            {step === 6 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-headline text-3xl font-extrabold text-on-surface mb-3">
                    {t('onboarding.review') || 'Review Your Profile'}
                  </h2>
                  <p className="font-body text-on-surface-variant text-lg leading-relaxed">
                    {t('onboarding.reviewDesc') || 'Make sure everything looks correct'}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                      {t('onboarding.fullName')}
                    </p>
                    <p className="font-headline font-bold text-on-surface">
                      {(document.getElementById('full_name') as HTMLInputElement)?.value || 'N/A'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                      <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        {t('onboarding.age')}
                      </p>
                      <p className="font-headline font-bold text-on-surface">
                        {(document.getElementById('age') as HTMLInputElement)?.value || 'N/A'}
                      </p>
                    </div>

                    <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                      <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                        {t('onboarding.income')}
                      </p>
                      <p className="font-headline font-bold text-on-surface">
                        {(document.getElementById('income') as HTMLSelectElement)?.value || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                      {t('onboarding.occupation')}
                    </p>
                    <p className="font-headline font-bold text-on-surface">
                      {t(`onboarding.occupations.${occupation}`)}
                    </p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                      Caste Category
                    </p>
                    <p className="font-headline font-bold text-on-surface">
                      {CASTE_CATEGORIES.find(c => c.id === caste)?.label || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                      Ration Card Type
                    </p>
                    <p className="font-headline font-bold text-on-surface">
                      {RATION_CARD_TYPES.find(r => r.id === rationCard)?.label || 'N/A'}
                    </p>
                  </div>

                  <div className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/30">
                    <p className="font-label text-xs uppercase tracking-wider text-on-surface-variant mb-1">
                      {t('onboarding.selectedInterests') || 'Interests'}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedInterests.length > 0 ? (
                        selectedInterests.map(id => {
                          const interest = INTERESTS.find(i => i.id === id);
                          return (
                            <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
                              {interest?.icon} {interest?.name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-on-surface-variant">No interests selected</span>
                      )}
                    </div>
                  </div>

                  {digiLockerConnected && selectedSchemes.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-xl border border-green-300">
                      <p className="font-label text-xs uppercase tracking-wider text-green-700 mb-1">
                        Schemes to Auto-Apply
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedSchemes.map(id => {
                          const scheme = schemes.find(s => s.id === id);
                          return (
                            <span key={id} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-200 text-green-700 text-sm font-medium">
                              ✓ {scheme?.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-8 flex gap-4">
              {step > 1 && (
                <button 
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-surface-container text-on-surface py-5 rounded-full font-headline font-bold text-lg border border-outline-variant hover:bg-surface-container-highest transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {t('common.back') || 'Back'}
                </button>
              )}
              
              <button 
                type="submit"
                disabled={
                  (step === 3 && !caste) || 
                  (step === 4 && selectedInterests.length === 0) ||
                  loading
                }
                className={`flex-1 ${
                  (step === 3 && !caste) || 
                  (step === 4 && selectedInterests.length === 0) ||
                  loading
                    ? 'bg-surface-container text-on-surface-variant cursor-not-allowed opacity-50'
                    : 'bg-primary text-on-primary hover:opacity-90'
                } py-5 rounded-full font-headline font-bold text-lg shadow-lg shadow-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                    Processing...
                  </>
                ) : step === totalSteps ? (
                  <>
                    {t('onboarding.saveContinue') || 'Complete Setup'}
                    <ChevronRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    {t('common.next') || 'Next'}
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-outline">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-label text-[11px] uppercase tracking-wider">{t('onboarding.secureEncryption')}</span>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-xl z-50">
        <div className="bg-surface-container-lowest/40 backdrop-blur-xl border border-outline-variant/15 rounded-full px-6 py-4 shadow-[0px_12px_32px_rgba(25,28,30,0.06)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-on-primary" />
            </div>
            <p className="font-body text-sm text-on-surface font-medium">{t('onboarding.needHelp')}</p>
          </div>
          <button onClick={() => navigate('/assistant')} className="text-primary font-label text-sm font-bold px-4 py-1.5 hover:bg-primary-fixed rounded-full transition-colors">
            {t('onboarding.askAi')}
          </button>
        </div>
      </div>
    </div>
  );
}
