import { Difficulty, BoundingBox } from './types';

/**
 * World Layout Constants:
 * Row 0: Starting Pavement
 * Rows 1..4: Road 1 (4 lines/lanes of cars)
 * Row 5: Pavement 1 (Completion of Road 1 -> +10 bonus points)
 * Rows 6..9: Road 2 (4 lines/lanes of cars)
 * Row 10: Pavement 2 (Completion of Road 2 -> +10 bonus points)
 * Each road contains exactly 4 lines/lanes of cars.
 */
export const LANES_PER_ROAD = 4;
export const ROAD_CYCLE = LANES_PER_ROAD + 1; // 5 rows per cycle (4 road lanes + 1 pavement)

/**
 * Returns true if the given row index is a safe pavement/sidewalk.
 */
export function isPavement(row: number): boolean {
  if (row <= 0) return true;
  return row % ROAD_CYCLE === 0;
}

/**
 * Returns which road number (1-indexed) a given row belongs to,
 * or 0 if it's the starting pavement.
 */
export function getRoadNumber(row: number): number {
  if (row <= 0) return 0;
  return Math.ceil(row / ROAD_CYCLE);
}

/**
 * Calculates points earned for moving to a new row.
 * Forward steps score 1 point per new forward row reached.
 * Backward steps or re-visiting previously reached rows score 0 points.
 */
export function calculateStepScore(
  currentRow: number,
  maxRowReached: number
): { points: number; newMaxRow: number } {
  if (currentRow > maxRowReached) {
    const points = currentRow - maxRowReached;
    return { points, newMaxRow: currentRow };
  }
  return { points: 0, newMaxRow: maxRowReached };
}

/**
 * Checks if stepping onto the current row completes a new road cross.
 * Each road has 4 car lanes, followed by a pavement.
 * Reaching a new pavement awards +10 bonus points.
 */
export function calculateRoadCrossBonus(
  currentRow: number,
  highestRoadCrossed: number
): { bonus: number; newHighestRoad: number; isCrossed: boolean } {
  if (currentRow <= 0) {
    return { bonus: 0, newHighestRoad: highestRoadCrossed, isCrossed: false };
  }

  // Pavement rows after roads are 5, 10, 15, 20...
  if (currentRow % ROAD_CYCLE === 0) {
    const roadIndex = currentRow / ROAD_CYCLE;
    if (roadIndex > highestRoadCrossed) {
      return {
        bonus: 10,
        newHighestRoad: roadIndex,
        isCrossed: true,
      };
    }
  }

  return { bonus: 0, newHighestRoad: highestRoadCrossed, isCrossed: false };
}

/**
 * Difficulty tuning parameters
 */
export interface DifficultySettings {
  name: string;
  baseCarSpeed: number;
  speedIncrementPerRow: number;
  maxCarSpeed: number;
  spawnIntervalMultiplier: number;
  description: string;
}

export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: 'Easy',
    baseCarSpeed: 110,
    speedIncrementPerRow: 3.0,
    maxCarSpeed: 300,
    spawnIntervalMultiplier: 1.3,
    description: 'Gentle traffic flow. Great for warm-ups and casual crossing!',
  },
  medium: {
    name: 'Medium',
    baseCarSpeed: 160,
    speedIncrementPerRow: 5.0,
    maxCarSpeed: 450,
    spawnIntervalMultiplier: 1.0,
    description: 'Balanced rush hour. Quick reflexes and timing required!',
  },
  hard: {
    name: 'Hard',
    baseCarSpeed: 220,
    speedIncrementPerRow: 7.5,
    maxCarSpeed: 600,
    spawnIntervalMultiplier: 0.8,
    description: 'High-speed highway frenzy. Only true crosser legends survive!',
  },
};

/**
 * Computes car speed based on row distance, base speed, and difficulty.
 * Initial speed starts slower and speeds up as the player progresses forward.
 */
export function calculateCarSpeed(
  row: number,
  difficulty: Difficulty = 'medium',
  baseMultiplier: number = 1.0
): number {
  const config = DIFFICULTY_PRESETS[difficulty];
  const roadIndex = Math.max(0, getRoadNumber(row));
  const addedSpeed = roadIndex * config.speedIncrementPerRow * 4;
  const speed = Math.min(config.maxCarSpeed, (config.baseCarSpeed + addedSpeed) * baseMultiplier);
  return speed;
}

/**
 * Precise AABB collision detection with inset hitboxes so near-misses feel fair and exciting.
 */
export function checkCollision(
  player: BoundingBox,
  car: BoundingBox,
  playerInset = 0.18,
  carInset = 0.12
): boolean {
  const pLeft = player.x + player.width * playerInset;
  const pRight = player.x + player.width * (1 - playerInset);
  const pTop = player.y + player.height * playerInset;
  const pBottom = player.y + player.height * (1 - playerInset);

  const cLeft = car.x + car.width * carInset;
  const cRight = car.x + car.width * (1 - carInset);
  const cTop = car.y + car.height * carInset;
  const cBottom = car.y + car.height * (1 - carInset);

  return !(
    pRight < cLeft ||
    pLeft > cRight ||
    pBottom < cTop ||
    pTop > cBottom
  );
}
