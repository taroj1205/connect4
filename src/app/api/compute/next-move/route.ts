function findBestMove(grid: (string | null)[][]): number | null {
  // Placeholder for our player's identifier, e.g., "Red" or "Yellow"
  const ourPlayer = "Red";
  const opponent = "Yellow"; // Assuming a two-player game

  // Strategy 1: Check if we need to block the opponent's winning move
  let blockingMove = findWinningMove(grid, opponent);
  if (blockingMove !== null) {
    return blockingMove;
  }

  // Strategy 2: Check if we can win next
  let winningMove = findWinningMove(grid, ourPlayer);
  if (winningMove !== null) {
    return winningMove;
  }

  // Strategy 3: Naïve approach - just pick the first non-full column
  for (let col = 0; col < grid[0].length; col++) {
    if (grid[0][col] === null) {
      return col;
    }
  }

  // No moves available
  return null;
}

function checkWin(grid: (string | null)[][], player: string): boolean {
  // Check horizontal, vertical, and diagonal win conditions
  // This is a simple implementation and can be optimized
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (
        // Horizontal
        (grid[row][col] === player &&
          grid[row][col + 1] === player &&
          grid[row][col + 2] === player &&
          grid[row][col + 3] === player) ||
        // Vertical
        (grid[row][col] === player &&
          grid[row + 1]?.[col] === player &&
          grid[row + 2]?.[col] === player &&
          grid[row + 3]?.[col] === player) ||
        // Diagonal /
        (grid[row][col] === player &&
          grid[row + 1]?.[col + 1] === player &&
          grid[row + 2]?.[col + 2] === player &&
          grid[row + 3]?.[col + 3] === player) ||
        // Diagonal \
        (grid[row][col] === player &&
          grid[row + 1]?.[col - 1] === player &&
          grid[row + 2]?.[col - 2] === player &&
          grid[row + 3]?.[col - 3] === player)
      ) {
        return true;
      }
    }
  }
  return false;
}

function findWinningMove(grid: (string | null)[][], player: string): number | null {
  // Create a copy of the grid to test potential moves
  let testGrid = JSON.parse(JSON.stringify(grid));

  // Check each column to see if making a move there would result in a win
  for (let col = 0; col < testGrid[0].length; col++) {
    for (let row = testGrid.length - 1; row >= 0; row--) {
      if (testGrid[row][col] === null) {
        testGrid[row][col] = player;
        if (checkWin(testGrid, player)) {
          return col;
        }
        // Undo the move
        testGrid[row][col] = null;
        break;
      }
    }
  }

  return null;
}

export async function POST(request: Request) {
  const { grid } = await request.json()

  if (!grid) {
    return new Response(JSON.stringify({ error: 'No grid provided' }));
  }

  try {
    const move = findBestMove(grid);
    console.log(move);
    return new Response(JSON.stringify({ move }));
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }));
  }
}