"use client"; 
import { useState } from "react";

export default function ReviewsPage() {
  const [reviews] = useState([
    {
      id: 1,
      name: "ShadowHunter",
      comment: "Epic battles, insane energy — felt like an esports arena!",
      rating: 5,
    },
    {
      id: 2,
      name: "PixelWarrior",
      comment: "UI screams gaming vibes. Loved the neon glow!",
      rating: 4,
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-gray-900 to-black text-white font-mono">
      {/* Header */}
      <header className="py-12 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 drop-shadow-lg">
          ⚡ Tournament Reviews ⚡
        </h1>
        <p className="mt-4 text-lg text-gray-400 uppercase tracking-wider">
          Player voices from the battlefield
        </p>
      </header>

      {/* Reviews Section */}
      <main className="max-w-6xl mx-auto px-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-gray-800/80 border border-pink-500 rounded-xl p-6 shadow-lg hover:shadow-pink-500/50 transition transform hover:-translate-y-1 hover:scale-105"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-cyan-400 uppercase">
                {review.name}
              </h2>
              <span className="text-yellow-400 text-lg">
                {"★".repeat(review.rating)}
              </span>
            </div>
            <p className="mt-4 text-gray-300 italic">{review.comment}</p>
          </div>
        ))}
      </main>

      {/* Add Review Button */}
      <div className="text-center mt-12">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-linear-to-r from-pink-600 via-purple-600 to-cyan-600 text-white rounded-lg font-bold uppercase tracking-wider shadow-lg hover:opacity-90 transition transform hover:scale-105"
        >
          {showForm ? "Close Form" : "Add Review"}
        </button>
      </div>

      {/* Add Review Form (hidden by default) */}
      {showForm && (
        <section className="max-w-3xl mx-auto px-6 mt-10">
          <form className="space-y-4 bg-gray-900 border border-cyan-500 shadow-xl p-8 rounded-xl">
            <input
              type="text"
              placeholder="Your Gamer Tag"
              className="w-full px-4 py-2 bg-black border border-pink-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <textarea
              placeholder="Drop your battle review..."
              className="w-full px-4 py-2 bg-black border border-pink-500 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-linear-to-r from-pink-600 via-purple-600 to-cyan-600 text-white rounded-md font-bold uppercase tracking-wider hover:opacity-90 transition transform hover:scale-105"
            >
              Submit Review
            </button>
          </form>
        </section>
      )}
    </div>
  );
}



