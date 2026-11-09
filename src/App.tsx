import React, { useState, useEffect, useCallback } from 'react';
import { GameState, Difficulty, Avatar } from './game/types';
import { DEFAULT_AVATAR } from './game/avatars';
import { StartScreen } from './components/StartScreen';
import { GameCanvas } from './components/GameCanvas';
import { GameOverModal } from './components/GameOverModal';
import { sounds } from './game/audio';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('title');
  const [avatar, setAvatar] = useState<Avatar>(DEFAULT_AVATAR);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScore, setHighScore] = useState<number>(0);

  // End of run stats for Game Over modal
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastRoadsCrossed, setLastRoadsCrossed] = useState<number>(0);
  const [lastMaxSteps, setLastMaxSteps] = useState<number>(0);
  const [isNewHigh, setIsNewHigh] = useState<boolean>(false);

  // Load high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cross_high_score');
      if (saved) {
        setHighScore(parseInt(saved, 10) || 0);
      }
    } catch {}
  }, []);

  // Check ?autostart=1 support for automated verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      setGameState('playing');
      document.body.dataset.state = 'playing';
    }
  }, []);

  // Sync document.body.dataset.state with gameState
  useEffect(() => {
    document.body.dataset.state = gameState;
  }, [gameState]);

  // Space/Enter starts game on title screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        sounds.playSelect();
        setGameState('playing');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const handleStartGame = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleGameOver = useCallback((score: number, roadsCrossed: number, maxSteps: number) => {
    setLastScore(score);
    setLastRoadsCrossed(roadsCrossed);
    setLastMaxSteps(maxSteps);

    let isNew = false;
    setHighScore((prev) => {
      if (score > prev) {
        isNew = true;
        try {
          localStorage.setItem('cross_high_score', String(score));
        } catch {}
        return score;
      }
      return prev;
    });

    setIsNewHigh(isNew);
    setGameState('gameover');
  }, []);

  const handleReplay = useCallback(() => {
    setGameState('playing');
  }, []);

  const handleReturnHome = useCallback(() => {
    setGameState('title');
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-slate-900 select-none">
      {gameState === 'title' && (
        <StartScreen
          currentAvatar={avatar}
          difficulty={difficulty}
          highScore={highScore}
          onSelectAvatar={setAvatar}
          onSelectDifficulty={setDifficulty}
          onStartGame={handleStartGame}
        />
      )}

      {gameState === 'playing' && (
        <GameCanvas
          key={`${avatar.id}-${difficulty}-${Date.now()}`}
          avatar={avatar}
          difficulty={difficulty}
          highScore={highScore}
          onGameOver={handleGameOver}
          onReturnHome={handleReturnHome}
        />
      )}

      {gameState === 'gameover' && (
        <>
          {/* Background frozen view during game over */}
          <div className="w-full h-full bg-slate-950/90" />
          <GameOverModal
            score={lastScore}
            highScore={highScore}
            roadsCrossed={lastRoadsCrossed}
            maxForwardSteps={lastMaxSteps}
            isNewHigh={isNewHigh}
            onReplay={handleReplay}
            onHome={handleReturnHome}
          />
        </>
      )}
    </div>
  );
}
