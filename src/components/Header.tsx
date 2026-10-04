import React from 'react';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'roulette' | 'menus' | 'history';
  setActiveTab: (tab: 'roulette' | 'menus' | 'history') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-rose-100/60 px-4 sm:px-8 py-3.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark in display face with food emblem */}
        <button
          onClick={() => {
            playPopSound();
            setActiveTab('roulette');
          }}
          className="font-fun text-xl sm:text-2xl font-bold tracking-tight text-amber-900 hover:text-amber-800 transition-colors whitespace-nowrap text-left flex items-center gap-2"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-300 bg-amber-50 shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/food.png"
              alt="동아리 점심"
              className="w-full h-full object-cover scale-110"
              onError={(e) => {
                // Fallback emoji if image loading fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span>동아리 점심 룰렛</span>
        </button>


        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-medium text-slate-600">
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('roulette');
            }}
            className={`transition-colors whitespace-nowrap py-1 px-2.5 rounded-lg ${
              activeTab === 'roulette'
                ? 'font-bold text-rose-600 bg-rose-50'
                : 'hover:text-slate-900'
            }`}
          >
            오늘의 룰렛
          </button>
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('menus');
            }}
            className={`transition-colors whitespace-nowrap py-1 px-2.5 rounded-lg ${
              activeTab === 'menus'
                ? 'font-bold text-rose-600 bg-rose-50'
                : 'hover:text-slate-900'
            }`}
          >
            메뉴 관리
          </button>
          <button
            onClick={() => {
              playPopSound();
              setActiveTab('history');
            }}
            className={`transition-colors whitespace-nowrap py-1 px-2.5 rounded-lg ${
              activeTab === 'history'
                ? 'font-bold text-rose-600 bg-rose-50'
                : 'hover:text-slate-900'
            }`}
          >
            당첨 기록
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-colors ${
              isMuted
                ? 'border-slate-200 text-slate-400 bg-slate-50 hover:bg-slate-100'
                : 'border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100'
            }`}
            title={isMuted ? '효과음 켜기' : '효과음 끄기'}
            aria-label={isMuted ? '효과음 켜기' : '효과음 끄기'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              playPopSound();
              setActiveTab('roulette');
            }}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-xs transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>룰렛으로</span>
          </button>
        </div>
      </div>
    </header>
  );
};
