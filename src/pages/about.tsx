import React from 'react'

export const AboutPage: React.FC = () => {
  return (
    <div className="px-3 py-8 relative z-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-o8-white mb-8">About Dist</h1>
      
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-o8-gray-200 mb-6">
          Dist is decentralized code sharing. When you create a dist, the data lives in your browser and is shared directly with others peer-to-peer.
        </p>
        
        <div className="bg-o8-black/20 border border-o8-gray-400/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-o8-white mb-4">How it works</h3>
          <ul className="space-y-3 text-o8-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-o8-primary">•</span>
              <span>Data is stored locally in your browser and synced over websockets and WebRTC to other peers.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-o8-primary">•</span>
              <span>Relays cache data to ensure availability, but when possible peers connect directly to each other over WebRTC.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-o8-primary">•</span>
              <span>Links are generated from a cryptographic hash of the content. If the content changes, the link changes.</span>
            </li>
          </ul>
        </div>
        <div className="mt-8 pt-8 flex items-center gap-3">
          <span className="text-sm">Powered by</span>
          <a href="https://gun.eco" target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
            <img src="https://gun.eco/media/gun.svg" alt="GunDB" className="h-8 w-auto" />
          </a>
        </div>
      </div>
    </div>
  )
}
