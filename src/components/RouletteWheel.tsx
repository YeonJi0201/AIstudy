import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MenuItem } from '../types';
import { playTickSound, playVictoryChime, playPopSound } from '../utils/audio';

interface RouletteWheelProps {
  items: MenuItem[];
  onSpinEnd: (selectedItem: MenuItem) => void;
  isSpinning: boolean;
  setIsSpinning: (spinning: boolean) => void;
  onOpenManager?: () => void;
}

export const RouletteWheel: React.FC<RouletteWheelProps> = ({
  items,
  onSpinEnd,
  isSpinning,
  setIsSpinning,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentAngleRef = useRef<number>(0);
  const lastSegmentRef = useRef<number>(-1);
  const animFrameRef = useRef<number | null>(null);
  const foodImgRef = useRef<HTMLImageElement | null>(null);
  const [needleTwitch, setNeedleTwitch] = useState(false);

  // Preload food.png
  useEffect(() => {
    const img = new Image();
    img.src = '/food.png';
    img.onload = () => {
      foodImgRef.current = img;
      drawWheel(currentAngleRef.current);
    };
  }, []);


  // Active items for the roulette
  const activeItems = items.filter((item) => item.enabled);

  // Helper to draw wheel at given rotation angle
  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = 380;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const centerX = size / 2;
      const centerY = size / 2;
      const outerRadius = size / 2 - 16;
      const innerRadius = 46;

      ctx.clearRect(0, 0, size, size);

      if (activeItems.length === 0) {
        // Empty state placeholder
        ctx.beginPath();
        ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#F3F4F6';
        ctx.fill();
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.fillStyle = '#9CA3AF';
        ctx.font = '600 16px "Pretendard", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('메뉴를 1개 이상 켜주세요!', centerX, centerY);
        return;
      }

      const totalItems = activeItems.length;
      const sliceAngle = (2 * Math.PI) / totalItems;

      // 1. Draw outer decorative shadow & ring
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#FED7AA'; // warm pastel peach rim matching food.png
      ctx.fill();

      // Outer bezel ring
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FDBA74';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Decorative rim pastel dots (bulbs)
      const dotCount = Math.max(16, totalItems * 3);
      for (let i = 0; i < dotCount; i++) {
        const dotAngle = (i * 2 * Math.PI) / dotCount + (angle * 0.5);
        const dotX = centerX + (outerRadius + 2) * Math.cos(dotAngle);
        const dotY = centerY + (outerRadius + 2) * Math.sin(dotAngle);

        ctx.beginPath();
        ctx.arc(dotX, dotY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#FB923C';
        ctx.fill();
      }
      ctx.restore();


      // 2. Draw Wheel Slices
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      for (let i = 0; i < totalItems; i++) {
        const item = activeItems[i];
        const start = i * sliceAngle;
        const end = (i + 1) * sliceAngle;

        // Slice wedge
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, outerRadius, start, end);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();

        // Divider stroke
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Draw Content (Emoji + Name) along radial midline
        ctx.save();
        const midAngle = start + sliceAngle / 2;
        ctx.rotate(midAngle);

        // Position text outwards
        const textDistance = outerRadius * 0.65;

        // Draw emoji
        ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.emoji, textDistance + 24, 0);

        // Draw menu name
        ctx.fillStyle = item.textColor;
        const fontSize = totalItems > 8 ? 13 : totalItems > 6 ? 15 : 17;
        ctx.font = `bold ${fontSize}px "Jua", "Gowun Dodum", "Pretendard", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Truncate if long
        let displayName = item.name;
        if (displayName.length > 6) {
          displayName = displayName.substring(0, 5) + '..';
        }
        ctx.fillText(displayName, textDistance - 18, 0);

        ctx.restore();
      }

      ctx.restore();

      // 3. Center Hub (Button style with food emblem)
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.shadowColor = 'rgba(217, 119, 6, 0.2)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 4;
      ctx.fill();

      // Inner image / circle
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius - 4, 0, 2 * Math.PI);
      ctx.clip();

      if (foodImgRef.current && foodImgRef.current.complete) {
        const hubSize = (innerRadius - 4) * 2;
        ctx.drawImage(
          foodImgRef.current,
          centerX - innerRadius + 4,
          centerY - innerRadius + 4,
          hubSize,
          hubSize
        );
        // Soft warm glass overlay for high legibility
        ctx.fillStyle = isSpinning ? 'rgba(255, 251, 235, 0.85)' : 'rgba(255, 255, 255, 0.65)';
        ctx.fill();
      } else {
        ctx.fillStyle = '#FFFBEB';
        ctx.fill();
      }
      ctx.restore();

      // Center ring stroke
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius - 4, 0, 2 * Math.PI);
      ctx.strokeStyle = '#FBBF24';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Center text
      ctx.fillStyle = '#B45309';
      ctx.font = 'bold 15px "Jua", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowBlur = 0;
      ctx.fillText(isSpinning ? '돌아가는 중!' : 'GO!', centerX, centerY - 1);

      ctx.font = 'bold 10px "Pretendard", sans-serif';
      ctx.fillStyle = '#D97706';
      ctx.fillText(isSpinning ? '두근두근' : 'CLICK', centerX, centerY + 14);

      ctx.restore();

    },
    [activeItems, isSpinning]
  );

  // Redraw when items or spinning state changes
  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  // Main spin function
  const spin = () => {
    if (isSpinning || activeItems.length < 2) return;

    playPopSound();
    setIsSpinning(true);

    // Initial random turns (5 to 8 full rotations + random angle)
    const baseRotations = (5 + Math.random() * 3) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const totalSpinAngle = baseRotations + randomOffset;

    const startAngle = currentAngleRef.current;
    const targetAngle = startAngle + totalSpinAngle;
    const duration = 4200; // ms
    const startTime = performance.now();

    const sliceAngle = (2 * Math.PI) / activeItems.length;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth custom cubic ease-out: 1 - Math.pow(1 - progress, 4)
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = startAngle + totalSpinAngle * easeOut;
      currentAngleRef.current = current;

      // Pointer is at TOP: angle is 3 * Math.PI / 2 (or -Math.PI / 2)
      // Normalize wheel angle to [0, 2*PI)
      const normalizedCurrent = current % (2 * Math.PI);
      const pointerAngle = (3 * Math.PI) / 2;
      let angleAtPointer = (pointerAngle - normalizedCurrent) % (2 * Math.PI);
      if (angleAtPointer < 0) angleAtPointer += 2 * Math.PI;

      const currentSegment = Math.floor(angleAtPointer / sliceAngle) % activeItems.length;

      // When crossing into a new slice, trigger tick sound and needle animation
      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        // Pitch shift slightly as it slows down
        const pitchMultiplier = Math.max(0.7, 1.2 - progress * 0.5);
        playTickSound(pitchMultiplier);
        setNeedleTwitch(true);
        setTimeout(() => setNeedleTwitch(false), 50);
      }

      drawWheel(current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        setIsSpinning(false);
        const winningItem = activeItems[currentSegment];
        playVictoryChime();
        onSpinEnd(winningItem);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Top Needle Indicator */}
      <div
        className={`absolute -top-3 z-20 flex flex-col items-center transition-transform duration-75 origin-top ${
          needleTwitch ? '-rotate-12 scale-110' : 'rotate-0 scale-100'
        }`}
        style={{ pointerEvents: 'none' }}
      >
        {/* Needle Pin Body */}
        <div className="relative filter drop-shadow-md">
          <svg width="34" height="42" viewBox="0 0 34 42" fill="none">
            {/* Warm amber pin top circle */}
            <circle cx="17" cy="14" r="13" fill="#D97706" />
            <circle cx="17" cy="14" r="7" fill="#FEF3C7" />
            {/* Triangle arrow tip */}
            <path d="M17 40L9 20H25L17 40Z" fill="#B45309" />
          </svg>
        </div>
      </div>

      {/* Main Wheel Canvas with decorative soft shadow */}
      <div
        onClick={spin}
        className={`relative cursor-pointer transition-transform duration-300 ${
          isSpinning ? 'scale-[1.01]' : 'hover:scale-[1.02] active:scale-[0.99]'
        }`}
        title="클릭하여 룰렛 돌리기!"
      >
        <canvas
          ref={canvasRef}
          style={{ width: 380, height: 380 }}
          className="rounded-full shadow-[0_12px_36px_rgba(245,158,11,0.2)]"
        />

        {/* Ambient Pulsing Glow behind wheel */}
        <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-tr from-amber-300/35 via-orange-200/30 to-rose-200/35 blur-xl opacity-80" />
      </div>

      {/* Primary Spin Action Button */}
      <div className="mt-7 flex flex-col items-center">
        <button
          onClick={spin}
          disabled={isSpinning || activeItems.length < 2}
          className={`group relative px-8 py-3.5 rounded-2xl font-fun text-lg md:text-xl tracking-wide font-bold transition-all duration-200 shadow-md ${
            isSpinning
              ? 'bg-amber-300 text-white cursor-not-allowed opacity-90'
              : activeItems.length < 2
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white hover:from-amber-600 hover:via-orange-600 hover:to-rose-600 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0.5'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>{isSpinning ? '두구두구 돌아가는 중...' : '점심 메뉴 뽑기!'}</span>
            <span className="inline-block transition-transform duration-300 group-hover:rotate-45">
              🎲
            </span>
          </span>
        </button>


        {activeItems.length < 2 ? (
          <p className="mt-2 text-xs text-rose-500 font-medium">
            최소 2개 이상의 메뉴를 활성화해야 룰렛을 돌릴 수 있어요!
          </p>
        ) : (
          <p className="mt-2 text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>현재 {activeItems.length}가지 후보 중 1개 선택</span>
            <span aria-hidden="true">·</span>
            <span>중앙 버튼이나 휠을 클릭해도 돌릴 수 있어요</span>
          </p>
        )}
      </div>
    </div>
  );
};
