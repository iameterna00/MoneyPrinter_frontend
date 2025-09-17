import React, { useState } from "react";

export default function VoiceList({ onSelectVoice, voiceName, Voice }) {
  const [currentVoice, setCurrentVoice] = useState(null);

  const handlePlay = (filename, e) => {
    e.stopPropagation(); // prevent card click

    const voiceUrl = `http://localhost:8080/voice/${filename}`;

    if (currentVoice === voiceUrl) {
      setCurrentVoice(null);
    } else {
      setCurrentVoice(voiceUrl);
    }
  };

  return (
    <div className="text-white flex flex-wrap items-center p-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {Voice.map((filename, idx) => {
          const displayName = filename.replace(/\.mp3$/i, "");
          const isSelected = voiceName === filename;

          return (
            <div
              key={idx}
              onClick={() => onSelectVoice(filename)}
              className={`flex flex-col justify-between items-center p-4 rounded-lg shadow-md cursor-pointer duration-300
                bg-[#0E100F] hover:scale-102 
                ${isSelected ? "border-2 border-blue-400 scale-105" : "lightborder"}`}
            >
              <button
                onClick={(e) => handlePlay(filename, e)}
                className="px-4 cursor-pointer py-2 rounded-lg"
              >
                {currentVoice === `http://localhost:8080/voice/${filename}` ? "⏹" : "▶"}
              </button>
              <p className="text-[10px] text-center mt-2">{displayName}</p>
            </div>
          );
        })}
      </div>

      {currentVoice && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg w-full max-w-lg bg-[#0E100F]">
          <audio 
            controls 
            autoPlay 
            src={currentVoice} 
            className="w-full"
            onEnded={() => setCurrentVoice(null)}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
