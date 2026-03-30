import Link from "next/link";

export default function ShadowingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Shadowing Lab</h1>
          <p className="text-slate-300 text-lg">
            Choose a practice mode to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* YouTube Mode Card */}
          <Link href="/shadowing/youtube">
            <div className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-8 h-full cursor-pointer border border-slate-600 hover:border-slate-500">
              <div className="mb-4">
                <div className="text-5xl mb-4">🎥</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                YouTube Mode
              </h2>
              <p className="text-slate-300 mb-6">
                Practice shadowing by following along with YouTube videos.
                Perfect for learning from native speakers.
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>✓ Video synchronization</p>
                <p>✓ AI coaching feedback</p>
                <p>✓ Speech recognition</p>
              </div>
            </div>
          </Link>

          {/* Script Mode Card */}
          <Link href="/shadowing/script">
            <div className="bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg p-8 h-full cursor-pointer border border-slate-600 hover:border-slate-500">
              <div className="mb-4">
                <div className="text-5xl mb-4">📝</div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Script Mode
              </h2>
              <p className="text-slate-300 mb-6">
                Paste any text or script and practice with smart sentence
                splitting. Great for controlled, focused practice.
              </p>
              <div className="space-y-2 text-sm text-slate-400">
                <p>✓ Smart text splitting</p>
                <p>✓ Auto-pronounce option</p>
                <p>✓ Loop playback feature</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 p-6 bg-slate-700 rounded-lg border border-slate-600">
          <p className="text-slate-300 text-center text-sm">
            💡 Tip: Use keyboard shortcuts like{" "}
            <span className="font-mono bg-slate-800 px-2 py-1 rounded">
              Space
            </span>{" "}
            to listen,{" "}
            <span className="font-mono bg-slate-800 px-2 py-1 rounded">
              A/D
            </span>{" "}
            to navigate, and{" "}
            <span className="font-mono bg-slate-800 px-2 py-1 rounded">R</span>{" "}
            to record. Press{" "}
            <span className="font-mono bg-slate-800 px-2 py-1 rounded">?</span>{" "}
            for help.
          </p>
        </div>
      </div>
    </div>
  );
}
