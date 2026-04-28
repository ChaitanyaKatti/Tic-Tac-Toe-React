// Constants
export const NUM_DOLLS = 7;

// Winning combinations (indices of the 3x3 board)
const WINS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diags
];

/**
 * Checks if a specific color has a winning combination.
 * The board is an array of 9 objects: { color, size } or null.
 * A cell belongs to a color if the top-most doll matches that color.
 */
export function checkWinner(board, color) {
    for (let combo of WINS) {
        if (combo.every(idx => board[idx] && board[idx].color === color)) {
            return combo;
        }
    }
    return null;
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
 * If not, their turn should be skipped.
 * 
 * @param {Array} board - The 9-cell board array
 * @param {Array} inventory - The boolean array of length 7 representing the player's available dolls
 * @returns {boolean} - true if the player CAN move, false if they MUST skip
 */
export function canPlayerMove(board, inventory) {
    const availableSizes = getAvailableSizes(inventory);
    
    // If no dolls left, cannot move
    if (availableSizes.length === 0) {
        return false;
    }

    const largestAvailable = availableSizes[availableSizes.length - 1];

    // Check if the largest available doll can be placed on ANY cell
    for (let i = 0; i < 9; i++) {
        const cell = board[i];
        // If cell is empty, we can definitely move
        if (!cell) {
            return true;
        }
        // If cell is occupied, we can gobble if our largest is strictly larger
        if (largestAvailable > cell.size) {
            return true;
        }
    }

    return false;
}
