import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Bot, User, Search } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const hideNavPaths = ['/', '/auth', '/language', '/onboarding'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  if (shouldHideNav) {
    return <>{children}</>;
  }

  const navItems = [
    { id: 'dashboard', icon: Home, label: t('dashboard.home'), path: '/dashboard' },
    { id: 'tracker', icon: ClipboardList, label: t('dashboard.tracker'), path: '/tracker' },
    { id: 'assistant', icon: Bot, label: t('dashboard.assistant'), path: '/assistant' },
    { id: 'discover', icon: Search, label: t('discover'), path: '/discover' },
    { id: 'profile', icon: User, label: t('dashboard.profile'), path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-grow pb-24">
        {children}
      </div>
      
      <nav className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-2xl border-t border-outline-variant/10 px-4 sm:px-6 py-3 z-50">
        <div className="w-full max-w-xl mx-auto flex justify-between items-center gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`relative flex-1 min-w-0 flex flex-col items-center gap-1.5 py-2 transition-all duration-300 rounded-2xl ${
                  isActive ? 'text-primary scale-105' : 'text-outline hover:text-on-surface-variant'
                }`}
              >
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-primary/10 shadow-sm' : 'bg-surface-container'}`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="w-1 h-1 bg-primary rounded-full absolute -bottom-1"></div>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
