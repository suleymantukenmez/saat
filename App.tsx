import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  MinimalClock, 
  NeonCyberClock, 
  RetroTerminalClock, 
  ElegantSerifClock, 
  AnalogClock, 
  HugeBoldClock 
} from './components/ClockRenderers';
import { ClockTheme, QuoteData } from './types';
import { fetchTimeQuote } from './services/geminiService';
import { Maximize, Minimize, Settings, RefreshCcw, Type, Calendar, Clock, Quote as QuoteIcon, Check } from 'lucide-react';

const THEMES = [
  { id: ClockTheme.MINIMAL, name: 'Minimal', color: 'bg-zinc-800' },
  { id: ClockTheme.HUGE_BOLD, name: 'Impact', color: 'bg-zinc-900' },
  { id: ClockTheme.ELEGANT_SERIF, name: 'Elegant', color: 'bg-slate-700' },
  { id: ClockTheme.NEON_CYBER, name: 'Cyber', color: 'bg-fuchsia-900' },
  { id: ClockTheme.RETRO_TERMINAL, name: 'Retro', color: 'bg-green-900' },
  { id: ClockTheme.ANALOG_CLASSIC, name: 'Analog', color: 'bg-blue-900' },
];

function App() {
  const [date, setDate] = useState(new Date());
  const [theme, setTheme] = useState<ClockTheme>(ClockTheme.MINIMAL);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSeconds, setShowSeconds] = useState(true);
  const [showDate, setShowDate] = useState(true);
  const [showQuote, setShowQuote] = useState(true);
  const [quote, setQuote] = useState<QuoteData | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Time update loop
  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Idle detection for controls
  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    }
  }, [handleMouseMove]);

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable fullscreen mode: ${e.message} (${e.name})`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Sync fullscreen state with browser events (e.g., user presses Esc)
  useEffect(() => {
    const onFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullScreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullScreenChange);
  }, []);

  // Fetch Quote
  const getQuote = useCallback(async () => {
    setLoadingQuote(true);
    const data = await fetchTimeQuote();
    if (data) {
      setQuote(data);
    }
    setLoadingQuote(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    getQuote();
    // Refresh quote every hour
    const quoteInterval = setInterval(getQuote, 60 * 60 * 1000); 
    return () => clearInterval(quoteInterval);
  }, [getQuote]);


  // Render correct clock
  const renderClock = () => {
    const props = { date, theme, showSeconds, showDate };
    switch (theme) {
      case ClockTheme.MINIMAL: return <MinimalClock {...props} />;
      case ClockTheme.NEON_CYBER: return <NeonCyberClock {...props} />;
      case ClockTheme.RETRO_TERMINAL: return <RetroTerminalClock {...props} />;
      case ClockTheme.ELEGANT_SERIF: return <ElegantSerifClock {...props} />;
      case ClockTheme.ANALOG_CLASSIC: return <AnalogClock {...props} />;
      case ClockTheme.HUGE_BOLD: return <HugeBoldClock {...props} />;
      default: return <MinimalClock {...props} />;
    }
  };

  // Dynamic background based on theme
  const getBackgroundClass = () => {
    switch (theme) {
      case ClockTheme.MINIMAL: return 'bg-zinc-950';
      case ClockTheme.HUGE_BOLD: return 'bg-black';
      case ClockTheme.NEON_CYBER: return 'bg-[#0f0518]'; // Deep purple black
      case ClockTheme.RETRO_TERMINAL: return 'bg-[#0a0f0a]'; // Very dark green
      case ClockTheme.ELEGANT_SERIF: return 'bg-[#0f172a]'; // Slate 900
      case ClockTheme.ANALOG_CLASSIC: return 'bg-gradient-to-br from-gray-900 to-black';
      default: return 'bg-black';
    }
  };

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-colors duration-700 ${getBackgroundClass()} ${showControls ? 'cursor-default' : 'cursor-none'}`}
    >
      
      {/* Main Clock Content */}
      <main className="absolute inset-0 flex flex-col items-center justify-center p-8 z-0">
        <div className="flex-grow flex items-center justify-center w-full">
            {renderClock()}
        </div>
        
        {/* Quote Section */}
        {showQuote && quote && (
          <div className={`mt-8 max-w-2xl text-center transition-opacity duration-1000 ${showControls ? 'opacity-40' : 'opacity-80'}`}>
            <p className={`text-lg md:text-xl font-light italic tracking-wide mb-2 ${theme === ClockTheme.RETRO_TERMINAL ? 'text-green-400' : theme === ClockTheme.NEON_CYBER ? 'text-fuchsia-300' : 'text-gray-400'}`}>
              "{quote.text}"
            </p>
            <p className={`text-sm uppercase tracking-widest ${theme === ClockTheme.RETRO_TERMINAL ? 'text-green-600' : theme === ClockTheme.NEON_CYBER ? 'text-fuchsia-600' : 'text-gray-600'}`}>
              — {quote.author}
            </p>
          </div>
        )}
      </main>

      {/* Control Bar */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 flex justify-center z-50 transition-transform duration-500 ease-in-out ${showControls ? 'translate-y-0' : 'translate-y-[150%]'}`}>
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col md:flex-row items-center gap-6 max-w-4xl w-full mx-4">
          
          {/* Theme Selector */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0 w-full md:w-auto">
             {THEMES.map((t) => (
               <button
                 key={t.id}
                 onClick={() => setTheme(t.id)}
                 className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${theme === t.id ? 'bg-white text-black scale-105 shadow-lg' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}
               >
                 {t.name}
                 {theme === t.id && <span className="absolute -top-1 -right-1 flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>}
               </button>
             ))}
          </div>

          <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

          {/* Toggles */}
          <div className="flex items-center gap-4 text-white/80">
            <button onClick={() => setShowSeconds(!showSeconds)} className={`p-2 rounded-full transition-colors ${showSeconds ? 'bg-white/20 text-white' : 'hover:bg-white/10'}`} title="Toggle Seconds">
               <Clock size={20} />
            </button>
            <button onClick={() => setShowDate(!showDate)} className={`p-2 rounded-full transition-colors ${showDate ? 'bg-white/20 text-white' : 'hover:bg-white/10'}`} title="Toggle Date">
               <Calendar size={20} />
            </button>
             <button onClick={() => setShowQuote(!showQuote)} className={`p-2 rounded-full transition-colors ${showQuote ? 'bg-white/20 text-white' : 'hover:bg-white/10'}`} title="Toggle Quote">
               <QuoteIcon size={20} />
            </button>
            <button onClick={getQuote} className={`p-2 rounded-full transition-colors hover:bg-white/10 ${loadingQuote ? 'animate-spin' : ''}`} title="Refresh Quote">
               <RefreshCcw size={20} />
            </button>
          </div>

           <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>

           {/* Full Screen */}
           <button 
             onClick={toggleFullScreen}
             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors ml-auto"
           >
             {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
             <span className="hidden md:inline">{isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
           </button>
        </div>
      </div>
    </div>
  );
}

export default App;