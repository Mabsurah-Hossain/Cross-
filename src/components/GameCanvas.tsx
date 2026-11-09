import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Avatar, Car, Difficulty, Lane, Particle, CarType } from '../game/types';
import {
  CELL_SIZE,
  GRID_COLS,
  ROAD_WIDTH,
  drawEnvironment,
  drawCar,
  drawPlayer,
  drawParticles,
} from '../game/renderer';
import {
  isPavement,
  getRoadNumber,
  calculateStepScore,
  calculateRoadCrossBonus,
  calculateCarSpeed,
  checkCollision,
  LANES_PER_ROAD,
  ROAD_CYCLE,
} from '../game/rules';
import { sounds } from '../game/audio';
import { TouchControls } from './TouchControls';
import { HUD } from './HUD';
import { PauseModal } from './PauseModal';

interface GameCanvasProps {
  avatar: Avatar;
  difficulty: Difficulty;
  highScore: number;
  onGameOver: (score: number, roadsCrossed: number, maxSteps: number) => void;
  onReturnHome: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  avatar,
  difficulty,
  highScore,
  onGameOver,
  onReturnHome,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High-frequency mutable state stored in refs to decouple from React renders
  const stateRef = useRef({
    player: {
      col: 0, // -5 to 5
      row: 0,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      hopProgress: 0,
      isHopping: false,
      direction: 'up' as 'up' | 'down' | 'left' | 'right',
    },
    cameraY: 0,
    maxRowReached: 0,
    highestRoadCrossed: 0,
    score: 0,
    roadsCrossed: 0,
    isAlive: true,
    isPaused: false,
    hitstop: 0,
    shake: 0,
    lastTime: performance.now(),
    lanes: new Map<number, Lane>(),
    cars: [] as Car[],
    particles: [] as Particle[],
  });

  // Low-frequency UI state for HUD
  const [hudScore, setHudScore] = useState(0);
  const [hudRoadsCrossed, setHudRoadsCrossed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(sounds.getMuted());
  const [roadCrossNotice, setRoadCrossNotice] = useState(false);

  // Initialize or generate lanes up to target row
  const ensureLanesGenerated = useCallback((targetRow: number, viewWidth: number) => {
    const s = stateRef.current;
    const roadLeft = (viewWidth - ROAD_WIDTH) / 2;
    const roadRight = roadLeft + ROAD_WIDTH;

    for (let r = 0; r <= targetRow + 10; r++) {
      if (!s.lanes.has(r)) {
        const isPave = isPavement(r);
        const roadNum = getRoadNumber(r);
        const laneInRoad = isPave ? undefined : (r % ROAD_CYCLE) - 1;
        // Alternate directions for each car lane
        const direction = r % 2 === 0 ? 1 : -1;
        const speed = isPave ? 0 : calculateCarSpeed(r, difficulty);

        s.lanes.set(r, {
          index: r,
          type: isPave ? 'pavement' : 'road',
          roadNumber: roadNum,
          laneInRoad,
          direction: direction as 1 | -1,
          speed,
        });

        // Spawn cars for this road lane
        if (!isPave) {
          const carColors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];
          const carTypes: CarType[] = ['sedan', 'taxi', 'sport', 'beetle', 'muscle', 'truck'];

          // Place 2-3 cars per lane spread across the road and margins
          const numCars = 2 + (r % 2);
          const laneSpacing = (ROAD_WIDTH + 240) / numCars;

          for (let i = 0; i < numCars; i++) {
            const cType = carTypes[(r + i) % carTypes.length];
            const carWidth = cType === 'truck' ? 76 : cType === 'sport' ? 58 : 50;
            const carHeight = 32;
            const startX = roadLeft - 100 + i * laneSpacing + (Math.sin(r * 17 + i * 29) * 30);
            const carY = r * CELL_SIZE + (CELL_SIZE - carHeight) / 2;

            s.cars.push({
              id: r * 100 + i,
              lane: r,
              x: startX,
              y: carY,
              width: carWidth,
              height: carHeight,
              speed: direction * speed,
              type: cType,
              color: carColors[(r * 3 + i * 2) % carColors.length],
              roofColor: '#1E293B',
              windowColor: '#93C5FD',
            });
          }
        }
      }
    }
  }, [difficulty]);

  // Player movement handler
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const s = stateRef.current;
    if (!s.isAlive || s.isPaused) return;

    let targetCol = s.player.col;
    let targetRow = s.player.row;

    if (direction === 'up') {
      targetRow += 1;
    } else if (direction === 'down') {
      targetRow = Math.max(0, targetRow - 1);
    } else if (direction === 'left') {
      targetCol = Math.max(-5, targetCol - 1);
    } else if (direction === 'right') {
      targetCol = Math.min(5, targetCol + 1);
    }

    s.player.direction = direction;
    s.player.col = targetCol;
    s.player.row = targetRow;
    s.player.hopProgress = 0;
    s.player.isHopping = true;

    // 1. Calculate forward score (new forward step awards 1 point)
    const { points, newMaxRow } = calculateStepScore(targetRow, s.maxRowReached);
    if (points > 0) {
      s.score += points;
      s.maxRowReached = newMaxRow;
      setHudScore(s.score);
    }

    // 2. Check for successful Road Cross bonus (+10 points!)
    const { bonus, newHighestRoad, isCrossed } = calculateRoadCrossBonus(
      targetRow,
      s.highestRoadCrossed
    );
    if (isCrossed) {
      s.score += bonus;
      s.highestRoadCrossed = newHighestRoad;
      s.roadsCrossed = newHighestRoad;
      setHudScore(s.score);
      setHudRoadsCrossed(s.roadsCrossed);
      sounds.playRoadCross();

      // Show celebratory notice banner
      setRoadCrossNotice(true);
      setTimeout(() => setRoadCrossNotice(false), 1400);

      // Spawn burst of celebratory colorful star particles
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = 60 + Math.random() * 90;
        s.particles.push({
          x: s.player.x + CELL_SIZE / 2,
          y: s.player.y + CELL_SIZE / 2,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd,
          size: 4 + Math.random() * 4,
          color: ['#FACC15', '#38BDF8', '#34D399', '#F472B6', '#FFFFFF'][Math.floor(Math.random() * 5)],
          life: 0.6,
          maxLife: 0.6,
        });
      }
    }

    // Make sure upcoming lanes are generated
    const canvas = canvasRef.current;
    if (canvas) {
      ensureLanesGenerated(targetRow + 6, canvas.width);
    }
  }, [ensureLanesGenerated]);

  // Main game loop (60 FPS via requestAnimationFrame)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const roadLeft = (canvas.width - ROAD_WIDTH) / 2;
      const s = stateRef.current;
      s.player.targetX = roadLeft + (s.player.col + 5) * CELL_SIZE;
      s.player.targetY = s.player.row * CELL_SIZE;
      if (!s.player.isHopping) {
        s.player.x = s.player.targetX;
        s.player.y = s.player.targetY;
      }
      ensureLanesGenerated(s.player.row + 8, canvas.width);
    };

    resize();
    window.addEventListener('resize', resize);

    // Initial setup
    const s = stateRef.current;
    const roadLeft = (canvas.width - ROAD_WIDTH) / 2;
    s.player.x = roadLeft + 5 * CELL_SIZE;
    s.player.y = 0;
    s.player.targetX = s.player.x;
    s.player.targetY = s.player.y;
    s.cameraY = -CELL_SIZE * 2;
    ensureLanesGenerated(15, canvas.width);

    // Keyboard controls
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        s.isPaused = !s.isPaused;
        setIsPaused(s.isPaused);
        return;
      }

      if (s.isPaused || !s.isAlive) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        sounds.playHop();
        movePlayer('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        sounds.playHop();
        movePlayer('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        sounds.playHop();
        movePlayer('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        sounds.playHop();
        movePlayer('right');
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Animation frame tick
    const loop = (now: number) => {
      const rawDt = (now - s.lastTime) / 1000;
      s.lastTime = now;
      const dt = Math.min(rawDt, 0.05);

      if (!s.isPaused) {
        if (s.hitstop > 0) {
          s.hitstop -= dt;
        } else if (s.isAlive) {
          // 1. Advance Cars
          const roadLeft = (canvas.width - ROAD_WIDTH) / 2;
          const roadRight = roadLeft + ROAD_WIDTH;

          for (const car of s.cars) {
            car.x += car.speed * dt;
            // Wrap cars around when they drive off screen
            if (car.speed > 0 && car.x > roadRight + 120) {
              car.x = roadLeft - 160;
            } else if (car.speed < 0 && car.x < roadLeft - 160) {
              car.x = roadRight + 120;
            }
          }

          // 2. Animate Player Hop
          const targetX = roadLeft + (s.player.col + 5) * CELL_SIZE;
          const targetY = s.player.row * CELL_SIZE;

          if (s.player.isHopping) {
            s.player.hopProgress += dt * 8.5; // Fast responsive hop (~0.12s)
            if (s.player.hopProgress >= 1) {
              s.player.hopProgress = 0;
              s.player.isHopping = false;
              s.player.x = targetX;
              s.player.y = targetY;
            } else {
              s.player.x += (targetX - s.player.x) * (dt * 20);
              s.player.y += (targetY - s.player.y) * (dt * 20);
            }
          } else {
            s.player.x = targetX;
            s.player.y = targetY;
          }

          // 3. Collision Detection against cars
          const playerBox = {
            x: s.player.x,
            y: s.player.y,
            width: CELL_SIZE,
            height: CELL_SIZE,
          };

          for (const car of s.cars) {
            if (car.lane === s.player.row) {
              const carBox = {
                x: car.x,
                y: car.y,
                width: car.width,
                height: car.height,
              };

              if (checkCollision(playerBox, carBox)) {
                // Impact!
                s.isAlive = false;
                s.hitstop = 0.08;
                s.shake = 18;
                sounds.playCrash();

                // Spawn cartoon impact stars
                for (let i = 0; i < 24; i++) {
                  const angle = Math.random() * Math.PI * 2;
                  const spd = 70 + Math.random() * 110;
                  s.particles.push({
                    x: s.player.x + CELL_SIZE / 2,
                    y: s.player.y + CELL_SIZE / 2,
                    vx: Math.cos(angle) * spd,
                    vy: Math.sin(angle) * spd,
                    size: 3 + Math.random() * 5,
                    color: ['#EF4444', '#F59E0B', '#FFFFFF', '#DC2626'][Math.floor(Math.random() * 4)],
                    life: 0.5,
                    maxLife: 0.5,
                  });
                }

                // Trigger game over after brief dramatic beat
                setTimeout(() => {
                  onGameOver(s.score, s.roadsCrossed, s.maxRowReached);
                }, 600);
                break;
              }
            }
          }
        }

        // 4. Update particles
        for (let i = s.particles.length - 1; i >= 0; i--) {
          const p = s.particles[i];
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          if (p.life <= 0) {
            s.particles.splice(i, 1);
          }
        }

        // 5. Smooth Camera Lerp (follows player Y upwards)
        const targetCameraY = s.player.y - canvas.height * 0.32;
        s.cameraY += (targetCameraY - s.cameraY) * (dt * 6.0);

        // 6. Camera Shake decay
        if (s.shake > 0) {
          s.shake = Math.max(0, s.shake - dt * 30);
        }
      }

      // RENDERING
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      // Screen shake offset
      if (s.shake > 0) {
        const shakeX = (Math.random() - 0.5) * s.shake;
        const shakeY = (Math.random() - 0.5) * s.shake;
        ctx.translate(shakeX, shakeY);
      }

      // 1. Draw World Environment (Pavements, Asphalt, Sidewalks, Buildings)
      drawEnvironment(ctx, s.cameraY, canvas.width, canvas.height, s.lanes);

      // 2. Draw Cars
      for (const car of s.cars) {
        // Only draw visible cars
        const carDrawY = canvas.height - (car.y - s.cameraY);
        if (carDrawY > -80 && carDrawY < canvas.height + 80) {
          drawCar(ctx, car, s.cameraY, canvas.height);
        }
      }

      // 3. Draw Player Avatar (if alive or during crash tumble)
      if (s.isAlive || s.shake > 0) {
        drawPlayer(ctx, s.player, avatar, s.cameraY, canvas.height);
      }

      // 4. Draw Particles (confetti, crash sparks)
      drawParticles(ctx, s.particles, s.cameraY, canvas.height);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [avatar, ensureLanesGenerated, movePlayer, onGameOver]);

  const togglePause = () => {
    const s = stateRef.current;
    s.isPaused = !s.isPaused;
    setIsPaused(s.isPaused);
  };

  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const restartCurrent = () => {
    const s = stateRef.current;
    s.score = 0;
    s.roadsCrossed = 0;
    s.maxRowReached = 0;
    s.highestRoadCrossed = 0;
    s.isAlive = true;
    s.isPaused = false;
    s.player.col = 0;
    s.player.row = 0;
    s.player.hopProgress = 0;
    s.player.isHopping = false;
    s.cameraY = -CELL_SIZE * 2;
    s.cars = [];
    s.lanes.clear();
    setHudScore(0);
    setHudRoadsCrossed(0);
    setIsPaused(false);
    if (canvasRef.current) {
      ensureLanesGenerated(15, canvasRef.current.width);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 select-none">
      {/* 60 FPS Canvas */}
      <canvas
        ref={canvasRef}
        data-testid="game-canvas"
        className="absolute inset-0 block w-full h-full cursor-default pixelated"
      />

      {/* Game HUD */}
      <HUD
        score={hudScore}
        highScore={highScore}
        roadsCrossed={hudRoadsCrossed}
        difficulty={difficulty}
        avatar={avatar}
        isPaused={isPaused}
        isMuted={isMuted}
        roadCrossNotice={roadCrossNotice}
        onTogglePause={togglePause}
        onToggleMute={toggleMute}
      />

      {/* 4-Button Arrow Panel for Controls (Up, Down, Left, Right) as requested */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 sm:bottom-6 sm:right-6 sm:left-auto sm:translate-x-0 z-30 pointer-events-none">
        <TouchControls onMove={movePlayer} />
      </div>

      {/* Pause Modal */}
      {isPaused && (
        <PauseModal
          score={hudScore}
          onResume={togglePause}
          onRestart={restartCurrent}
          onHome={onReturnHome}
        />
      )}
    </div>
  );
};
