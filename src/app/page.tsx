import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
		<main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white">
			<div className="text-center mt-8">
				<h1 className="text-5xl font-bold mb-4">Welcome to Connect 4!</h1>
				<p className="text-xl mb-8">
					The classic game, reimagined in a modern and digital format.
				</p>
				<Image
					src="/four-in-a-row.svg"
					alt="Four in a Row Logo"
					width={200}
					height={200}
				/>
			</div>

			<div className="mt-8">
				<Link
					href="/play"
					className="bg-white text-blue-700 px-6 py-3 rounded-lg font-bold text-xl hover:bg-blue-200 transition-colors duration-200">
					Play Now
				</Link>
			</div>

			<div className="mt-8 text-center">
				<p className="mb-4">
					Want to learn more about the game or need some tips?
				</p>
				<Link
					href="/learn"
					className="underline text-white hover:text-blue-200 transition-colors duration-200">
					Click here to Learn More
				</Link>
			</div>

			<footer className="mt-auto p-4 text-center">
				<p>© 2023 Four in a Row. All rights reserved.</p>
			</footer>
		</main>
	);
}