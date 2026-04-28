import { useState, useEffect } from 'react';
import { ref, onValue, set, update, get } from 'firebase/database';
import { database } from '../lib/firebase';
import { checkWinner, canPlayerMove } from '../lib/gameLogic';

export function useGameSync() {
    const [roomId, setRoomId] = useState(null);
    const [myColor, setMyColor] = useState(null);
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState(null);

    const getInitialGameState = () => ({
        // Initialize board with false instead of null to prevent Firebase from removing empty arrays
        board: Array(9).fill(false),
        turnColor: 'white',
        inventories: {
            white: Array(7).fill(true),
            black: Array(7).fill(true)
        },
        status: 'waiting', 
        winner: false,
        winningCombo: false,
        players: { white: false, black: false },
        restartRequests: { white: false, black: false },
        startingColor: 'white'
    });

    const generateRoomCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';
        for(let i = 0; i < 5; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const createRoom = async (playerName) => {
        const code = generateRoomCode();
        const initial = getInitialGameState();
        
        initial.players.white = { name: playerName };
        
        const roomRef = ref(database, `rooms/${code}`);
        await set(roomRef, initial);
        
        setRoomId(code);
        setMyColor('white');
        setError(null);
        return code;
    };

    const joinRoom = async (code, playerName) => {
        const roomCode = code.toUpperCase();
        const roomRef = ref(database, `rooms/${roomCode}`);
        const snapshot = await get(roomRef);
        
        if (!snapshot.exists()) {
            throw new Error("Room not found");
        }
        
        const data = snapshot.val();
        if (data.players.black && data.players.black !== false) {
            throw new Error("Room is full");
        }
        
        await update(roomRef, {
            'players/black': { name: playerName },
            'status': 'active'
        });
        
        setRoomId(roomCode);
        setMyColor('black');
        setError(null);
    };

    useEffect(() => {
        if (!roomId) return;
        
        const roomRef = ref(database, `rooms/${roomId}`);
        const unsubscribe = onValue(roomRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                // Ensure arrays have correct length if firebase truncated them
                if (!data.board) data.board = Array(9).fill(false);
                else while(data.board.length < 9) data.board.push(false);

                if (!data.inventories.white) data.inventories.white = Array(7).fill(false);
                else while(data.inventories.white.length < 7) data.inventories.white.push(false);

                if (!data.inventories.black) data.inventories.black = Array(7).fill(false);
                else while(data.inventories.black.length < 7) data.inventories.black.push(false);

                setGameState(data);
            } else {
                setError("Room deleted or disconnected");
            }
        });
        
        return () => unsubscribe();
    }, [roomId]);

    const makeMove = async (index, size) => {
        if (!gameState || gameState.status !== 'active' || gameState.turnColor !== myColor) return;
        if (!gameState.inventories[myColor][size - 1]) return; // don't have this doll
        
        // Convert 'false' back to null for game logic processing
        const currentBoard = gameState.board.map(c => c === false ? null : c);
        const cell = currentBoard[index];
        if (cell && cell.size >= size) return; // invalid gobble

        const newBoard = [...currentBoard];
        const newInventories = {
            white: [...gameState.inventories.white],
            black: [...gameState.inventories.black]
        };

        newBoard[index] = { color: myColor, size };
        newInventories[myColor][size - 1] = false;

        const winningCombo = checkWinner(newBoard, myColor);
        let nextTurnColor = myColor === 'white' ? 'black' : 'white';
        let newStatus = 'active';
        let winner = false;

        if (winningCombo) {
            newStatus = 'finished';
            winner = myColor;
        } else {
            const nextCanMove = canPlayerMove(newBoard, newInventories[nextTurnColor]);
            if (!nextCanMove) {
                const currentCanMove = canPlayerMove(newBoard, newInventories[myColor]);
                if (!currentCanMove) {
                    newStatus = 'finished';
                    winner = 'draw';
                } else {
                    nextTurnColor = myColor;
                }
            }
        }

        // Convert nulls back to false for Firebase
        const fbBoard = newBoard.map(c => c === null ? false : c);

        const roomRef = ref(database, `rooms/${roomId}`);
        await update(roomRef, {
            board: fbBoard,
            inventories: newInventories,
            turnColor: nextTurnColor,
            status: newStatus,
            winner: winner,
            winningCombo: winningCombo || false
        });
    };

    const requestRestart = async () => {
        if (!gameState || !roomId) return;
        
        const updates = {};
        updates[`restartRequests/${myColor}`] = true;
        
        const roomRef = ref(database, `rooms/${roomId}`);
        await update(roomRef, updates);
        
        const otherColor = myColor === 'white' ? 'black' : 'white';
        // If the other player has already requested restart OR we are in local dev and testing (but we should just check the state)
        // Note: The listener will fire when our update goes through, but the other player might also fire. 
        // Only the player who triggers the SECOND true should reset the game.
        if (gameState.restartRequests && gameState.restartRequests[otherColor] === true) {
            const nextStartingColor = gameState.startingColor === 'white' ? 'black' : 'white';
            const initial = getInitialGameState();
            
            initial.players = gameState.players;
            initial.startingColor = nextStartingColor;
            initial.turnColor = nextStartingColor;
            initial.status = 'active';
            
            await set(roomRef, initial);
        }
    };

    const leaveRoom = () => {
        setRoomId(null);
        setMyColor(null);
        setGameState(null);
    };

    return {
        roomId,
        myColor,
        gameState,
        error,
        createRoom,
        joinRoom,
        makeMove,
        requestRestart,
        leaveRoom
    };
}
