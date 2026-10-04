import { MenuItem, PresetCollection } from '../types';

export const DEFAULT_CLUB_MENUS: MenuItem[] = [
  {
    id: 'gukbap',
    name: '국밥',
    emoji: '🍲',
    color: '#FED7AA', // pastel warm peach/orange
    textColor: '#9A3412',
    tag: '든든한 한식',
    tip: '깍두기 국물 넣고 밥 한 공기 뚝딱! 오늘 오후 힘내자~',
    enabled: true,
    weight: 1,
  },
  {
    id: 'tonkatsu',
    name: '돈까스',
    emoji: '🍛',
    image: '/food.png',
    color: '#FED7AA', // warm golden honey pastel
    textColor: '#854D0E',
    tag: '겉바속촉 시그니처',
    tip: '바삭바삭 갓 튀겨낸 수제 돈까스! 특제 소스 듬뿍 찍어먹자!',
    enabled: true,
    weight: 1,
  },

  {
    id: 'malatang',
    name: '마라탕',
    emoji: '🌶️',
    color: '#FECDD3', // pastel soft strawberry rose
    textColor: '#9F1239',
    tag: '매콤 중독성',
    tip: '옥수수면과 푸주 듬뿍 넣고 마라 수혈 완료! 맵기는 1.5단계 추천!',
    enabled: true,
    weight: 1,
  },
  {
    id: 'cafeteria',
    name: '학식',
    emoji: '🍱',
    color: '#A7F3D0', // pastel soft emerald mint
    textColor: '#065F46',
    tag: '가성비 최강',
    tip: '동방에서 가장 가깝고 가성비 최고! 아낀 돈으로 커피 쏘기!',
    enabled: true,
    weight: 1,
  },
  {
    id: 'cvs',
    name: '편의점',
    emoji: '🍙',
    color: '#E9D5FF', // pastel soft lilac purple
    textColor: '#6B21A8',
    tag: '빠르고 알뜰',
    tip: '불닭 + 삼각김밥 + 스트링치즈 = 동아리 황금 꿀조합 완성!',
    enabled: true,
    weight: 1,
  },
];

export const PASTEL_PALETTE = [
  { color: '#FED7AA', textColor: '#9A3412', label: '피치 살구' },
  { color: '#FEF08A', textColor: '#854D0E', label: '레몬 버터' },
  { color: '#FECDD3', textColor: '#9F1239', label: '딸기 핑크' },
  { color: '#A7F3D0', textColor: '#065F46', label: '민트 그린' },
  { color: '#BAE6FD', textColor: '#075985', label: '하늘 스카이' },
  { color: '#E9D5FF', textColor: '#6B21A8', label: '라벤더 보라' },
  { color: '#FDE047', textColor: '#713F12', label: '바나나 옐로' },
  { color: '#FBCFE8', textColor: '#831843', label: '체리 블러썸' },
  { color: '#D9F99D', textColor: '#365314', label: '라임 피스타치오' },
  { color: '#E2E8F0', textColor: '#334155', label: '소프트 슬레이트' },
];

export const PRESET_COLLECTIONS: PresetCollection[] = [
  {
    id: 'original',
    title: '동아리 시그니처 5종',
    badge: '기본',
    description: '국밥, 돈까스, 마라탕, 학식, 편의점',
    items: DEFAULT_CLUB_MENUS,
  },
  {
    id: 'budget_speed',
    title: '초가성비 & 초스피드',
    badge: '지갑 수호',
    description: '시간 없거나 가볍게 먹고 싶을 때 딱 좋은 조합',
    items: [
      { id: 'b1', name: '학생식당', emoji: '🍱', color: '#A7F3D0', textColor: '#065F46', tag: '가성비 1등', tip: '배식구 이모님께 많이 달라고 애교 부리기!', enabled: true, weight: 1 },
      { id: 'b2', name: '편의점 꿀조합', emoji: '🍙', color: '#E9D5FF', textColor: '#6B21A8', tag: '10분 컷', tip: '신상 라면 도전해보는 날!', enabled: true, weight: 1 },
      { id: 'b3', name: '김밥 & 라면', emoji: '🍜', color: '#FED7AA', textColor: '#9A3412', tag: '분식의 정석', tip: '참치김밥에 라면 국물 푹 찍어 먹기', enabled: true, weight: 1 },
      { id: 'b4', name: '이삭토스트', emoji: '🥪', color: '#FEF08A', textColor: '#854D0E', tag: '달달 바삭', tip: '햄스페셜에 키위소스 듬뿍이 진리!', enabled: true, weight: 1 },
      { id: 'b5', name: '컵밥 & 주먹밥', emoji: '🍚', color: '#BAE6FD', textColor: '#075985', tag: '간편 든든', tip: '마요네즈와 계란후라이 추가 필수', enabled: true, weight: 1 },
    ],
  },
  {
    id: 'heavy_reward',
    title: '치팅데이 & 포식 모드',
    badge: '보상 데이',
    description: '시험 끝났거나 프로젝트 마감 후 다같이 제대로 먹기',
    items: [
      { id: 'h1', name: '치즈 돈까스', emoji: '🍛', color: '#FEF08A', textColor: '#854D0E', tag: '치즈 폭포', tip: '연돈 부럽지 않은 치즈 폭탄으로 주문하자!', enabled: true, weight: 1 },
      { id: 'h2', name: '마라탕 & 꿔바로우', emoji: '🌶️', color: '#FECDD3', textColor: '#9F1239', tag: '달콤바삭', tip: '꿔바로우 소자 하나 시켜서 사이좋게 나누기!', enabled: true, weight: 1 },
      { id: 'h3', name: '수제버거 & 감튀', emoji: '🍔', color: '#FED7AA', textColor: '#9A3412', tag: '육즙 팡팡', tip: '감자튀김은 밀크셰이크에 찍어먹는 센스', enabled: true, weight: 1 },
      { id: 'h4', name: '피자 & 파스타', emoji: '🍕', color: '#FBCFE8', textColor: '#831843', tag: '다같이 냠냠', tip: '갈릭디핑소스 듬뿍 추가 잊지마!', enabled: true, weight: 1 },
      { id: 'h5', name: '제육볶음 쌈밥', emoji: '🥩', color: '#A7F3D0', textColor: '#065F46', tag: '밥도둑 최강', tip: '상추에 마늘 올리고 쌈 크게 싸먹기!', enabled: true, weight: 1 },
    ],
  },
  {
    id: 'coffee_bet',
    title: '식후 디저트 / 커피 쏘기',
    badge: '내기 모드',
    description: '점심 먹고 나서 커피값 낼 사람을 정해보세요!',
    items: [
      { id: 'c1', name: '동아리 회장님', emoji: '👑', color: '#FEF08A', textColor: '#854D0E', tag: '리더의 품격', tip: '감사합니다 회장님! 커피 맛있게 마실게요~', enabled: true, weight: 1 },
      { id: 'c2', name: '오늘의 막내', emoji: '🐣', color: '#BAE6FD', textColor: '#075985', tag: '다음에 사줘요', tip: '막내는 특별 면제권 발동! (선배가 대신 결제)', enabled: true, weight: 1 },
      { id: 'c3', name: '룰렛 돌린 사람', emoji: '👉', color: '#FECDD3', textColor: '#9F1239', tag: '운명론자', tip: '누른 자가 책임을 진다! 카카오페이 준비!', enabled: true, weight: 1 },
      { id: 'c4', name: '깔끔한 1/N 더치페이', emoji: '🤝', color: '#A7F3D0', textColor: '#065F46', tag: '모두 평등', tip: '서로 부담 없이 n빵으로 사이좋게!', enabled: true, weight: 1 },
      { id: 'c5', name: '가위바위보 패자', emoji: '✊', color: '#E9D5FF', textColor: '#6B21A8', tag: '한판 승부', tip: '최후의 1인이 남을 때까지 가위바위보!', enabled: true, weight: 1 },
    ],
  },
];
