import React, { useState, useEffect, useRef } from 'react';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { useGameSync } from './hooks/useGameSync';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { PlayerStrip } from './components/PlayerStrip';
import { playSound, clickSound, moveSound, captureSound, gameStartSound, gameEndSound, illegalSound, selectSound } from './lib/sounds';

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

    const [activeDragData, setActiveDragData] = useState(null);

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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5 // require 5px movement to start drag (allows tapping without triggering drag)
            }
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveDragData(active.data.current);
        playSound(selectSound);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragData(null);

        if (!over) return; // Dropped outside valid cells

        if (status !== 'active' || gameState.turnColor !== myColor) {
            playSound(illegalSound);
            return;
        }

        const size = active.data.current.size;
        const sourceIndex = active.data.current.sourceIndex ?? null;
        const targetIndex = over.data.current.index;
        
        const currentBoard = gameState.board.map(c => c === false ? [] : c);
        const targetStack = currentBoard[targetIndex];
        const targetTopSize = targetStack.length > 0 ? targetStack[targetStack.length - 1].size : 0;
        
        if (size <= targetTopSize) {
            // Illegal move: smaller or equal size over existing
            playSound(illegalSound);
            return;
        } else if (targetTopSize > 0) {
            playSound(captureSound);
        } else {
            playSound(moveSound);
        }

        makeMove(targetIndex, size, sourceIndex);
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
        <DndContext 
            sensors={sensors}
            onDragStart={handleDragStart} 
            onDragEnd={handleDragEnd}
        >
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
                                myColor={myColor}
                                turnColor={gameState.turnColor}
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
                    />
                </div>
            </div>

            <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
                {activeDragData ? (() => {
                    const inCell = activeDragData.sourceIndex !== null && activeDragData.sourceIndex !== undefined;
                    const heightPercentage = inCell ? Math.max(30, (activeDragData.size / 7) * 90) : Math.max(30, (activeDragData.size / 7) * 100);
                    
                    return (
                        <div className={`flex flex-col items-center drop-shadow-2xl ${inCell ? 'justify-center w-[25vw] h-[25vw] max-w-[120px] max-h-[120px]' : 'justify-end w-7 md:w-10 h-14 md:h-20'}`}>
                            <img 
                                src={`/assets/${activeDragData.color}.png`} 
                                alt="dragged piece"
                                className={`w-auto select-none pointer-events-none ${inCell ? 'scale-[1.2]' : 'scale-110'}`}
                                style={{ height: `${heightPercentage}%` }}
                            />
                            {inCell && (
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-3xl md:text-5xl opacity-90 pointer-events-none" style={{ textShadow: '0 0 4px #000, 0 0 2px #000' }}>
                                    {activeDragData.size}
                                </span>
                            )}
                        </div>
                    );
                })() : null}
            </DragOverlay>
        </DndContext>
    );
}

export default App;
