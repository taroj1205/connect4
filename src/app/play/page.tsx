"use client";
import { NextMove } from "@/lib/next_move";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-dom-confetti";
import { FaArrowDown } from "react-icons/fa";

const Play = () => {
	const [grid, setGrid] = useState(
		Array(6)
			.fill(null)
			.map(() => Array(7).fill(null))
	);
	const currentPlayer = useRef("Red");
	const [winner, setWinner] = useState<string | null>(null);
	const [lastMove, setLastMove] = useState<[number, number] | null>(null);
	const [hoveredCol, setHoveredCol] = useState<boolean[]>(Array(7).fill(false));
	const [cellSize, setCellSize] = useState({
		width: 0,
		height: 0,
	});
	const [isEmpty, setEmpty] = useState(
		Array(6)
			.fill(null)
			.map(() => Array(7).fill(true))
	);
	const [winningCells, setWinningCells] = useState<[number, number][] | null>(
		null
	);
	const [isChecking, setIsChecking] = useState(false);
	const [bgColor, setBgColor] = useState("bg-gray-100");

	useEffect(() => {
		const cellWidth = document.getElementById("board")!.offsetWidth / 7;
		const cellHeight = document.getElementById("board")!.offsetHeight / 6;
		setCellSize({ width: cellWidth, height: cellHeight });
	}, []);
	const [playingWithAI, setPlayingWithAI] = useState(false);

	const checkWin = (grid: any[]) => {
		// Check horizontal, vertical and diagonal directions
		const directions = [
			[-1, 0],
			[1, 0],
			[0, -1],
			[0, 1],
			[-1, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
		];
		for (let row = 0; row < 6; row++) {
			for (let col = 0; col < 7; col++) {
				if (grid[row][col]) {
					for (let dir of directions) {
						let i;
						const winningCells = [];
						for (i = 0; i < 6; i++) { // Increase the limit to 6
							const x = row + dir[0] * i,
								y = col + dir[1] * i;
							if (
								x < 0 ||
								x >= 6 ||
								y < 0 ||
								y >= 7 ||
								grid[x][y] !== grid[row][col]
							)
								break;
							winningCells.push([col + dir[1] * i, row + dir[0] * i]);
						}
						if (i >= 4) { // Check if there are at least 4 pieces in a row
							return {
								winner: grid[row][col],
								winningCells: winningCells.map((cell) => [cell[0], cell[1]]),
							};
						}
					}
				}
			}
		}
		return { winner: null, winningCells: null };
	};

	const handleClick = async (column: number) => {
		if (winner || isChecking) return;
		setIsChecking(true);
		const newGrid = [...grid];
		let isColumnFull = true;
		for (let i = 5; i >= 0; i--) {
			if (!newGrid[i][column]) {
				newGrid[i][column] = currentPlayer.current;
				setLastMove([i, column]);
				setGrid(newGrid);
				const cellWidth = document.getElementById("board")!.offsetWidth / 7;
				const cellHeight = document.getElementById("board")!.offsetHeight / 6;
				setCellSize({ width: cellWidth, height: cellHeight });

				setEmpty((prev) => {
					const newIsDropping = [...prev];
					newIsDropping[i][column] = false;
					return newIsDropping;
				});

				const { winner, winningCells } = checkWin(newGrid);
				if (winner && winningCells) {
					setTimeout(() => {
						setWinner(winner);
						setWinningCells(winningCells.map((cell) => [cell[0], cell[1]]));
						setIsChecking(false);
					}, 500);
				} else {
					// After the current player makes a move
					if (!winner) {
						currentPlayer.current =
							currentPlayer.current === "Red" ? "Yellow" : "Red";
						// If AI mode is on and the current player is yellow, make a request to the AI endpoint
						if (playingWithAI && currentPlayer.current === "Yellow") {
							const startTime = Date.now();

							const aiMove = await NextMove(grid);
							console.log(aiMove);

							// Calculate the elapsed time
							const elapsedTime = Date.now() - startTime;

							// If less than a second has passed, wait the remaining time
							const delay = elapsedTime < 1000 ? 1000 - elapsedTime : 0;

							// Make the AI's move
							setTimeout(() => {
								if (typeof aiMove === "number") {
									handleClick(aiMove);
								}
							}, delay);
						} else {
							setIsChecking(false);
						}
					}
				}
				isColumnFull = false;
				break;
			}
		}
		if (isColumnFull) {
			setIsChecking(false);
		}
	};

	const config = {
		angle: 90,
		spread: 360,
		startVelocity: 40,
		elementCount: 70,
		dragFriction: 0.12,
		duration: 3000,
		stagger: 3,
		width: "10px",
		height: "10px",
		perspective: "500px",
		colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
	};

	const restartGame = () => {
		setGrid(
			Array(6)
				.fill(null)
				.map(() => Array(7).fill(null))
		);
		currentPlayer.current = "Red";
		setWinner(null);
		setLastMove(null);
		setEmpty(
			Array(6)
				.fill(null)
				.map(() => Array(7).fill(true))
		);
		setWinningCells(null);
	};

	const playWithAI = () => {
		restartGame();
		setPlayingWithAI(true);
	};

	useEffect(() => {
		if (playingWithAI && winner === "Yellow") {
			let count = 0;
			const intervalId = setInterval(() => {
				setBgColor(count % 2 === 0 ? "bg-red-500" : "bg-gray-100");
				count++;
				if (count === 6) {
					clearInterval(intervalId);
				}
			}, 150);
		}
	}, [playingWithAI, winner]);

	return (
		<div
			className={`flex flex-col items-center justify-center min-h-screen ${bgColor} transition-colors duration-100 text-black`}>
			<h1 className="text-4xl font-bold mb-4">
				Play Connect 4!{playingWithAI ? " (AI Mode)" : ""}
			</h1>
			<button
				onClick={playWithAI}
				disabled={playingWithAI}
				className="bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold mb-4 py-2 px-4 rounded z-10">
				Play with AI
			</button>
			{winner ? (
				<div className="mb-4 z-10 flex items-center justify-center flex-col">
					<h2 className="text-3xl mb-4">
						Winner:{" "}
						<span
							className={
								playingWithAI && winner === "Yellow"
									? "text-red-500"
									: winner === "Yellow"
									? "text-yellow-500"
									: "text-red-500"
							}>
							{playingWithAI && winner === "Yellow" ? "AI" : winner}
						</span>
					</h2>
					<button
						onClick={restartGame}
						className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
						Play Again
					</button>
				</div>
			) : (
				<h2
					className="text-2xl px-2 z-10"
					style={{
						backgroundColor:
							currentPlayer.current === "Red"
								? "rgba(255, 0, 0, 0.5)"
								: "rgba(255, 255, 0, 0.5)",
					}}>
					{playingWithAI && currentPlayer.current === "Yellow" && isChecking
						? "Thinking..."
						: `Current Player: ${currentPlayer.current}`}
				</h2>
			)}
			<div className="fixed">
				<Confetti active={winner !== null} config={config} />
			</div>
			<div
				className="grid-cols-7 z-0 gap-0 w-[35rem] h-auto max-w-[100svw] px-2 sm:px-0"
				style={{
					display: winner ? "none" : "grid",
					opacity: isChecking ? 0 : 1,
				}}>
				{Array(7)
					.fill(null)
					.map((_, index) => (
						<div
							key={index}
							className="relative aspect-square"
							style={{
								cursor: winner || isChecking ? "normal" : "pointer",
							}}
							onMouseEnter={() => {
								// if winner or all cells filled in the column
								if (winner || isEmpty.every((row) => row[index] === false))
									return;
								setHoveredCol((prev) => {
									const newHoveredCol = [...prev];
									newHoveredCol[index] = true;
									return newHoveredCol;
								});

								console.log(grid);
							}}
							onMouseLeave={() => {
								setHoveredCol((prev) => {
									const newHoveredCol = [...prev];
									newHoveredCol[index] = false;
									return newHoveredCol;
								});
							}}
							onClick={() => {
								if (!winner) {
									handleClick(index);
								}
							}}>
							<div
								className="absolute inset-0 rounded-full transition-opacity duration-300"
								style={{
									backgroundColor:
										currentPlayer.current === "Red"
											? "rgba(255, 0, 0, 0.5)"
											: "rgba(255, 255, 0, 0.5)",
									opacity: hoveredCol[index] ? 1 : 0,
								}}
							/>
							<div
								className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
								style={{
									opacity: hoveredCol.every((val) => val === false) ? 1 : 0,
								}}>
								<FaArrowDown className="text-3xl" />
							</div>
						</div>
					))}
			</div>
			<div
				id="board"
				className="grid grid-cols-7 gap-0 w-[35rem] h-auto max-w-[100svw] px-2 sm:px-0">
				{grid.map((row, y) =>
					row.map((cell, x) => {
						let cellsBelow = 0;

						for (let i = y + 1; i < 6; i++) {
							if (grid[i][x]) {
								cellsBelow++;
							} else {
								break;
							}
						}
						return (
							<div
								key={`${y}-${x}`}
								className="aspect-square border-l-2 border-t-2 border-gray-300 relative"
								onClick={() => {
									if (!winner) {
										handleClick(x);
									}
								}}
								style={{
									borderRightWidth: x === 6 ? 2 : 0,
									borderBottomWidth: y === 5 ? 2 : 0,
									cursor: winner || isChecking ? "normal" : "pointer",
									backgroundColor: winningCells?.some(
										(winningCell) =>
											winningCell[0] === x && winningCell[1] === y
									)
										? winner === "Red"
											? "rgba(255, 0, 0, 0.5)"
											: winner === "Yellow"
											? "rgba(255, 255, 0, 0.2)"
											: "transparent"
										: "transparent",
								}}
								onMouseEnter={() => {
									console.log(winningCells);
									setHoveredCol((prev) => {
										const newHoveredCol = [...prev];
										newHoveredCol[x] = true;
										return newHoveredCol;
									});
									console.log(
										isEmpty[y][x]
											? `${cellSize.height * (5 - cellsBelow)}px`
											: 0
									);
								}}
								onMouseLeave={() => {
									setHoveredCol((prev) => {
										const newHoveredCol = [...prev];
										newHoveredCol[x] = false;
										return newHoveredCol;
									});
								}}>
								<div
									className={`absolute left-0 w-full h-full rounded-full`}
									style={{
										backgroundColor:
											winningCells?.some(
												(winningCell) =>
													winningCell[0] === x && winningCell[1] === y
											) && cell === "Red"
												? "rgba(255, 0, 0, 1)" // Fully opaque red for winning red cells
												: winningCells?.some(
														(winningCell) =>
															winningCell[0] === x && winningCell[1] === y
												  ) && cell === "Yellow"
												? "rgba(255, 255, 0, 1)" // Fully opaque yellow for winning yellow cells
												: cell === "Red"
												? "rgba(255, 0, 0, 0.5)"
												: cell === "Yellow"
												? "rgba(255, 255, 0, 0.5)"
												: "transparent",
										bottom: isEmpty[y][x]
											? `${cellSize.height * (5 - cellsBelow)}px`
											: // : isEmpty.every((val) => val)
											  // ? `${cellSize.height * 5}px`
											  0,
										transition: "bottom 0.5s ease-in",
									}}
								/>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export default Play;
