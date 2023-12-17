import Link from 'next/link'

export default function Home() {
	return (
		<main className="min-h-[100svh] flex flex-col items-center justify-center bg-gradient-to-r from-gray-100 to-gray-300 text-gray-800">
			<div className="text-center mt-8">
				<h1 className="text-5xl font-bold mb-4">Welcome to Connect 4!</h1>
				<p className="text-xl mb-4">
				</p>
			</div>

			<div className="mt-8">
				<h2 className="text-3xl font-bold mb-4">How to Play</h2>
				<p className="text-lg mb-4">
					Connect four of your pieces in a row while preventing your opponent from doing the same.
				</p>
			</div>

			<div className="mt-4">
				<img src="/connect-4.jpg" alt="Game Image" className="w-full max-w-3xl px-4 object-cover rounded-md" />
			</div>

			<div className="mt-8">
				<Link
					href="/play"
					className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold text-xl hover:bg-blue-700 transition-colors duration-200">
					Play Now
				</Link>
			</div>

			<footer className="mt-auto p-4 text-center">
				<p>© 2023 Connect 4. All rights reserved.</p>
			</footer>
		</main>
	);
}