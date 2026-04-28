import React, { useState } from 'react';
import { playSound, clickSound } from '../lib/sounds';

export function Lobby({ onCreateRoom, onJoinRoom }) {
    const [name, setName] = useState(localStorage.getItem('myName') || '');
    const [roomCode, setRoomCode] = useState('');
    const [error, setError] = useState('');
    const [isJoining, setIsJoining] = useState(false);

    const handleCreate = async () => {
        playSound(clickSound);
        if (!name.trim()) return setError("Please enter your name");
        localStorage.setItem('myName', name.trim());
        try {
            await onCreateRoom(name.trim());
        } catch (err) {
            setError(err.message);
        }
    };

    const handleJoin = async () => {
        playSound(clickSound);
        if (!name.trim()) return setError("Please enter your name");
        if (roomCode.length !== 5) return setError("Room code must be 5 letters");
        localStorage.setItem('myName', name.trim());
        setIsJoining(true);
        try {
            await onJoinRoom(roomCode, name.trim());
        } catch (err) {
            setError(err.message);
            setIsJoining(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-[#302e2b] p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-sm flex flex-col items-center">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Tic Tac Toe v2</h1>
                
                <input 
                    type="text" 
                    placeholder="Enter your name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 text-lg rounded bg-white/10 text-white border border-gray-600 focus:outline-none focus:border-[#81b64c] mb-6"
                />

                <button 
                    onClick={handleCreate}
                    className="w-full p-3 text-lg bg-[#81b64c] hover:bg-[#5d9948] text-white rounded transition-colors mb-4 font-semibold"
                >
                    Create Game
                </button>

                <div className="flex items-center w-full mb-4">
                    <hr className="flex-grow border-gray-600" />
                    <span className="px-3 text-gray-400 text-sm">OR</span>
                    <hr className="flex-grow border-gray-600" />
                </div>

                <div className="flex w-full gap-2">
                    <input 
                        type="text" 
                        placeholder="5-Letter Code" 
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase().slice(0, 5))}
                        className="flex-grow p-3 text-lg rounded bg-white/10 text-white border border-gray-600 focus:outline-none focus:border-[#81b64c] uppercase font-mono"
                    />
                    <button 
                        onClick={handleJoin}
                        disabled={isJoining}
                        className="p-3 bg-[#81b64c] hover:bg-[#5d9948] text-white rounded transition-colors font-semibold disabled:opacity-50"
                    >
                        Join
                    </button>
                </div>

                {error && (
                    <div className="mt-4 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
