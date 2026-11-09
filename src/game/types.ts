export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameState = 'title' | 'playing' | 'paused' | 'gameover';

export interface Avatar {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  accentColor: string;
  secondaryColor: string;
  description: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CarType = 'sedan' | 'muscle' | 'taxi' | 'truck' | 'sport' | 'beetle';

export interface Car {
  id: number;
  lane: number;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number; // positive = moving right, negative = moving left
  type: CarType;
  color: string;
  roofColor: string;
  windowColor: string;
}

export type LaneType = 'pavement' | 'road';

export interface Lane {
  index: number;
  type: LaneType;
  roadNumber?: number;
  laneInRoad?: number; // 0, 1, 2, 3
  direction: 1 | -1;
  speed: number;
  decorations?: LaneDecoration[];
}

export interface LaneDecoration {
  x: number;
  type: 'tree' | 'lamp' | 'hydrant' | 'bench' | 'flowers' | 'building';
  color?: string;
  variant?: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}
