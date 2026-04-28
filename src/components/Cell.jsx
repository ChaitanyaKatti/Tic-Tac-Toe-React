import React from 'react';

export function Cell({ index, cell, isWinningCell, onClick }) {
    // Basic checkered pattern colors
    const bgColor = index % 2 === 0 ? 'bg-[#aec993]' : 'bg-[#ebecd0]';
    
    // Scale the image height based on the size (1-7)
    // Map size 1 to ~30%, size 7 to ~90%
    const heightPercentage = cell ? Math.max(30, (cell.size / 7) * 90) : 0;

    return (
        <div 
            onClick={() => onClick(index)}
            className={`
                w-full h-full rounded-xl shadow-md cursor-pointer
                flex items-center justify-center relative transition-transform duration-150
                hover:scale-105
                ${bgColor}
                ${isWinningCell ? 'scale-105 z-10 shadow-[0_0_15px_rgba(255,215,0,0.8)]' : ''}
            `}
        >
            {cell && (
                <>
                    <img 
                        src={`/assets/${cell.color}.png`} 
                        alt={`${cell.color} doll size ${cell.size}`}
                        className="w-auto select-none pointer-events-none drop-shadow-md"
                        style={{ height: `${heightPercentage}%` }}
                    />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white font-bold text-2xl md:text-4xl opacity-90 pointer-events-none" style={{ textShadow: '0 0 4px #000, 0 0 2px #000' }}>
                        {cell.size}
                    </span>
                </>
            )}
        </div>
    );
}
