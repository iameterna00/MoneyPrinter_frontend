import React, { useState, useEffect } from "react";
import { webApi } from "../../../api/api";
import VoiceCloneUploader from "./voiceclone";
import VoiceCloneList from "./voicecloneList";

export default function VoiceList({ onSelectVoice, voiceName, Voice }) {
  const [currentVoice, setCurrentVoice] = useState(null);
  const [clonedVoices, setClonedVoices] = useState([]);

  // Fetch cloned voices from backend
  const fetchClonedVoices = async () => {
    try {
      const res = await fetch(`${webApi}/list-audio`);
      if (res.ok) {
        const data = await res.json();
        setClonedVoices(data.voices || []);
      } else {
        console.error("Failed to fetch cloned voices");
      }
    } catch (err) {
      console.error("Error fetching cloned voices:", err);
    }
  };

  useEffect(() => {
    fetchClonedVoices();
  }, []);

  const handlePlay = (filename, isClone = false, e) => {
    e.stopPropagation(); // prevent card click
    const basePath = isClone ? "voiceclone" : "voice";
    const voiceUrl = `${webApi}/${basePath}/${filename}`;

    if (currentVoice === voiceUrl) {
      setCurrentVoice(null);
    } else {
      setCurrentVoice(voiceUrl);
    }
  };

  return (
    <div className="text-white flex flex-wrap items-center p-6">
      {/* Existing Voice Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
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
                onClick={(e) => handlePlay(filename, false, e)}
                className="px-4 cursor-pointer py-2 rounded-lg"
              >
                {currentVoice === `${webApi}/voice/files/${filename}` ? "⏹" : "▶"}
              </button>
              <p className="text-[10px] text-center mt-2">{displayName}</p>
              
            </div>
          );
        })}
      </div>
      <div className="w-full mt-10 lightbordertop pt-2 " >
        <h1 className="mt-2" >Cloned Voice</h1>
              
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-4">
          {clonedVoices.length > 0 ? (
            clonedVoices.map((filename, idx) => {
              const displayName = filename.replace(/\.(mp3|wav|webm|ogg|m4a)$/i, "");
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
                    onClick={(e) => handlePlay(filename, true, e)}
                    className="px-4 cursor-pointer py-2 rounded-lg"
                  >
                    {currentVoice === `${webApi}/voiceclone/files/${filename}` ? "⏹" : "▶"}
                  </button>
                  <p className="text-[10px] text-center mt-2">{displayName}</p>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm">No cloned voices yet.</p>
          )}
        </div>
      </div>
      

      {/* Voice Clone Section */}
      <div className="w-full mt-6">
        <h2 className="text-lg font-semibold mb-2">Voice Clone</h2>
        <VoiceCloneUploader onUploadSuccess={fetchClonedVoices} />
  
      </div>

      {/* Audio Player for selected voice */}
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
