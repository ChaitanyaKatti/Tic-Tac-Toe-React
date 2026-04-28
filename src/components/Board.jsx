import React from 'react';
import { Cell } from './Cell';

export function Board({ board, winningCombo, onCellClick }) {
    // Note: board can contain `false` from Firebase, so we map it out
    return (
        <div className="w-full max-w-md aspect-square grid grid-cols-3 grid-rows-3 gap-2 md:gap-3 p-4">
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
