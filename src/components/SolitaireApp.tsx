import { useState, useEffect } from 'react';

interface Card {
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
  value: number; // 1-13 (1=Ace, 11=Jack, 12=Queen, 13=King)
  faceUp: boolean;
  id: string;
}

interface DragState {
  cards: Card[];
  sourceType: 'tableau' | 'waste';
  sourceIndex?: number;
}

export default function SolitaireApp() {
  const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
  const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
  const [waste, setWaste] = useState<Card[]>([]);
  const [stock, setStock] = useState<Card[]>([]);
  const [dragging, setDragging] = useState<DragState | null>(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Create and shuffle deck
  const createDeck = (): Card[] => {
    const suits: Card['suit'][] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const deck: Card[] = [];
    
    suits.forEach(suit => {
      for (let value = 1; value <= 13; value++) {
        deck.push({ suit, value, faceUp: false, id: `${suit}-${value}-${Math.random()}` });
      }
    });
    
    // Fisher-Yates shuffle
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };

  // Initialize game
  const initializeGame = () => {
    const deck = createDeck();
    const newTableau: Card[][] = [[], [], [], [], [], [], []];
    let deckIndex = 0;
    
    // Deal to tableau
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row <= col; row++) {
        const card = deck[deckIndex++];
        card.faceUp = row === col;
        newTableau[col].push(card);
      }
    }
    
    const remainingDeck = deck.slice(deckIndex);
    
    setTableau(newTableau);
    setStock(remainingDeck);
    setWaste([]);
    setFoundations([[], [], [], []]);
    setScore(0);
    setMoves(0);
    setTime(0);
    setGameStarted(true);
    setGameWon(false);
    setDragging(null);
  };

  // Timer
  useEffect(() => {
    if (!gameStarted || gameWon) return;
    const timer = setInterval(() => setTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    initializeGame();
  }, []);

  // Check win
  useEffect(() => {
    const totalCards = foundations.reduce((sum, pile) => sum + pile.length, 0);
    if (totalCards === 52 && !gameWon) {
      setGameWon(true);
      setScore(s => s + 5000);
    }
  }, [foundations, gameWon]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCardDisplay = (card: Card) => {
    const suits = { hearts: '♥', diamonds: '♦', clubs: '♣', spades: '♠' };
    const values: Record<number, string> = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' };
    const value = values[card.value] || card.value.toString();
    return { value, suit: suits[card.suit] };
  };

  const isRed = (card: Card) => card.suit === 'hearts' || card.suit === 'diamonds';

  const canPlaceOnFoundation = (card: Card, foundationIndex: number) => {
    const foundation = foundations[foundationIndex];
    if (foundation.length === 0) return card.value === 1;
    const top = foundation[foundation.length - 1];
    return card.suit === top.suit && card.value === top.value + 1;
  };

  const canPlaceOnTableau = (card: Card, columnIndex: number) => {
    const column = tableau[columnIndex];
    if (column.length === 0) return card.value === 13;
    const top = column[column.length - 1];
    return isRed(card) !== isRed(top) && card.value === top.value - 1;
  };

  const drawFromStock = () => {
    if (stock.length === 0) {
      if (waste.length > 0) {
        setStock(waste.reverse().map(c => ({ ...c, faceUp: false })));
        setWaste([]);
      }
    } else {
      const drawn = stock[0];
      drawn.faceUp = true;
      setWaste([...waste, drawn]);
      setStock(stock.slice(1));
    }
    setMoves(m => m + 1);
  };

  const handleDragStart = (cards: Card[], sourceType: 'tableau' | 'waste', sourceIndex?: number) => {
    setDragging({ cards, sourceType, sourceIndex });
  };

  const handleDrop = (targetType: 'foundation' | 'tableau', targetIndex: number) => {
    if (!dragging) return;

    const card = dragging.cards[0];
    let valid = false;

    if (dragging.cards.length === 1) {
      if (targetType === 'foundation' && canPlaceOnFoundation(card, targetIndex)) {
        valid = true;
        // Remove from source
        if (dragging.sourceType === 'waste') {
          setWaste(w => w.filter(c => c.id !== card.id));
        } else if (dragging.sourceType === 'tableau' && dragging.sourceIndex !== undefined) {
          setTableau(t => {
            const newTableau = [...t];
            newTableau[dragging.sourceIndex!] = newTableau[dragging.sourceIndex!].filter(c => c.id !== card.id);
            // Flip top card
            const col = newTableau[dragging.sourceIndex!];
            if (col.length > 0 && !col[col.length - 1].faceUp) {
              col[col.length - 1].faceUp = true;
            }
            return newTableau;
          });
        }
        // Add to foundation
        setFoundations(f => {
          const newFoundations = [...f];
          newFoundations[targetIndex] = [...newFoundations[targetIndex], card];
          return newFoundations;
        });
        setScore(s => s + 10);
      }
    }

    if (targetType === 'tableau' && canPlaceOnTableau(card, targetIndex)) {
      valid = true;
      // Remove from source
      if (dragging.sourceType === 'waste') {
        setWaste(w => w.filter(c => c.id !== card.id));
      } else if (dragging.sourceType === 'tableau' && dragging.sourceIndex !== undefined) {
        setTableau(t => {
          const newTableau = [...t];
          const sourceCol = newTableau[dragging.sourceIndex!];
          const cardIndex = sourceCol.findIndex(c => c.id === card.id);
          newTableau[dragging.sourceIndex!] = sourceCol.slice(0, cardIndex);
          // Flip top card
          const col = newTableau[dragging.sourceIndex!];
          if (col.length > 0 && !col[col.length - 1].faceUp) {
            col[col.length - 1].faceUp = true;
          }
          return newTableau;
        });
      }
      // Add to tableau
      setTableau(t => {
        const newTableau = [...t];
        newTableau[targetIndex] = [...newTableau[targetIndex], ...dragging.cards];
        return newTableau;
      });
      setScore(s => s + 5);
    }

    if (valid) setMoves(m => m + 1);
    setDragging(null);
  };

  const autoMoveToFoundation = (card: Card, sourceType: 'tableau' | 'waste', sourceIndex?: number) => {
    for (let i = 0; i < 4; i++) {
      if (canPlaceOnFoundation(card, i)) {
        handleDragStart([card], sourceType, sourceIndex);
        handleDrop('foundation', i);
        return true;
      }
    }
    return false;
  };

  const renderCard = (card: Card, onClick?: () => void, onDoubleClick?: () => void) => {
    const { value, suit } = getCardDisplay(card);
    const color = isRed(card) ? '#DC143C' : '#000000';
    
    if (!card.faceUp) {
      return (
        <div
          className="w-full h-full border-2 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)',
            borderColor: '#1E3A8A',
            borderRadius: '4px'
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
            borderRadius: '2px'
          }} />
        </div>
      );
    }

    return (
      <div
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        className="w-full h-full border-2 bg-white cursor-pointer hover:shadow-lg transition-shadow"
        style={{ borderColor: '#000', borderRadius: '4px' }}
      >
        <div className="p-1 h-full flex flex-col justify-between">
          <div className="text-sm font-bold" style={{ color }}>
            {value}{suit}
          </div>
          <div className="text-2xl text-center" style={{ color }}>
            {suit}
          </div>
          <div className="text-sm font-bold text-right transform rotate-180" style={{ color }}>
            {value}{suit}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ 
      background: 'linear-gradient(180deg, #0A5F0A 0%, #085108 100%)',
      fontFamily: 'Tahoma, sans-serif'
    }}>
      {/* Header */}
      <div 
        className="h-16 border-b flex items-center justify-between px-4 py-2"
        style={{ 
          background: 'linear-gradient(135deg, #1e5128 0%, #4e9f3d 50%, #1e5128 100%)',
          borderColor: '#FFD700',
          borderBottomWidth: '2px'
        }}
      >
        <div className="flex items-center space-x-4">
          <div className="text-3xl">🃏</div>
          <div>
            <h2 className="text-base" style={{ 
              color: '#FFFFFF',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              fontWeight: 'bold'
            }}>Solitaire</h2>
            <p className="text-xs" style={{ color: '#90EE90' }}>KLONDIKE</p>
          </div>
          <button
            onClick={initializeGame}
            className="px-4 py-1.5 text-xs border-2 hover:scale-105 transition-transform ml-2"
            style={{
              background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
              borderColor: '#FFD700',
              borderRadius: '4px',
              color: '#000',
              fontWeight: 'bold'
            }}
          >
            🎴 NEW DEAL
          </button>
        </div>
        <div className="flex items-center space-x-3 text-xs">
          <div className="px-3 py-1 border-2" style={{ 
            background: 'rgba(0,0,0,0.3)',
            borderColor: '#90EE90',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Score: </span>
            <span style={{ color: '#FFF' }}>{score}</span>
          </div>
          <div className="px-3 py-1 border-2" style={{ 
            background: 'rgba(0,0,0,0.3)',
            borderColor: '#90EE90',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Time: </span>
            <span style={{ color: '#FFF' }}>{formatTime(time)}</span>
          </div>
          <div className="px-3 py-1 border-2" style={{ 
            background: 'rgba(0,0,0,0.3)',
            borderColor: '#90EE90',
            borderRadius: '4px'
          }}>
            <span style={{ color: '#FFD700', fontWeight: 'bold' }}>Moves: </span>
            <span style={{ color: '#FFF' }}>{moves}</span>
          </div>
        </div>
      </div>

      {gameWon && (
        <div className="m-4 p-4 border-2 text-center" style={{ 
          background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
          borderColor: '#FF8C00',
          borderRadius: '8px'
        }}>
          <h3 className="text-lg mb-2">🎉 You Win!</h3>
          <p className="text-sm">Time: {formatTime(time)} • Moves: {moves} • Score: {score}</p>
          <button
            onClick={initializeGame}
            className="mt-2 px-4 py-2 text-sm border hover:opacity-90"
            style={{
              background: 'linear-gradient(180deg, #4CAF50 0%, #45A049 100%)',
              color: 'white',
              borderColor: '#45A049',
              borderRadius: '4px'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Game Area */}
      <div className="flex-1 p-3 overflow-auto xp-scrollbar" style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
        {/* Top Row */}
        <div className="flex justify-between mb-6">
          {/* Stock & Waste */}
          <div className="flex space-x-3">
            <div
              onClick={drawFromStock}
              className="w-20 h-28 border-2 border-dashed rounded cursor-pointer hover:bg-green-700 flex items-center justify-center"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
            >
              {stock.length > 0 ? (
                <div className="w-full h-full flex items-center justify-center text-4xl">🂠</div>
              ) : (
                <div className="text-xs text-white text-center">Click<br/>to<br/>Reset</div>
              )}
            </div>
            <div
              className="w-20 h-28 border-2 border-dashed rounded"
              style={{ borderColor: 'rgba(255,255,255,0.3)' }}
              onDragOver={(e) => e.preventDefault()}
            >
              {waste.length > 0 && (
                <div
                  draggable
                  onDragStart={() => handleDragStart([waste[waste.length - 1]], 'waste')}
                  onDoubleClick={() => autoMoveToFoundation(waste[waste.length - 1], 'waste')}
                >
                  {renderCard(waste[waste.length - 1])}
                </div>
              )}
            </div>
          </div>

          {/* Foundations */}
          <div className="flex space-x-3">
            {foundations.map((foundation, i) => (
              <div
                key={i}
                className="w-20 h-28 border-2 border-dashed rounded cursor-pointer hover:bg-green-700"
                style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop('foundation', i)}
              >
                {foundation.length > 0 ? (
                  renderCard(foundation[foundation.length - 1])
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-white opacity-30">
                    {['♥', '♦', '♣', '♠'][i]}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Tableau */}
        <div className="flex space-x-3 justify-center">
          {tableau.map((column, colIdx) => (
            <div
              key={colIdx}
              className="w-20 min-h-28"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop('tableau', colIdx)}
            >
              {column.length === 0 ? (
                <div
                  className="w-20 h-28 border-2 border-dashed rounded cursor-pointer hover:bg-green-700"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  <div className="w-full h-full flex items-center justify-center text-xs text-white opacity-30">
                    K
                  </div>
                </div>
              ) : (
                column.map((card, cardIdx) => {
                  const canDrag = card.faceUp && cardIdx === column.length - 1;
                  const cardsToMove = column.slice(cardIdx);
                  
                  return (
                    <div
                      key={card.id}
                      className="w-20 h-28"
                      style={{ 
                        marginTop: cardIdx > 0 ? '-88px' : '0',
                        position: 'relative',
                        zIndex: cardIdx
                      }}
                      draggable={canDrag}
                      onDragStart={() => canDrag && handleDragStart(cardsToMove, 'tableau', colIdx)}
                      onDoubleClick={() => card.faceUp && autoMoveToFoundation(card, 'tableau', colIdx)}
                    >
                      {renderCard(card)}
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div 
        className="border-t p-2 text-xs text-white"
        style={{ 
          background: 'rgba(0, 0, 0, 0.3)',
          borderColor: 'rgba(255,255,255,0.2)'
        }}
      >
        <p>🃏 Drag cards to move • Double-click to auto-move to foundation • Build down by alternating colors • Build up foundations by suit</p>
      </div>
    </div>
  );
}
