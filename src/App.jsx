import React, { useState } from 'react';
import { useGameSync } from './hooks/useGameSync';
import { Lobby } from './components/Lobby';
import { Board } from './components/Board';
import { PlayerStrip } from './components/PlayerStrip';

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
        <div className="flex flex-col md:flex-row w-full h-full bg-[#302e2b] text-white">
            <div className="w-full md:w-64 bg-[#262522] p-4 flex flex-col items-center md:items-start shadow-xl z-10 shrink-0">
                <div className="text-xl font-bold mb-1">Room: <span className="font-mono text-[#81b64c] tracking-wider">{roomId}</span></div>
                <button 
                    onClick={leaveRoom}
                    className="mt-2 text-sm text-red-400 hover:text-red-300 underline"
                >
                    Leave Room
                </button>
            </div>

            <div className="flex-grow flex flex-col items-center justify-between p-4 overflow-y-auto">
                <PlayerStrip 
                    isMe={false}
                    player={gameState.players[opponentColor]}
                    color={opponentColor}
                    inventory={opInventory}
                />

                <div className="flex flex-col items-center w-full max-w-lg my-4 flex-grow justify-center">
                    <div className="text-center mb-4 min-h-[80px]">
                        <div className="text-2xl md:text-3xl font-bold bg-white/90 text-black px-4 py-2 rounded shadow-lg inline-block">
                            {mainMessage}
                        </div>
                        <div className="text-gray-400 mt-2 font-semibold h-6">{subMessage}</div>
                    </div>

                    <Board 
                        board={gameState.board || Array(9).fill(false)}
                        winningCombo={gameState.winningCombo}
                        onCellClick={handleCellClick}
                    />

                    {status === 'finished' && (
                        <button 
                            onClick={requestRestart}
                            disabled={gameState.restartRequests?.[myColor]}
                            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-800 disabled:text-gray-400 text-white rounded-lg font-bold text-lg shadow-lg transition-colors"
                        >
                            {gameState.restartRequests?.[myColor] ? 'Waiting...' : 'Play Again'}
                        </button>
                    )}
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
