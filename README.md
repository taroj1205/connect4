## Connect 4 Game

This is a Connect 4 game implemented in TypeScript and React, using the Next.js framework. The game board is represented by a 6x7 grid, where two players take turns to drop their discs. The first player to align four of their own discs either vertically, horizontally, or diagonally wins the game.

### Getting Started

First, clone the repository to your local machine:
`git clone https://github.com/taroj1205/connect4.git`

Navigate into the project directory:

`cd connect4`

Install the dependencies:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Start the development server:

```
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start playing.

### Game Rules

1. The game is played on a grid that's 6 cells by 7 cells.
2. Two players take turns.
3. The pieces fall straight down, occupying the lowest available space within the column.
4. The objective of the game is to connect four of one's own discs of the same color next to each other vertically, horizontally, or diagonally before your opponent.
5. The game ends in a tie if the entire board is filled with discs and no player has won.

### Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License

This project is licensed under the MIT license.