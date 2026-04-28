import React, { useState, useEffect, useRef } from 'react';
import { useGameSync } from './hooks/useGameSync';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { PlayerStrip } from './components/PlayerStrip';
import { playSound, clickSound, moveSound, captureSound, gameStartSound, gameEndSound, illegalSound } from './lib/sounds';

function App() {
    const {
        roomId,
        myColor,
        gameState,
        error,
        createRoom,
        joinRoom,
        makeMove,
        requestRestart,
        leaveRoom
    } = useGameSync();

    const [selectedDollSize, setSelectedDollSize] = useState(null);

    const status = gameState?.status || 'waiting';
    const prevStatusRef = useRef(status);

    useEffect(() => {
        if (prevStatusRef.current === 'waiting' && status === 'active') {
            playSound(gameStartSound);
        } else if (prevStatusRef.current === 'active' && status === 'finished') {
            playSound(gameEndSound);
        }
        prevStatusRef.current = status;
    }, [status]);

    const handleSelectDoll = (size) => {
        if (selectedDollSize === size) {
            setSelectedDollSize(null);
        } else {
            setSelectedDollSize(size);
        }
    };

    const handleCellClick = (index) => {
        if (!selectedDollSize) return;
        if (status !== 'active') return;
        if (gameState.turnColor !== myColor) return;

        const cell = gameState.board[index];
        if (cell && cell !== false) {
            if (selectedDollSize <= cell.size) {
                playSound(illegalSound);
                return;
            } else {
                playSound(captureSound);
            }
        } else {
            playSound(moveSound);
        }

        makeMove(index, selectedDollSize);
        setSelectedDollSize(null);
    };

    if (!roomId || !gameState) {
        return (
            <div className="flex w-full h-full text-white">
                <Lobby onCreateRoom={createRoom} onJoinRoom={joinRoom} />
            </div>
        );
    }

    const opponentColor = myColor === 'white' ? 'black' : 'white';

    const myInventory = gameState.inventories?.[myColor] || Array(7).fill(false);
    const opInventory = gameState.inventories?.[opponentColor] || Array(7).fill(false);

    let mainMessage = '';
    let subMessage = '';

    if (status === 'waiting') {
        mainMessage = 'Waiting for opponent...';
        subMessage = `Room Code: ${roomId}`;
    } else if (status === 'finished') {
        if (gameState.winner === 'draw') {
            mainMessage = "It's a Draw!";
        } else if (gameState.winner === myColor) {
            mainMessage = "You Win!";
        } else {
            mainMessage = "You Lose!";
        }

        if (gameState.restartRequests?.[myColor]) {
            subMessage = "Waiting for opponent to restart...";
        } else if (gameState.restartRequests?.[opponentColor]) {
            subMessage = "Opponent wants to play again!";
        }
    } else {
        if (gameState.turnColor === myColor) {
            mainMessage = "Your Turn";
            subMessage = `You are ${myColor}`;
        } else {
            mainMessage = "Opponent's Turn";
            subMessage = `Opponent is ${opponentColor}`;
        }
    }

    return (
        <div className="flex flex-col md:flex-row w-full h-full bg-[#302e2b] text-white overflow-hidden">
            <div className="w-full md:w-64 bg-[#262522] p-2 md:p-4 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start shadow-xl z-10 shrink-0">
                <div className="text-lg md:text-xl font-bold mb-0 md:mb-1">Room: <span className="font-mono text-[#81b64c] tracking-wider">{roomId}</span></div>
                <button
                    onClick={() => { playSound(clickSound); leaveRoom(); }}
                    className="md:mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                    Leave Room
                </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-between p-2 overflow-hidden">
                <PlayerStrip
                    isMe={false}
                    player={gameState.players[opponentColor]}
                    color={opponentColor}
                    inventory={opInventory}
                />

                <div className="flex flex-col items-center w-full max-w-md my-1 md:my-2 flex-grow justify-center min-h-0">
                    <div className="text-center mb-2 flex flex-col justify-end shrink-0 gap-1">
                        <div className="text-xl md:text-2xl font-bold bg-white/90 text-black px-3 py-1 rounded shadow-lg inline-block">
                            {mainMessage}
                        </div>
                        <div className="text-gray-400 font-semibold text-xs md:text-sm">{subMessage}</div>
                    </div>

                    <div 
                        className="flex-grow w-full flex justify-center items-center min-h-0 overflow-hidden" 
                        style={{ containerType: 'size' }}
                    >
                        <Board
                            board={gameState.board || Array(9).fill(false)}
                            winningCombo={gameState.winningCombo}
                            onCellClick={handleCellClick}
                        />
                    </div>

                    <div className="h-10 md:h-12 shrink-0 flex items-center justify-center mt-2">
                        {status === 'finished' && (
                            <button
                                onClick={() => { playSound(clickSound); requestRestart(); }}
                                disabled={gameState.restartRequests?.[myColor]}
                                className="px-4 py-2 md:px-6 bg-red-500 hover:bg-red-600 disabled:bg-red-800 disabled:text-gray-400 text-white rounded-lg font-bold text-base md:text-lg shadow-lg transition-colors"
                            >
                                {gameState.restartRequests?.[myColor] ? 'Waiting...' : 'Play Again'}
                            </button>
                        )}
                    </div>
                </div>

                <PlayerStrip
                    isMe={true}
                    player={gameState.players[myColor]}
                    color={myColor}
                    inventory={myInventory}
                    selectedDollSize={selectedDollSize}
                    onSelectDoll={handleSelectDoll}
                />
            </div>
        </div>
    );
}

export default App;
