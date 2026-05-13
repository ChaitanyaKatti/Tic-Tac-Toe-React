import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function DraggableDoll({ size, color, isAvail, isMe, sourceIndex = null }) {
    const available = isAvail !== false;
    const inCell = sourceIndex !== null;
    const heightPercentage = inCell ? Math.max(30, (size / 7) * 90) : Math.max(30, (size / 7) * 100);
    const id = inCell ? `board-${sourceIndex}-${size}` : `deck-${color}-${size}`;

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: { size, color, isMe, sourceIndex },
        disabled: !available || !isMe,
    });

    return (
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                relative flex flex-col items-center
                transition-all duration-200
                ${inCell ? 'justify-center w-full h-full' : 'justify-end w-7 md:w-10 h-full'}
                ${available && isMe ? (inCell ? 'cursor-grab' : 'cursor-grab hover:-translate-y-1 hover:brightness-110') : ''}
                ${!available ? 'opacity-30 grayscale pointer-events-none' : ''}
                ${isDragging ? 'opacity-0' : ''}
            `}
            style={{ touchAction: 'none' }}
        >
            <img 
                src={`/assets/${color}.png`} 
                alt={`${color} doll size ${size}`}
                className="w-auto drop-shadow-md select-none pointer-events-none"
                style={{ height: `${heightPercentage}%` }}
            />
            {inCell && (
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl md:text-4xl opacity-90 pointer-events-none" style={{ textShadow: '0 0 4px #000, 0 0 2px #000' }}>
                    {size}
                </span>
            )}
        </div>
    );
}
