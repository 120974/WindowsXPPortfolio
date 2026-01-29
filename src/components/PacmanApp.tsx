import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  position: Position;
  direction: Position;
  color: string;
  name: string;
  startPosition: Position;
}

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export default function PacmanApp() {
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 13, y: 23 });
  const [pacmanDirection, setPacmanDirection] = useState<Direction>('none');
  const [mouthOpen, setMouthOpen] = useState(true);
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { position: { x: 11, y: 11 }, direction: { x: 1, y: 0 }, color: '#FF0000', name: 'Blinky', startPosition: { x: 13, y: 11 } },
    { position: { x: 13, y: 11 }, direction: { x: -1, y: 0 }, color: '#FFB8FF', name: 'Pinky', startPosition: { x: 13, y: 13 } },
    { position: { x: 15, y: 11 }, direction: { x: 1, y: 0 }, color: '#00FFFF', name: 'Inky', startPosition: { x: 11, y: 13 } },
    { position: { x: 13, y: 13 }, direction: { x: -1, y: 0 }, color: '#FFB851', name: 'Clyde', startPosition: { x: 15, y: 13 } }
  ]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameover' | 'won'>('paused');
  const [pellets, setPellets] = useState<Set<string>>(new Set());
  const [powerPellets, setPowerPellets] = useState<Set<string>>(new Set());
  const [frightened, setFrightened] = useState(false);
  const [lives, setLives] = useState(3);

  // Classic Pac-Man maze (28x31 grid)
  const maze = [
    "############################",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#O####.#####.##.#####.####O#",
    "#.####.#####.##.#####.####.#",
    "#..........................#",
    "#.####.##.########.##.####.#",
    "#.####.##.########.##.####.#",
    "#......##....##....##......#",
    "######.##### ## #####.######",
    "     #.##### ## #####.#     ",
    "     #.##          ##.#     ",
    "     #.## ###--### ##.#     ",
    "######.## #      # ##.######",
    "      .   #      #   .      ",
    "######.## #      # ##.######",
    "     #.## ######## ##.#     ",
    "     #.##          ##.#     ",
    "     #.## ######## ##.#     ",
    "######.## ######## ##.######",
    "#............##............#",
    "#.####.#####.##.#####.####.#",
    "#.####.#####.##.#####.####.#",
    "#O..##.......  .......##..O#",
    "###.##.##.########.##.##.###",
    "###.##.##.########.##.##.###",
    "#......##....##....##......#",
    "#.##########.##.##########.#",
    "#.##########.##.##########.#",
    "#..........................#",
    "############################"
  ];

  // Initialize pellets and power pellets
  useEffect(() => {
    const newPellets = new Set<string>();
    const newPowerPellets = new Set<string>();
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === '.') {
          newPellets.add(`${x},${y}`);
        } else if (maze[y][x] === 'O') {
          newPowerPellets.add(`${x},${y}`);
        }
      }
    }
    
    setPellets(newPellets);
    setPowerPellets(newPowerPellets);
  }, []);

  const isValidMove = (x: number, y: number) => {
    if (y < 0 || y >= maze.length || x < 0 || x >= maze[0].length) return false;
    const cell = maze[y][x];
    return cell !== '#' && cell !== '-';
  };

  const getNextPosition = (pos: Position, dir: Direction): Position => {
    const moves = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      none: { x: 0, y: 0 }
    };
    
    let newX = pos.x + moves[dir].x;
    let newY = pos.y + moves[dir].y;
    
    // Tunnel wrapping
    if (newX < 0) newX = maze[0].length - 1;
    if (newX >= maze[0].length) newX = 0;
    
    return { x: newX, y: newY };
  };

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Animate mouth
      setMouthOpen(prev => !prev);

      // Move Pacman
      setPacmanPos(prev => {
        const next = getNextPosition(prev, pacmanDirection);
        if (isValidMove(next.x, next.y)) {
          return next;
        }
        return prev;
      });

      // Move ghosts
      setGhosts(prevGhosts => prevGhosts.map((ghost) => {
        const directions = [
          { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }
        ];
        
        const validMoves = directions.filter(dir => {
          const newPos = { x: ghost.position.x + dir.x, y: ghost.position.y + dir.y };
          return isValidMove(newPos.x, newPos.y);
        });

        if (validMoves.length === 0) return ghost;

        // Avoid reversing unless necessary
        const reverseDir = { x: -ghost.direction.x, y: -ghost.direction.y };
        let possibleMoves = validMoves.filter(dir => 
          !(dir.x === reverseDir.x && dir.y === reverseDir.y)
        );
        
        if (possibleMoves.length === 0) possibleMoves = validMoves;

        let chosenDir;
        if (frightened) {
          chosenDir = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        } else {
          // Chase Pacman
          chosenDir = possibleMoves.reduce((best, dir) => {
            const newPos = { x: ghost.position.x + dir.x, y: ghost.position.y + dir.y };
            const bestPos = { x: ghost.position.x + best.x, y: ghost.position.y + best.y };
            
            const newDist = Math.abs(newPos.x - pacmanPos.x) + Math.abs(newPos.y - pacmanPos.y);
            const bestDist = Math.abs(bestPos.x - pacmanPos.x) + Math.abs(bestPos.y - pacmanPos.y);
            
            return newDist < bestDist ? dir : best;
          });
        }

        let newPos = { x: ghost.position.x + chosenDir.x, y: ghost.position.y + chosenDir.y };
        
        // Tunnel wrapping
        if (newPos.x < 0) newPos.x = maze[0].length - 1;
        if (newPos.x >= maze[0].length) newPos.x = 0;

        return { ...ghost, position: newPos, direction: chosenDir };
      }));
    }, 150);

    return () => clearInterval(gameLoop);
  }, [gameState, pacmanDirection, pacmanPos, frightened]);

  // Check collisions
  useEffect(() => {
    if (gameState !== 'playing') return;

    const key = `${pacmanPos.x},${pacmanPos.y}`;
    
    // Eat pellet
    if (pellets.has(key)) {
      setPellets(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      setScore(prev => prev + 10);
    }

    // Eat power pellet
    if (powerPellets.has(key)) {
      setPowerPellets(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      setScore(prev => prev + 50);
      setFrightened(true);
      setTimeout(() => setFrightened(false), 7000);
    }

    // Ghost collision
    const hitGhost = ghosts.find(g => g.position.x === pacmanPos.x && g.position.y === pacmanPos.y);
    if (hitGhost) {
      if (frightened) {
        setScore(prev => prev + 200);
        setGhosts(prev => prev.map(g => 
          g === hitGhost ? { ...g, position: { ...g.startPosition } } : g
        ));
      } else {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('gameover');
          } else {
            setPacmanPos({ x: 13, y: 23 });
            setPacmanDirection('none');
          }
          return newLives;
        });
      }
    }

    // Win condition
    if (pellets.size === 0 && powerPellets.size === 0 && gameState === 'playing') {
      setGameState('won');
      setScore(prev => prev + 1000);
    }
  }, [pacmanPos, pellets, powerPellets, ghosts, frightened, gameState]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState !== 'playing') return;

    const dirMap: Record<string, Direction> = {
      'arrowup': 'up', 'w': 'up',
      'arrowdown': 'down', 's': 'down',
      'arrowleft': 'left', 'a': 'left',
      'arrowright': 'right', 'd': 'right'
    };

    const dir = dirMap[e.key.toLowerCase()];
    if (dir) {
      e.preventDefault();
      setPacmanDirection(dir);
    }
  }, [gameState]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const startGame = () => setGameState('playing');

  const resetGame = () => {
    setPacmanPos({ x: 13, y: 23 });
    setPacmanDirection('none');
    setScore(0);
    setLives(3);
    setGameState('paused');
    setFrightened(false);
    setGhosts([
      { position: { x: 11, y: 11 }, direction: { x: 1, y: 0 }, color: '#FF0000', name: 'Blinky', startPosition: { x: 13, y: 11 } },
      { position: { x: 13, y: 11 }, direction: { x: -1, y: 0 }, color: '#FFB8FF', name: 'Pinky', startPosition: { x: 13, y: 13 } },
      { position: { x: 15, y: 11 }, direction: { x: 1, y: 0 }, color: '#00FFFF', name: 'Inky', startPosition: { x: 11, y: 13 } },
      { position: { x: 13, y: 13 }, direction: { x: -1, y: 0 }, color: '#FFB851', name: 'Clyde', startPosition: { x: 15, y: 13 } }
    ]);

    const newPellets = new Set<string>();
    const newPowerPellets = new Set<string>();
    
    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[y].length; x++) {
        if (maze[y][x] === '.') newPellets.add(`${x},${y}`);
        if (maze[y][x] === 'O') newPowerPellets.add(`${x},${y}`);
      }
    }
    
    setPellets(newPellets);
    setPowerPellets(newPowerPellets);
  };

  const renderPacman = () => {
    const rotation = { up: -90, down: 90, left: 180, right: 0, none: 0 }[pacmanDirection];
    return (
      <div 
        style={{
          position: 'absolute',
          left: `${pacmanPos.x * 20}px`,
          top: `${pacmanPos.y * 20}px`,
          width: '20px',
          height: '20px',
          transform: `rotate(${rotation}deg)`,
          transition: 'all 0.05s linear'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          background: '#FFFF00',
          borderRadius: '50%',
          position: 'relative',
          clipPath: mouthOpen ? 'polygon(100% 50%, 0% 0%, 0% 100%)' : 'circle(50%)'
        }} />
      </div>
    );
  };

  const renderGhost = (ghost: Ghost) => {
    const ghostColor = frightened ? '#2121DE' : ghost.color;
    return (
      <div
        key={ghost.name}
        style={{
          position: 'absolute',
          left: `${ghost.position.x * 20}px`,
          top: `${ghost.position.y * 20}px`,
          width: '20px',
          height: '20px',
          transition: 'all 0.05s linear'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          {/* Ghost body */}
          <path
            d="M 2 8 Q 2 2, 10 2 Q 18 2, 18 8 L 18 18 L 16 16 L 14 18 L 12 16 L 10 18 L 8 16 L 6 18 L 4 16 L 2 18 Z"
            fill={ghostColor}
          />
          {/* Eyes */}
          {!frightened && (
            <>
              <circle cx="7" cy="8" r="2" fill="white" />
              <circle cx="13" cy="8" r="2" fill="white" />
              <circle cx="7" cy="8" r="1" fill="#000080" />
              <circle cx="13" cy="8" r="1" fill="#000080" />
            </>
          )}
          {frightened && (
            <>
              <circle cx="7" cy="10" r="1.5" fill="white" />
              <circle cx="13" cy="10" r="1.5" fill="white" />
            </>
          )}
        </svg>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden" style={{ fontFamily: 'Tahoma, sans-serif' }}>
      {/* Header */}
      <div 
        className="h-28 border-b px-4 py-3"
        style={{ 
          background: 'linear-gradient(180deg, #000000 0%, #1a1a2e 50%, #000000 100%)',
          borderColor: '#FFD700',
          borderBottomWidth: '3px'
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="text-2xl animate-pulse">🟡</div>
            <div>
              <h2 className="text-lg" style={{ 
                color: '#FFFF00',
                textShadow: '0 0 10px #FFFF00, 0 0 20px #FF00FF',
                fontFamily: 'Impact, sans-serif',
                letterSpacing: '2px'
              }}>
                PAC-MAN
              </h2>
              <p className="text-xs" style={{ color: '#00FFFF' }}>ARCADE CLASSIC</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={gameState === 'playing' ? () => setGameState('paused') : startGame}
              className="px-3 py-1 text-xs border-2 hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #FFFF00 0%, #FF8800 100%)',
                borderColor: '#FFD700',
                borderRadius: '4px',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              {gameState === 'playing' ? '⏸ PAUSE' : '▶ START'}
            </button>
            <button
              onClick={resetGame}
              className="px-3 py-1 text-xs border-2 hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #FF0000 0%, #8B0000 100%)',
                borderColor: '#FF0000',
                borderRadius: '4px',
                color: '#FFF',
                fontWeight: 'bold'
              }}
            >
              🔄 NEW GAME
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs my-[-3px] my-[-2px] mx-[0px]">
          <div className="flex items-center space-x-4">
            <div className="px-2 py-1" style={{ background: '#1a1a2e', borderRadius: '4px', border: '1px solid #FFD700' }}>
              <span style={{ color: '#FFFF00', fontWeight: 'bold' }}>SCORE: </span>
              <span style={{ color: '#FFF' }}>{score}</span>
            </div>
            <div className="px-2 py-1" style={{ background: '#1a1a2e', borderRadius: '4px', border: '1px solid #FFD700' }}>
              <span style={{ color: '#FF69B4', fontWeight: 'bold' }}>LIVES: </span>
              <span style={{ color: '#FFFF00', fontSize: '16px' }}>{'●'.repeat(lives)}</span>
            </div>
            {frightened && (
              <div className="px-2 py-1 animate-pulse" style={{ background: '#0000FF', borderRadius: '4px', border: '2px solid #00FFFF' }}>
                <span style={{ color: '#FFFFFF', fontWeight: 'bold' }}>⚡ POWER MODE!</span>
              </div>
            )}
          </div>
          <div className="px-2 py-1" style={{ 
            color: gameState === 'gameover' ? '#FF0000' : gameState === 'won' ? '#00FF00' : '#00FFFF',
            fontWeight: 'bold'
          }}>
            {gameState === 'paused' && '👆 PRESS START'}
            {gameState === 'playing' && '🎮 ARROW KEYS'}
            {gameState === 'gameover' && '💀 GAME OVER'}
            {gameState === 'won' && '🎉 VICTORY!'}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 flex justify-center items-center overflow-hidden">
        <div style={{ position: 'relative', display: 'inline-block', transform: 'scale(0.65)', transformOrigin: 'center' }}>
          {/* Maze */}
          {maze.map((row, y) => (
            <div key={y} style={{ display: 'flex', height: '20px' }}>
              {row.split('').map((cell, x) => {
                const key = `${x},${y}`;
                return (
                  <div
                    key={x}
                    style={{
                      width: '20px',
                      height: '20px',
                      background: cell === '#' || cell === '-' ? '#2121DE' : '#000000',
                      border: cell === '#' ? '1px solid #4848DE' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {pellets.has(key) && (
                      <div style={{
                        width: '3px',
                        height: '3px',
                        background: '#FFB897',
                        borderRadius: '50%'
                      }} />
                    )}
                    {powerPellets.has(key) && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#FFB897',
                        borderRadius: '50%'
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          
          {/* Pacman */}
          {renderPacman()}
          
          {/* Ghosts */}
          {ghosts.map(renderGhost)}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t p-2 text-xs"
        style={{ 
          background: 'rgba(0, 0, 0, 0.9)',
          borderColor: '#333333',
          color: '#FFFF00'
        }}
      >
        <p>🕹️ Classic arcade gameplay • Eat all dots • Avoid ghosts • Power pellets turn ghosts blue</p>
      </div>
    </div>
  );
}
