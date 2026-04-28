import React from 'react';

export function DollDeck({ color, inventory, isMe, selectedDollSize, onSelectDoll }) {
    return (
        <div className="flex flex-col items-center bg-black/20 p-1 md:p-2 rounded-lg w-full">
            <div className="flex flex-row items-end justify-center h-14 md:h-20 w-full space-x-1 md:space-x-2">
                {inventory.map((isAvail, idx) => {
                    const size = idx + 1;
                    const available = isAvail !== false; // handle false from Firebase
                    const heightPercentage = Math.max(30, (size / 7) * 100);
                    const isSelected = selectedDollSize === size;

                    return (
                        <div 
                            key={size}
                            className={`
                                relative flex flex-col items-center justify-end w-7 md:w-10 h-full
                                transition-all duration-200
                                ${available && isMe ? 'cursor-pointer hover:-translate-y-1' : ''}
                                ${isSelected ? '-translate-y-2 scale-110 brightness-125' : ''}
                                ${!available ? 'opacity-30 grayscale pointer-events-none' : ''}
                            `}
                            onClick={() => {
                                if (isMe && available && onSelectDoll) {
                                    onSelectDoll(size);
                                }
                            }}
                        >
                            <img 
                                src={`/assets/${color}.png`} 
                                alt={`${color} doll size ${size}`}
                                className="w-auto drop-shadow-md"
                                style={{ height: `${heightPercentage}%` }}
                            />
                        </div>
                    );
                })}
            </div>
            <div className="flex flex-row justify-center w-full space-x-1 md:space-x-2 mt-1">
                {inventory.map((_, idx) => (
                    <div key={`num-${idx}`} className="w-7 md:w-10 text-center text-[10px] md:text-xs text-gray-400 font-mono">
                        {idx + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}
