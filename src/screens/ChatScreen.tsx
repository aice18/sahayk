import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bot, User, Send, Mic, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { LANGUAGES } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestions?: string[];
}

export default function ChatScreen() {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t('chat.welcome'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = (text: string, messageId: string) => {
    if (isSpeaking === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
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
    
    utterance.onstart = () => setIsSpeaking(messageId);
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const currentLangName = LANGUAGES.find(l => l.id === language)?.label || 'English';
      
      const profileData = localStorage.getItem('sahayk_profile');
      let userContext = '';
      if (profileData) {
        const profile = JSON.parse(profileData);
        userContext = ` The user is a ${profile.age || 'citizen'} whose occupation is '${profile.occupation}' and income is '${profile.income}'. Tailor your advice strictly for this occupation and demographic.`;
      }
      
      const strongInstruction = `${t('chat.systemInstruction', { language: currentLangName })}${userContext} CRITICAL: You MUST reply entirely in the ${currentLangName} language and native script ONLY. Never reply in English unless citing a proper noun.`;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          systemInstruction: strongInstruction
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch AI response');
      }

      const data = await res.json();

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.text || t('chat.errorProcess'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestions: [t('chat.suggestionLand'), t('chat.suggestionApply'), t('chat.suggestionDocs')]
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error: any) {
      console.error(error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error.message || t('chat.errorBrain')}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <header className="bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Sahayk Logo" className="w-10 h-10 object-contain" />
          <h1 className="text-2xl font-bold tracking-tight text-primary font-headline">{t('appName')}</h1>
        </div>
        <button onClick={() => navigate('/profile')} className="p-2.5 rounded-full hover:bg-surface-container transition-all active:scale-90">
          <User className="w-6 h-6 text-primary" />
        </button>
      </header>

      <main ref={scrollRef} className="flex-grow container mx-auto max-w-3xl flex flex-col px-4 pt-4 pb-48 overflow-y-auto hide-scrollbar">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-fixed text-primary rounded-full text-xs font-label font-semibold mb-4">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse"></span>
            {t('chat.online')}
          </div>
          <h2 className="text-3xl font-headline font-bold text-primary mb-2">{t('chat.howHelp')}</h2>
          <p className="text-on-surface-variant text-sm max-w-md mx-auto">{t('chat.askMeAbout')}</p>
        </div>

        <div className="flex flex-col space-y-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary' : 'bg-secondary'}`}>
                  {msg.role === 'assistant' ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-white" />}
                </div>
                <div className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : ''}`}>
                  <div className={`p-4 rounded-2xl shadow-sm border border-outline-variant/15 relative group ${
                    msg.role === 'assistant' 
                      ? 'bg-surface-container-lowest chat-bubble-received' 
                      : 'bg-primary text-on-primary chat-bubble-sent'
                  }`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    {msg.role === 'assistant' && (
                      <button 
                        onClick={() => speak(msg.content, msg.id)}
                        className="absolute -right-10 top-0 p-2 bg-surface-container-low rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-primary shadow-sm"
                      >
                        {isSpeaking === msg.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] font-label text-outline">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <div className="flex gap-3 max-w-[85%] items-center">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                <Bot className="w-4 h-4 text-slate-400" />
              </div>
              <div className="bg-slate-100 px-4 py-2 rounded-full flex gap-1 items-center">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-24 left-0 right-0 z-40 px-4 sm:px-6 flex justify-center">
        <div className="w-full max-w-3xl bg-surface-container-lowest/80 backdrop-blur-xl border border-outline-variant/15 p-2.5 rounded-full shadow-[0px_12px_32px_rgba(25,28,30,0.08)] flex items-center gap-2 sm:gap-3">
          <input 
            className="flex-grow min-w-0 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline/60 font-body px-3 py-3 rounded-full"
            placeholder={t('chat.placeholder')} 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button className="w-10 h-10 flex items-center justify-center bg-surface-container text-on-surface rounded-full hover:bg-surface-container-high transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button 
            onClick={handleSend}
            className="w-10 h-10 flex items-center justify-center bg-primary-fixed text-primary rounded-full hover:bg-primary-fixed-dim transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
