import React from 'react';
import { DraggableDoll } from './DraggableDoll';

export function DollDeck({ color, inventory, isMe }) {
    return (
        <div className="flex flex-col items-center bg-black/20 p-1 md:p-2 rounded-lg w-full">
            <div className="flex flex-row items-end justify-center h-14 md:h-20 w-full space-x-1 md:space-x-2">
                {inventory.map((isAvail, idx) => {
                    const size = idx + 1;
                    return (
                        <DraggableDoll 
                            key={size}
                            size={size}
                            color={color}
                            isAvail={isAvail}
                            isMe={isMe}
                        />
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
