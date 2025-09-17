import React, { useState } from "react";

export default function SongList({ onSelectSong, songName, songs, loading, error }) {
  const [currentSong, setCurrentSong] = useState(null);

  const handlePlay = (filename, e) => {
    e.stopPropagation(); // prevent card click
    
    const songUrl = `http://localhost:8080/songs/${filename}`;

    if (currentSong === songUrl) {
      setCurrentSong(null);
    } else {
      setCurrentSong(songUrl);
    }
  };

  if (loading) return <p className="text-gray-400">Loading songs...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="text-white flex flex-wrap items-center p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {songs.map((filename, idx) => {
          const displayName = filename.replace(/\.mp3$/i, "");
          const isSelected = songName === filename;

          return (
            <div
              key={idx}
              onClick={() => onSelectSong(filename)}
              className={`flex flex-col justify-between items-center p-4 rounded-lg shadow-md cursor-pointer duration-300
                bg-[#0E100F] hover:scale-102 
                ${isSelected ? "border-1 border-blue-400 scale-105" : "lightborder"}`}
            >
              <button
                onClick={(e) => handlePlay(filename, e)}
                className="px-4 cursor-pointer py-2 rounded-lg"
              >
                {currentSong === `http://localhost:8080/songs/${filename}` ? "⏹" : "▶"}
              </button>
              <p className="text-[10px] text-center mt-2">{displayName}</p>
             
            </div>
          );
        })}
      </div>

      {currentSong && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg w-full max-w-lg bg-[#0E100F]">
          <audio 
            controls 
            autoPlay 
            src={currentSong} 
            className="w-full"
            onEnded={() => setCurrentSong(null)}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}