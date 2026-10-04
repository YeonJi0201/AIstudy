import React from 'react';
import { SpinHistoryItem } from '../types';
import { Trash2, History } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface HistorySectionProps {
  history: SpinHistoryItem[];
  onClearHistory: () => void;
  onSpinItemAgain?: (name: string) => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory,
}) => {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-rose-100/70">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-rose-400" />
          <h3 className="font-fun text-lg text-slate-800">최근 당첨 기록</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-sans font-medium">
            {history.length}회 기록됨
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              playPopSound();
              onClearHistory();
            }}
            className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>기록 비우기</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          <p className="text-2xl mb-2">🎯</p>
          <p>아직 룰렛을 돌린 기록이 없어요.</p>
          <p className="text-xs text-slate-400 mt-1">오늘의 첫 번째 메뉴를 뽑아보세요!</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-50 mt-2 max-h-64 overflow-y-auto pr-1">
          {history.map((record, index) => (
            <div
              key={record.id}
              className="py-2.5 flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono text-slate-300 w-4 text-right">
                  {index + 1}
                </span>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0 shadow-2xs"
                  style={{ backgroundColor: record.menuItem.color }}
                >
                  {record.menuItem.emoji}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">
                    {record.menuItem.name}
                  </span>
                  {record.menuItem.tag && (
                    <span className="ml-2 text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {record.menuItem.tag}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-xs text-slate-400 font-mono tabular-nums">
                {formatTime(record.timestamp)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
