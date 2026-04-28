import React from 'react';
import { User, Target } from 'lucide-react';
import { DollDeck } from './DollDeck';

export function PlayerStrip({ isMe, player, color, inventory, selectedDollSize, onSelectDoll }) {
    const Icon = isMe ? User : Target;
    const name = player ? player.name : (isMe ? 'You' : 'Waiting...');

    return (
        <div className="flex flex-col items-center gap-1 md:gap-2 p-2 md:p-3 bg-white/10 rounded-xl my-1 w-full max-w-sm shrink-0">
            <div className="flex items-center gap-2 w-full justify-start text-white px-2">
                <Icon size={24} className="md:w-8 md:h-8" />
                <div className="flex flex-col leading-tight">
                    <span className="text-base md:text-lg font-bold text-white">{name}</span>
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
