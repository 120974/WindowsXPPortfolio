import { useState, useEffect } from 'react';

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  x: number;
  y: number;
}

export default function MinesweeperApp() {
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [mineCount, setMineCount] = useState(10);
  const [flagCount, setFlagCount] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'expert'>('beginner');

  const difficulties = {
    beginner: { rows: 9, cols: 9, mines: 10 },
    intermediate: { rows: 16, cols: 16, mines: 40 },
    expert: { rows: 16, cols: 30, mines: 99 }
  };

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && gameState === 'playing') {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, gameState]);

  // Initialize board
  const initializeBoard = () => {
    const config = difficulties[difficulty];
    const newBoard: Cell[][] = [];
    
    // Create empty board
    for (let row = 0; row < config.rows; row++) {
      newBoard[row] = [];
      for (let col = 0; col < config.cols; col++) {
        newBoard[row][col] = {
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          neighborMines: 0,
          x: col,
          y: row
        };
      }
    }

    // Place mines randomly
    let minesPlaced = 0;
    while (minesPlaced < config.mines) {
      const row = Math.floor(Math.random() * config.rows);
      const col = Math.floor(Math.random() * config.cols);
      if (!newBoard[row][col].isMine) {
        newBoard[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mine counts
    for (let row = 0; row < config.rows; row++) {
      for (let col = 0; col < config.cols; col++) {
        if (!newBoard[row][col].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = row + dr;
              const newCol = col + dc;
              if (newRow >= 0 && newRow < config.rows && 
                  newCol >= 0 && newCol < config.cols && 
                  newBoard[newRow][newCol].isMine) {
                count++;
              }
            }
          }
          newBoard[row][col].neighborMines = count;
        }
      }
    }

    setBoard(newBoard);
    setGameState('playing');
    setMineCount(config.mines);
    setFlagCount(0);
    setTimeElapsed(0);
    setGameStarted(false);
  };

  // Initialize board on component mount and difficulty change
  useEffect(() => {
    initializeBoard();
  }, [difficulty]);

  const revealCell = (row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isRevealed || board[row][col].isFlagged) {
      return;
    }

    if (!gameStarted) {
      setGameStarted(true);
    }

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    
    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      newBoard.forEach(r => r.forEach(c => {
        if (c.isMine) c.isRevealed = true;
      }));
      setGameState('lost');
    } else {
      // Reveal cell and potentially neighbors
      const cellsToReveal: {row: number, col: number}[] = [{row, col}];
      const visited = new Set<string>();

      while (cellsToReveal.length > 0) {
        const current = cellsToReveal.pop()!;
        const key = `${current.row}-${current.col}`;
        
        if (visited.has(key)) continue;
        visited.add(key);

        const cell = newBoard[current.row][current.col];
        if (cell.isFlagged || cell.isRevealed) continue;
        
        cell.isRevealed = true;

        // If cell has no neighboring mines, reveal all neighbors
        if (cell.neighborMines === 0) {
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const newRow = current.row + dr;
              const newCol = current.col + dc;
              if (newRow >= 0 && newRow < newBoard.length && 
                  newCol >= 0 && newCol < newBoard[0].length) {
                cellsToReveal.push({row: newRow, col: newCol});
              }
            }
          }
        }
      }
    }

    setBoard(newBoard);

    // Check for win condition
    const config = difficulties[difficulty];
    const revealedCells = newBoard.flat().filter(cell => cell.isRevealed && !cell.isMine).length;
    const totalSafeCells = config.rows * config.cols - config.mines;
    if (revealedCells === totalSafeCells) {
      setGameState('won');
    }
  };

  const toggleFlag = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[row][col].isRevealed) {
      return;
    }

    const newBoard = board.map(r => r.map(c => ({ ...c })));
    const cell = newBoard[row][col];
    
    if (cell.isFlagged) {
      cell.isFlagged = false;
      setFlagCount(flagCount - 1);
    } else {
      cell.isFlagged = true;
      setFlagCount(flagCount + 1);
    }

    setBoard(newBoard);
  };

  const getCellDisplay = (cell: Cell) => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines === 0) return '';
    return cell.neighborMines.toString();
  };

  const getCellColor = (cell: Cell) => {
    if (!cell.isRevealed || cell.neighborMines === 0) return '#000000';
    const colors = ['', '#0000ff', '#008000', '#ff0000', '#800080', '#800000', '#008080', '#000000', '#808080'];
    return colors[cell.neighborMines] || '#000000';
  };

  const getGameStateEmoji = () => {
    switch (gameState) {
      case 'won': return '😎';
      case 'lost': return '😵';
      default: return '🙂';
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '11px' }}>
      {/* Header */}
      <div 
        className="h-16 border-b px-3 py-2"
        style={{ 
          background: 'linear-gradient(180deg, #c0c0c0 0%, #808080 50%, #c0c0c0 100%)',
          borderColor: '#000',
          borderBottomWidth: '2px'
        }}
      >
        <div className="flex items-center justify-between mb-[8px] mt-[-4px] mr-[0px] ml-[0px]">
          <div className="flex items-center space-x-2">
            <div className="text-xl">💣</div>
            <div>
              <h2 className="text-sm" style={{ 
                color: '#000',
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(255,255,255,0.5)'
              }}>
                Minesweeper
              </h2>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as typeof difficulty)}
              className="text-xs border-2 px-2 py-1"
              style={{ borderColor: '#000', background: '#fff', borderRadius: '2px' }}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <button
              onClick={initializeBoard}
              className="px-2 py-1 text-xs border-2 hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                borderColor: '#000',
                borderRadius: '3px',
                color: '#000',
                fontWeight: 'bold'
              }}
            >
              NEW
            </button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="flex items-center justify-between mx-[0px] my-[-8px]">
          <div className="flex items-center space-x-3 text-xs">
            <div 
              className="px-2 py-1 border text-center"
              style={{ 
                background: '#000', 
                color: '#FF0000',
                borderColor: '#666',
                fontFamily: 'monospace',
                fontSize: '12px',
                minWidth: '50px',
                borderRadius: '1px'
              }}
            >
              💣 {String(mineCount - flagCount).padStart(3, '0')}
            </div>
            <button
              onClick={initializeBoard}
              className="text-2xl hover:scale-110 transition-transform"
            >
              {getGameStateEmoji()}
            </button>
            <div 
              className="px-2 py-1 border text-center"
              style={{ 
                background: '#000', 
                color: '#FF0000',
                borderColor: '#666',
                fontFamily: 'monospace',
                fontSize: '12px',
                minWidth: '50px',
                borderRadius: '1px'
              }}
            >
              ⏱️ {String(timeElapsed).padStart(3, '0')}
            </div>
          </div>
          <div className="text-xs px-2 py-1 border" style={{
            background: gameState === 'won' ? '#00FF00' : gameState === 'lost' ? '#FF0000' : '#FFFF00',
            borderColor: '#000',
            borderRadius: '2px',
            color: '#000',
            fontWeight: 'bold'
          }}>
            {gameState === 'won' && '🎉 WIN!'}
            {gameState === 'lost' && '💥 BOOM!'}
            {gameState === 'playing' && 'Right-click = flag'}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 p-2 overflow-auto xp-scrollbar bg-gray-200 flex justify-center items-center">
        <div className="inline-block" style={{ transform: 'scale(0.95)', transformOrigin: 'center' }}>
          <div 
            className="border-2 p-2"
            style={{ 
              borderColor: '#808080',
              background: '#c0c0c0'
            }}
          >
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-5 h-5 border text-xs font-bold flex items-center justify-center transition-colors ${
                      cell.isRevealed 
                        ? (cell.isMine ? 'bg-red-500' : 'bg-gray-300') 
                        : 'bg-gray-400 hover:bg-gray-300'
                    }`}
                    style={{
                      borderColor: cell.isRevealed ? '#999999' : '#ffffff #808080 #808080 #ffffff',
                      borderWidth: '1px',
                      color: getCellColor(cell),
                      borderStyle: cell.isRevealed ? 'inset' : 'outset'
                    }}
                    onClick={() => revealCell(rowIndex, colIndex)}
                    onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                    disabled={gameState !== 'playing'}
                  >
                    {getCellDisplay(cell)}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div 
        className="border-t p-3 text-xs"
        style={{ 
          background: 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
          borderColor: '#c0c0c0'
        }}
      >
        <p className="mb-1"><strong>How to play:</strong></p>
        <p>• Left-click to reveal cells • Right-click to flag mines • Numbers show nearby mine count</p>
        <p>• Reveal all safe cells to win • Avoid clicking mines!</p>
      </div>
    </div>
  );
}