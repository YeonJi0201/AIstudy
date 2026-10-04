import React, { useState } from 'react';
import { MenuItem } from '../types';
import { PASTEL_PALETTE, DEFAULT_CLUB_MENUS, PRESET_COLLECTIONS } from '../data/defaultMenus';
import { Plus, Trash2, RotateCcw, Check, Sparkles } from 'lucide-react';
import { playPopSound } from '../utils/audio';

interface MenuManagerProps {
  items: MenuItem[];
  setItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
  isSpinning: boolean;
}

const QUICK_EMOJIS = ['🍲', '🍛', '🌶️', '🍱', '🍙', '🍜', '🍔', '🍕', '🥪', '🍣', '🥩', '☕', '🍰'];

export const MenuManager: React.FC<MenuManagerProps> = ({
  items,
  setItems,
  isSpinning,
}) => {
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🍲');
  const [selectedPaletteIdx, setSelectedPaletteIdx] = useState(0);
  const [newTag, setNewTag] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Toggle item enabled status
  const handleToggle = (id: string) => {
    if (isSpinning) return;
    playPopSound();
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  // Delete item
  const handleDelete = (id: string) => {
    if (isSpinning) return;
    if (items.length <= 2) {
      alert('룰렛을 위해 최소 2개의 메뉴는 남아있어야 해요!');
      return;
    }
    playPopSound();
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Add new menu
  const handleAddMenu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || isSpinning) return;

    playPopSound();
    const palette = PASTEL_PALETTE[selectedPaletteIdx];
    const newItem: MenuItem = {
      id: `menu_${Date.now()}`,
      name: newName.trim(),
      emoji: newEmoji.trim() || '🍽️',
      color: palette.color,
      textColor: palette.textColor,
      tag: newTag.trim() || '동아리 추천',
      tip: `${newName.trim()} 먹으러 갈 사람 손 들어주세요!`,
      enabled: true,
      weight: 1,
    };

    setItems((prev) => [...prev, newItem]);
    setNewName('');
    setNewTag('');
    setIsAdding(false);
  };

  // Load preset
  const handleApplyPreset = (presetId: string) => {
    if (isSpinning) return;
    playPopSound();
    const preset = PRESET_COLLECTIONS.find((p) => p.id === presetId);
    if (preset) {
      setItems([...preset.items]);
    }
  };

  // Reset to original default 5
  const handleResetDefaults = () => {
    if (isSpinning) return;
    playPopSound();
    setItems([...DEFAULT_CLUB_MENUS]);
  };

  const activeCount = items.filter((i) => i.enabled).length;

  return (
    <div className="bg-white rounded-3xl p-5 md:p-7 shadow-sm border border-rose-100/70">
      {/* Header and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
        <div>
          <h3 className="font-fun text-xl text-slate-800 flex items-center gap-2">
            <span>메뉴 후보 목록</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 font-sans font-medium border border-rose-100">
              활성 {activeCount} / 전체 {items.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            원치 않는 메뉴는 체크를 해제하면 룰렛에서 제외돼요!
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAdding(!isAdding)}
            disabled={isSpinning}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 메뉴 추가</span>
          </button>
          <button
            onClick={handleResetDefaults}
            disabled={isSpinning}
            title="초기 국밥·돈까스·마라탕·학식·편의점으로 복원"
            className="px-3 py-1.5 text-xs font-medium rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>기본값 복원</span>
          </button>
        </div>
      </div>

      {/* Preset Packs Selector */}
      <div className="py-4 border-b border-slate-100">
        <span className="text-xs font-semibold text-slate-500 block mb-2.5">
          ✨ 인기 동아리 프리셋 추천
        </span>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLLECTIONS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.id)}
              disabled={isSpinning}
              className="px-3 py-1.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-rose-50 hover:border-rose-200 text-xs text-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-600 shadow-2xs">
                {preset.badge}
              </span>
              <span className="font-medium">{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* New Menu Form Toggle */}
      {isAdding && (
        <form
          onSubmit={handleAddMenu}
          className="my-4 p-4 rounded-2xl bg-rose-50/60 border border-rose-100 animate-in fade-in duration-200"
        >
          <h4 className="text-xs font-bold text-rose-800 mb-3 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>새 점심 메뉴 추가하기</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                메뉴 이름 *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="예: 쌀국수, 찜닭, 서브웨이"
                className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                maxLength={10}
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                태그 (선택)
              </label>
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="예: 해장 추천, 불금 특식"
                className="w-full px-3 py-2 text-sm bg-white rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-300"
                maxLength={8}
              />
            </div>
          </div>

          {/* Quick Emoji selection */}
          <div className="mb-3">
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">
              이모지 아이콘: {newEmoji}
            </label>
            <div className="flex flex-wrap gap-1.5 items-center">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewEmoji(emoji)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all ${
                    newEmoji === emoji
                      ? 'bg-rose-500 text-white shadow-xs scale-110'
                      : 'bg-white hover:bg-rose-100'
                  }`}
                >
                  {emoji}
                </button>
              ))}
              <input
                type="text"
                value={newEmoji}
                onChange={(e) => setNewEmoji(e.target.value)}
                className="w-12 h-8 text-center text-sm bg-white rounded-lg border border-rose-200 focus:outline-none"
                maxLength={2}
                title="직접 이모지 입력"
              />
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-4">
            <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
              파스텔 색상 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {PASTEL_PALETTE.map((pal, idx) => (
                <button
                  key={pal.color}
                  type="button"
                  onClick={() => setSelectedPaletteIdx(idx)}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center border ${
                    selectedPaletteIdx === idx
                      ? 'scale-110 ring-2 ring-rose-400 ring-offset-1'
                      : 'hover:scale-105 border-black/10'
                  }`}
                  style={{ backgroundColor: pal.color }}
                  title={pal.label}
                >
                  {selectedPaletteIdx === idx && (
                    <Check className="w-3.5 h-3.5" style={{ color: pal.textColor }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-medium text-xs shadow-xs"
            >
              목록에 추가하기
            </button>
          </div>
        </form>
      )}

      {/* Items list */}
      <div className="divide-y divide-slate-100 mt-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={`py-3 flex items-center justify-between gap-3 transition-opacity ${
              item.enabled ? 'opacity-100' : 'opacity-40'
            }`}
          >
            {/* Left: Checkbox & Info */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={isSpinning}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                  item.enabled
                    ? 'bg-rose-500 text-white'
                    : 'border-2 border-slate-300 bg-white'
                }`}
                title={item.enabled ? '룰렛에서 제외하기' : '룰렛에 포함하기'}
              >
                {item.enabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>

              {/* Color & Emoji or Real Image badge */}
              <div
                className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center text-lg shrink-0 shadow-2xs border border-black/5"
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


              {/* Name & tags */}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-800 truncate">
                    {item.name}
                  </span>
                  {item.tag && (
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 hidden sm:inline-block">
                      {item.tag}
                    </span>
                  )}
                </div>
                {item.tip && (
                  <p className="text-[11px] text-slate-400 truncate max-w-xs">
                    {item.tip}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleToggle(item.id)}
                disabled={isSpinning}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  item.enabled
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                }`}
              >
                {item.enabled ? '참여 중' : '제외됨'}
              </button>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={isSpinning || items.length <= 2}
                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                title="메뉴 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
