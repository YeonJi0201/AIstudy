import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { MenuItem } from '../types';
import { Check, Copy, RotateCcw, X, Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface WinnerModalProps {
  item: MenuItem | null;
  onClose: () => void;
  onSpinAgain: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({ item, onClose, onSpinAgain }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (item) {
      // Confetti burst with pastel celebratory colors
      const count = 180;
      const defaults = {
        origin: { y: 0.65 },
        colors: ['#FDA4AF', '#FDE047', '#A7F3D0', '#BAE6FD', '#E9D5FF', '#FED7AA'],
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [item]);

  if (!item) return null;

  const handleCopy = () => {
    playPopSound();
    const shareText = `📢 [동아리 점심 룰렛 결과]\n오늘의 점심 메뉴는 바로 '${item.emoji} ${item.name}'(으)로 결정되었습니다!\n💡 "${item.tip || '맛있게 먹고 오늘도 화이팅!'}"\n\n다들 동방으로 모이세요~ 🏃💨`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/35 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-rose-100 flex flex-col items-center text-center transform transition-all duration-300 scale-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Floating Celebration Header */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-semibold tracking-wide border border-amber-200/80 mb-4 animate-cute-float">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>오늘의 동아리 점심 결정!</span>
        </div>

        {/* Cute Mascot / Item Avatar or Real Food Photo */}
        {item.image ? (
          <div className="relative w-28 h-28 rounded-3xl overflow-hidden shadow-md border-3 border-amber-200 bg-amber-50 mb-3 group">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="absolute bottom-1 right-1 text-xl bg-white/90 rounded-full px-1 py-0.5 shadow-2xs">
              {item.emoji}
            </span>
          </div>
        ) : (
          <div
            className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-inner border-2 border-white mb-3"
            style={{ backgroundColor: item.color }}
          >
            <span className="transform hover:scale-110 transition-transform">{item.emoji}</span>
          </div>
        )}

        {/* Menu Title */}
        <h2 className="text-3xl font-fun font-bold tracking-tight text-slate-900 mb-1">
          {item.name}
        </h2>


        {/* Subtitle / Tag */}
        {item.tag && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 mb-3">
            {item.tag}
          </span>
        )}

        {/* Club Recommendation Tip Box */}
        <div className="w-full bg-rose-50/70 rounded-2xl p-4 border border-rose-100 text-sm text-rose-900 mb-6 font-medium leading-relaxed">
          <p className="text-xs font-bold text-rose-400 mb-1 flex items-center justify-center gap-1">
            <span>동아리 부원들을 위한 꿀팁</span>
          </p>
          <p>"{item.tip || '고민 끝! 오늘은 이 메뉴로 다함께 맛점해요!'}"</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5">
          {/* Share to KakaoTalk / Chat */}
          <button
            onClick={handleCopy}
            className={`w-full py-3 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
              copied
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-amber-300 hover:bg-amber-400 text-amber-950 shadow-sm active:scale-[0.99]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>단톡방 공유 텍스트 복사 완료! ✨</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>카톡 단톡방에 결과 공유하기</span>
              </>
            )}
          </button>

          {/* Spin Again */}
          <div className="flex items-center gap-2 w-full">
            <button
              onClick={() => {
                onClose();
                onSpinAgain();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>한 번 더 돌리기</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors"
            >
              확인 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
