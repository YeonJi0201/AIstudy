/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { MenuItem, SpinHistoryItem } from './types';
import { DEFAULT_CLUB_MENUS } from './data/defaultMenus';
import { RouletteWheel } from './components/RouletteWheel';
import { WinnerModal } from './components/WinnerModal';
import { MenuManager } from './components/MenuManager';
import { HistorySection } from './components/HistorySection';
import { Header } from './components/Header';
import { setMuted as setAudioMuted, getMuted } from './utils/audio';
import { Utensils, Sparkles, Shuffle, Flame } from 'lucide-react';
import { playPopSound } from './utils/audio';

const STORAGE_KEY_ITEMS = 'club_lunch_roulette_items_v1';
const STORAGE_KEY_HISTORY = 'club_lunch_roulette_history_v1';
const STORAGE_KEY_MUTED = 'club_lunch_roulette_muted_v1';

export default function App() {
  const [items, setItems] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ITEMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return DEFAULT_CLUB_MENUS;
  });

  const [history, setHistory] = useState<SpinHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fallback
    }
    return [];
  });

  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_MUTED) === 'true';
    } catch {
      return false;
    }
  });

  const [activeTab, setActiveTab] = useState<'roulette' | 'menus' | 'history'>('roulette');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winningItem, setWinningItem] = useState<MenuItem | null>(null);

  // Sync mute state with audio synthesizer
  useEffect(() => {
    setAudioMuted(isMuted);
    try {
      localStorage.setItem(STORAGE_KEY_MUTED, String(isMuted));
    } catch {
      // Ignore
    }
  }, [isMuted]);

  // Persist items
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
    } catch {
      // Ignore
    }
  }, [items]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  const toggleMute = () => {
    playPopSound();
    setIsMutedState((prev) => !prev);
  };

  const handleSpinEnd = (selected: MenuItem) => {
    setWinningItem(selected);
    const newRecord: SpinHistoryItem = {
      id: `spin_${Date.now()}`,
      menuItem: selected,
      timestamp: Date.now(),
    };
    setHistory((prev) => [newRecord, ...prev.slice(0, 19)]);
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY_HISTORY);
    } catch {
      // Ignore
    }
  };

  // Quick random shuffle toggle (fun feature for indecisive clubs)
  const handleRandomSelectThree = () => {
    if (isSpinning) return;
    playPopSound();
    // Enable 3 random items and disable others
    const shuffled = [...items].sort(() => 0.5 - Math.random());
    const selectedIds = new Set(shuffled.slice(0, 3).map((item) => item.id));

    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        enabled: selectedIds.has(item.id),
      }))
    );
  };

  const handleSelectAll = () => {
    if (isSpinning) return;
    playPopSound();
    setItems((prev) => prev.map((item) => ({ ...item, enabled: true })));
  };

  const activeItems = items.filter((i) => i.enabled);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col selection:bg-amber-200 selection:text-amber-900">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={toggleMute}
      />


      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Top Hero Banner */}
        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold mb-3 border border-amber-200/80">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>동아리 부원들을 위한 맛점 솔루션</span>
          </div>

          <h1 className="font-fun text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight mb-2.5">
            오늘 동아리 점심 뭐 먹지?
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            국밥, 돈까스, 마라탕, 학식, 편의점까지! 메뉴 정하느라 시간 낭비하지 말고
            <br className="hidden sm:inline" />
            룰렛을 힘차게 돌려 운명의 점심을 뽑아보세요.
          </p>

          {/* Featured Food Spotlight Banner from food.png */}
          <div className="mt-5 max-w-xl mx-auto bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200/80 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-xl overflow-hidden border-2 border-amber-300 bg-white shadow-xs shrink-0">
                <img
                  src="/food.png"
                  alt="동아리 추천 돈까스"
                  className="w-full h-full object-cover scale-110"
                />
                <span className="absolute bottom-0 right-0 text-[10px] bg-amber-500 text-white font-bold px-1 rounded-tl-md">
                  HOT
                </span>
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-bold text-amber-900">오늘의 추천 시그니처</span>
                  <span className="text-[10px] font-semibold text-amber-800 bg-amber-100/90 px-1.5 py-0.5 rounded-md">
                    바삭 돈까스
                  </span>
                </div>
                <p className="text-xs text-amber-800/80 mt-0.5 truncate">
                  바삭바삭 갓 튀겨낸 수제 돈까스로 든든하게 채우기!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playPopSound();
                const tonkatsuItem = items.find((i) => i.id === 'tonkatsu') || items[1];
                if (tonkatsuItem) {
                  setWinningItem(tonkatsuItem);
                }
              }}
              disabled={isSpinning}
              className="shrink-0 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center gap-1"
            >
              <span>바로 찜하기</span>
              <span>✨</span>
            </button>
          </div>

          {/* Quick Active Items Chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">

            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (isSpinning) return;
                  playPopSound();
                  setItems((prev) =>
                    prev.map((i) => (i.id === item.id ? { ...i, enabled: !i.enabled } : i))
                  );
                }}
                disabled={isSpinning}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-150 flex items-center gap-1.5 border ${
                  item.enabled
                    ? 'border-transparent shadow-2xs hover:scale-105'
                    : 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-60 line-through'
                }`}
                style={{
                  backgroundColor: item.enabled ? item.color : undefined,
                  color: item.enabled ? item.textColor : undefined,
                }}
                title={item.enabled ? '클릭 시 룰렛에서 제외' : '클릭 시 룰렛에 포함'}
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Quick actions row */}
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-500">
            <button
              onClick={handleSelectAll}
              disabled={isSpinning}
              className="hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <span>전체 선택</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <button
              onClick={handleRandomSelectThree}
              disabled={isSpinning}
              className="hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              <Shuffle className="w-3 h-3" />
              <span>랜덤 3개만 후보로</span>
            </button>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <button
              onClick={() => setActiveTab('menus')}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 font-semibold text-rose-500"
            >
              <Utensils className="w-3 h-3" />
              <span>메뉴 편집하기</span>
            </button>
          </div>
        </section>

        {/* View Layout based on tab or responsive grid */}
        {activeTab === 'roulette' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Center: Main Roulette Wheel (8 cols) */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center py-4 bg-white/70 backdrop-blur-xs rounded-3xl p-6 md:p-8 border border-rose-100/60 shadow-xs">
              <RouletteWheel
                items={items}
                onSpinEnd={handleSpinEnd}
                isSpinning={isSpinning}
                setIsSpinning={setIsSpinning}
              />
            </div>

            {/* Right: Quick Menu Guide & Recent History (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Today's Candidate Preview Card */}
              <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xs border border-rose-100/70">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <h3 className="font-fun text-lg text-slate-800 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span>오늘의 후보 {activeItems.length}선</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('menus')}
                    className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                  >
                    관리하기 &rarr;
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2.5 mt-3.5">
                  {activeItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-2xl border border-slate-100 hover:border-rose-200 transition-all flex items-center justify-between gap-3 bg-slate-50/40"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-base shrink-0 shadow-2xs border border-black/5"
                          style={{ backgroundColor: item.color }}
                        >
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover scale-110"
                              onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            item.emoji
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-xs text-slate-800 truncate">
                              {item.name}
                            </p>
                            {item.image && (
                              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-100 text-amber-800 shrink-0">
                                시그니처
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 truncate">
                            {item.tip || item.tag}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-slate-200/80 text-slate-600 font-medium shrink-0">
                        {item.tag || '후보'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent History compact */}
              <HistorySection history={history} onClearHistory={clearHistory} />
            </div>
          </div>
        )}

        {activeTab === 'menus' && (
          <div className="max-w-3xl mx-auto">
            <MenuManager items={items} setItems={setItems} isSpinning={isSpinning} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-2xl mx-auto">
            <HistorySection history={history} onClearHistory={clearHistory} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-rose-100/50 text-center text-xs text-slate-400">
        <p className="font-fun text-slate-500 mb-1">
          동아리 점심 메뉴 룰렛 · 오늘 하루도 맛있는 점심 드세요! 😋
        </p>
        <p>© 2026 동아리 점심 룰렛 웹앱</p>
      </footer>

      {/* Winner Celebration Modal */}
      <WinnerModal
        item={winningItem}
        onClose={() => setWinningItem(null)}
        onSpinAgain={() => {
          setWinningItem(null);
          // Small delay then trigger wheel
          setTimeout(() => {
            const wheelBtn = document.querySelector('button[title*="돌리기"]') as HTMLButtonElement;
            if (wheelBtn) wheelBtn.click();
          }, 200);
        }}
      />
    </div>
  );
}
