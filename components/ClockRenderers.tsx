import React, { useMemo } from 'react';
import { ClockTheme } from '../types';

interface ClockRendererProps {
  date: Date;
  theme: ClockTheme;
  showSeconds: boolean;
  showDate: boolean;
}

// Helper to format time
const formatTime = (date: Date, showSeconds: boolean) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return { hours, minutes, seconds };
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(navigator.language, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const MinimalClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
  const { hours, minutes, seconds } = formatTime(date, showSeconds);
  return (
    <div className="flex flex-col items-center justify-center text-white font-[Inter]">
      <div className="flex items-baseline leading-none">
        <span className="text-[15vw] font-light tracking-tighter">{hours}</span>
        <span className="text-[15vw] font-light animate-pulse mx-2">:</span>
        <span className="text-[15vw] font-light tracking-tighter">{minutes}</span>
        {showSeconds && (
          <span className="text-[5vw] font-thin ml-4 text-gray-400 opacity-80">{seconds}</span>
        )}
      </div>
      {showDate && <div className="text-[2vw] font-light tracking-widest uppercase mt-4 text-gray-400">{formatDate(date)}</div>}
    </div>
  );
};

export const NeonCyberClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
  const { hours, minutes, seconds } = formatTime(date, showSeconds);
  return (
    <div className="flex flex-col items-center justify-center font-[Orbitron]">
      <div className="flex items-baseline leading-none select-none" style={{
        textShadow: '0 0 10px #d946ef, 0 0 20px #d946ef, 0 0 40px #a855f7'
      }}>
        <span className="text-[18vw] font-bold text-fuchsia-100">{hours}</span>
        <span className="text-[18vw] font-bold text-fuchsia-200 mx-2">:</span>
        <span className="text-[18vw] font-bold text-fuchsia-100">{minutes}</span>
      </div>
      {showSeconds && (
        <div className="text-[4vw] text-fuchsia-300 font-bold mt-2" style={{ textShadow: '0 0 10px #d946ef' }}>
          {seconds}
        </div>
      )}
      {showDate && <div className="text-[1.5vw] text-fuchsia-200 mt-6 tracking-widest border border-fuchsia-500 px-4 py-1 rounded bg-fuchsia-900/30 backdrop-blur-sm shadow-[0_0_15px_rgba(217,70,239,0.5)]">
        {formatDate(date)}
      </div>}
    </div>
  );
};

export const RetroTerminalClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
  const { hours, minutes, seconds } = formatTime(date, showSeconds);
  return (
    <div className="flex flex-col items-center justify-center font-['Share_Tech_Mono'] text-green-500">
      <div className="relative border-4 border-green-500/50 p-12 rounded-lg bg-black/80 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
         {/* Scanline effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
        
        <div className="text-[12vw] leading-none tracking-widest opacity-90 blur-[1px]">
          {hours}:{minutes}{showSeconds ? `:${seconds}` : ''}
        </div>
      </div>
      {showDate && <div className="text-[2vw] mt-8 opacity-80">> {formatDate(date)}_</div>}
    </div>
  );
};

export const ElegantSerifClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
  const { hours, minutes, seconds } = formatTime(date, showSeconds);
  return (
    <div className="flex flex-col items-center justify-center font-['Playfair_Display'] text-[#e2e8f0]">
      <div className="flex items-center space-x-8">
        <div className="flex flex-col items-center">
            <span className="text-[16vw] leading-none italic">{hours}</span>
            <span className="text-sm uppercase tracking-[0.3em] opacity-50">Hours</span>
        </div>
        <div className="h-[12vw] w-[1px] bg-slate-600/50 rotate-12"></div>
        <div className="flex flex-col items-center">
            <span className="text-[16vw] leading-none italic">{minutes}</span>
             <span className="text-sm uppercase tracking-[0.3em] opacity-50">Minutes</span>
        </div>
      </div>
      {showSeconds && <div className="text-[3vw] mt-4 font-light opacity-60 italic">{seconds}</div>}
      {showDate && <div className="text-[1.5vw] mt-12 font-light tracking-wide text-[#94a3b8]">{formatDate(date)}</div>}
    </div>
  );
};

export const HugeBoldClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
    const { hours, minutes, seconds } = formatTime(date, showSeconds);
    return (
      <div className="flex flex-col items-center justify-center w-full h-full font-[Inter]">
        <div className="flex flex-col leading-[0.85]">
            <span className="text-[35vw] font-black tracking-tighter text-white mix-blend-difference">{hours}</span>
            <span className="text-[35vw] font-black tracking-tighter text-white mix-blend-difference ml-[15vw]">{minutes}</span>
        </div>
        {(showSeconds || showDate) && (
            <div className="absolute bottom-10 right-10 text-right">
                {showSeconds && <div className="text-[5vw] font-bold text-white">{seconds}</div>}
                {showDate && <div className="text-[1.5vw] font-medium text-gray-400">{formatDate(date)}</div>}
            </div>
        )}
      </div>
    );
};

export const AnalogClock: React.FC<ClockRendererProps> = ({ date, showSeconds, showDate }) => {
  const secondsRatio = date.getSeconds() / 60;
  const minutesRatio = (secondsRatio + date.getMinutes()) / 60;
  const hoursRatio = (minutesRatio + date.getHours()) / 12;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full border-[6px] border-white/20 bg-white/5 shadow-2xl backdrop-blur-sm">
        {/* Clock Face Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute top-0 left-1/2 w-1 h-full -ml-0.5 pt-4 ${i % 3 === 0 ? 'opacity-100' : 'opacity-40'}`}
            style={{ transform: `rotate(${i * 30}deg)` }}
          >
            <div className={`w-full ${i % 3 === 0 ? 'h-8 bg-white' : 'h-4 bg-gray-300'}`}></div>
          </div>
        ))}

        {/* Hands */}
        {/* Hour */}
        <div
          className="absolute top-0 left-1/2 w-2 h-1/2 -ml-1 origin-bottom pt-[15%] transition-transform duration-75 ease-linear"
          style={{ transform: `rotate(${hoursRatio * 360}deg)` }}
        >
            <div className="w-full h-full bg-white rounded-t-full shadow-lg"></div>
        </div>

        {/* Minute */}
        <div
          className="absolute top-0 left-1/2 w-1.5 h-1/2 -ml-[3px] origin-bottom pt-[5%] transition-transform duration-75 ease-linear"
          style={{ transform: `rotate(${minutesRatio * 360}deg)` }}
        >
             <div className="w-full h-full bg-gray-200 rounded-t-full shadow-lg opacity-90"></div>
        </div>

        {/* Second */}
        {showSeconds && (
          <div
            className="absolute top-0 left-1/2 w-0.5 h-1/2 -ml-[1px] origin-bottom pt-[2%] transition-transform duration-75 ease-linear"
            style={{ transform: `rotate(${secondsRatio * 360}deg)` }}
          >
             <div className="w-full h-full bg-red-500 shadow-md"></div>
          </div>
        )}
        
        {/* Center Dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 -mt-2 -ml-2 bg-white rounded-full shadow-lg z-10"></div>
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -mt-1 -ml-1 bg-red-500 rounded-full z-20"></div>
      </div>
      {showDate && <div className="mt-12 text-[2vw] font-[Inter] font-light text-gray-300 uppercase tracking-widest">{formatDate(date)}</div>}
    </div>
  );
};