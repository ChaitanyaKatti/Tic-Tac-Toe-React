import React from 'react';
import { Cell } from './Cell';

export function Board({ board, winningCombo, onCellClick }) {
    // Note: board can contain `false` from Firebase, so we map it out
    return (
        <div className="aspect-square h-full max-w-full max-h-full mx-auto grid grid-cols-3 grid-rows-3 gap-2 p-1">
            {board.map((cellData, index) => {
                const cell = cellData === false ? null : cellData;
                const isWinningCell = winningCombo && winningCombo.includes(index);
                
                return (
                    <Cell 
                        key={index} 
                        index={index} 
                        cell={cell} 
                        isWinningCell={isWinningCell}
                        onClick={onCellClick}
                    />
                );
            })}
        </div>
    );
}
