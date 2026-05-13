// Constants
export const NUM_DOLLS = 7;

// Winning combinations (indices of the 3x3 board)
const WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diags
];

/**
 * Checks for winning combinations for both players simultaneously.
 * The board is an array of 9 stacks (arrays) or false.
 * A cell belongs to a color if the top-most doll matches that color.
 */
export function checkWinner(board) {
    const wins = { white: null, black: null };
    for (let combo of WINS) {
        // Get the top piece of each cell in the combo
        const cells = combo.map(idx => {
            const stack = board[idx];
            return (stack && stack.length > 0) ? stack[stack.length - 1] : null;
        });
        
        if (!wins.white && cells.every(c => c && c.color === 'white')) {
            wins.white = combo;
        }
        if (!wins.black && cells.every(c => c && c.color === 'black')) {
            wins.black = combo;
        }
    }
    return wins;
}

/**
 * Gets an array of available sizes (1-7) from an inventory array of booleans.
 */
export function getAvailableSizes(inventory) {
    const available = [];
    inventory.forEach((isAvail, index) => {
        if (isAvail) available.push(index + 1);
    });
    return available;
}

/**
 * Determines if a player has any valid moves left.
 * A move is valid if they can place a piece from inventory,
 * OR move one of their existing top pieces to a valid square.
 * 
 * @param {Array} board - The 9-cell board array of stacks
 * @param {Array} inventory - The boolean array of length 7 representing available dolls
 * @param {string} color - The color of the player to check
 * @returns {boolean} - true if the player CAN move
 */
export function canPlayerMove(board, inventory, color) {
    const availableSizes = getAvailableSizes(inventory);
    const largestInv = availableSizes.length > 0 ? availableSizes[availableSizes.length - 1] : 0;
    
    // Find all pieces the player can pick up from the board
    let movableBoardPieces = [];
    for (let i = 0; i < 9; i++) {
        const stack = board[i];
        if (stack && stack.length > 0) {
            const top = stack[stack.length - 1];
            if (top.color === color) {
                movableBoardPieces.push({ size: top.size, index: i });
            }
        }
    }

    // Check if there is ANY cell we can drop a piece on
    for (let i = 0; i < 9; i++) {
        const stack = board[i];
        const topSize = (stack && stack.length > 0) ? stack[stack.length - 1].size : 0;
        
        // Can we place our largest inventory piece here?
        if (largestInv > topSize) return true;
        
        // Can we place any of our board pieces here?
        for (let bp of movableBoardPieces) {
            if (bp.index !== i && bp.size > topSize) return true;
        }
    }

    return false;
}
