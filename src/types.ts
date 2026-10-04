export interface MenuItem {
  id: string;
  name: string;
  emoji: string;
  image?: string; // Optional custom food image URL
  color: string; // Pastel background hex
  textColor: string; // High contrast matching text color
  tag?: string;
  tip?: string; // Cute club recommendation tip
  enabled: boolean;
  weight?: number; // relative weight (default 1)
}


export interface SpinHistoryItem {
  id: string;
  menuItem: MenuItem;
  timestamp: number;
}

export interface PresetCollection {
  id: string;
  title: string;
  badge: string;
  description: string;
  items: MenuItem[];
}
