import React from 'react';
import { Cell } from './Cell';

export function Board({ board, winningCombo, myColor, turnColor }) {
    return (
        <div 
            className="aspect-square mx-auto grid grid-cols-3 grid-rows-3 gap-2 p-1"
            style={{ width: '100%', maxWidth: 'min(100cqw, 100cqh)' }}
        >
            {board.map((cellData, index) => {
                const stack = cellData === false ? [] : cellData;
                const isWinningCell = winningCombo && winningCombo.includes(index);
                
                return (
                    <Cell 
                        key={index} 
                        index={index} 
                        stack={stack} 
                        isWinningCell={isWinningCell}
                        myColor={myColor}
                        turnColor={turnColor}
                    />
                );
            })}
        </div>
    );
}
