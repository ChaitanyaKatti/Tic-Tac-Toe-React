import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { DraggableDoll } from './DraggableDoll';

export function Cell({ index, stack, isWinningCell, myColor, turnColor }) {
    const { isOver, setNodeRef } = useDroppable({
        id: `cell-${index}`,
        data: { index }
    });

    const bgColor = index % 2 === 0 ? 'bg-[#aec993]' : 'bg-[#ebecd0]';
    
    const overStyle = isOver ? 'brightness-110 shadow-[inset_0_0_20px_rgba(255,255,255,0.5)] scale-[1.02]' : '';

    return (
        <div 
            ref={setNodeRef}
            className={`
                w-full h-full rounded-xl shadow-md
                flex items-center justify-center relative transition-transform duration-150
                ${bgColor}
                ${overStyle}
                ${isWinningCell ? 'scale-105 z-10 shadow-[0_0_15px_rgba(255,215,0,0.8)]' : ''}
            `}
        >
            {stack && stack.map((piece, i) => {
                const isTop = i === stack.length - 1;
                if (!isTop) {
                    return (
                        <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <img 
                                src={`/assets/${piece.color}.png`} 
                                alt={`${piece.color} doll size ${piece.size}`}
                                className="w-auto drop-shadow-md select-none pointer-events-none"
                                style={{ height: `${Math.max(30, (piece.size / 7) * 90)}%` }}
                            />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl md:text-4xl opacity-90 pointer-events-none" style={{ textShadow: '0 0 4px #000, 0 0 2px #000' }}>
                                {piece.size}
                            </span>
                        </div>
                    );
                } else {
                    return (
                        <DraggableDoll
                            key={i}
                            size={piece.size}
                            color={piece.color}
                            isAvail={true}
                            isMe={piece.color === myColor && turnColor === myColor}
                            sourceIndex={index}
                        />
                    );
                }
            })}
        </div>
    );
}
