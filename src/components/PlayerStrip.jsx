import React from 'react';
import { User, Target } from 'lucide-react';
import { DollDeck } from './DollDeck';

export function PlayerStrip({ isMe, player, color, inventory, selectedDollSize, onSelectDoll }) {
    const Icon = isMe ? User : Target;
    const name = player ? player.name : (isMe ? 'You' : 'Waiting...');

    return (
        <div className="flex flex-col items-center gap-3 p-3 md:p-4 bg-white/10 rounded-xl my-2 w-full max-w-md">
            <div className="flex items-center gap-3 w-full justify-start text-white">
                <Icon size={32} />
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-white">{name}</span>
                    <span className="text-xs text-gray-300 font-mono">
                        {color ? `Playing as ${color}` : ''}
                    </span>
                </div>
            </div>
            <DollDeck 
                color={color || (isMe ? 'white' : 'black')} 
                inventory={inventory || Array(7).fill(false)} 
                isMe={isMe} 
                selectedDollSize={selectedDollSize}
                onSelectDoll={onSelectDoll}
            />
        </div>
    );
}
