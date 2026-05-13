import React from 'react';
import { useDraggable } from '@dnd-kit/core';

export function DraggableDoll({ size, color, isAvail, isMe }) {
    const available = isAvail !== false;
    const heightPercentage = Math.max(30, (size / 7) * 100);
    const id = `doll-${color}-${size}`;

    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: { size, color, isMe },
        disabled: !available || !isMe,
    });

    return (
        <div 
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`
                relative flex flex-col items-center justify-end w-7 md:w-10 h-full
                transition-all duration-200
                ${available && isMe ? 'cursor-grab hover:-translate-y-1 hover:brightness-110' : ''}
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
        </div>
    );
}
