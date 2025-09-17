import React, { useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react'; 
import stock from '../../assets/stock.jpg'
import cartoon from '../../assets/cartoon.png'
import realistic from '../../assets/realistic.png'
import { CircleFadingPlus, Scroll, ArrowUp, CircleStop } from "lucide-react";

export const VideoPromptInput = ({
  useCustomPrompt,
  setUseCustomPrompt,
  customPrompts,
  updateCustomPrompt,
  setDrawerOpen,
  videoSubject,
  setVideoSubject,
  save,
  isGenerating,
  generateVideo,
  cancelGeneration,
  setContentType,
  contentType
}) => {
  return (
<>
    <div className="relative w-full flex flex-col gap-2">
      {/* Textarea */}
      {useCustomPrompt ? (
        <>
          <div className="relative w-full flex items-center gap-2">
            <textarea
              rows={3}
              value={customPrompts[0] || ""}
              placeholder="Write Your Video Script"
              onChange={(e) => updateCustomPrompt(0, e.target.value)}
              className={`
                lightborder p-4
                focus:outline-none
                h-60
                rounded-sm
                scrollbar-hide
                bg-transparent
                text-[12px]
                text-white
                placeholder-gray-400
                duration-500
                w-full
              `}
            />
          </div>

          {/* Add new prompt / drawer */}
          <div
            onClick={() => setDrawerOpen(true)}
            className={`
              absolute bottom-4 right-25 cursor-pointer p-1 border rounded-full
              text-gray-300 hover:bg-gray-300 hover:text-black
              text-[10px] flex items-center justify-center
              duration-300
            `}
          >
            <CircleFadingPlus size={14} />
          </div>
        </>
      ) : (
        <textarea
          rows={3}
          value={videoSubject}
          placeholder="Describe your video"
          onChange={(e) => {
            setVideoSubject(e.target.value);
            save("videoSubject", e.target.value);
          }}
          className="lightborder p-4 rounded-sm h-60 text-white placeholder-gray-400 w-full"
        />
      )}

      {/* Toggle Custom Prompt */}
      <div
        onClick={() => setUseCustomPrompt(!useCustomPrompt)}
        className={`
          absolute bottom-4 right-15 cursor-pointer p-1 border rounded-full
          text-gray-300 text-[10px]
          hover:text-black hover:bg-gray-300
          duration-300
          ${useCustomPrompt ? "bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 shadow-[0_0_2px_rgba(99,102,241,0.2)] animate-ai-pulse" : ""}
        `}
      >
        <Scroll size={14} />
      </div>

      {/* Generate / Cancel */}
      {!isGenerating ? (
        <div className="absolute bottom-4 right-4 cursor-pointer p-1 border rounded-full bg-gray-300 hover:text-gray-300 hover:bg-transparent duration-300">
          <ArrowUp size={14} onClick={generateVideo} />
        </div>
      ) : (
        <div
          onClick={cancelGeneration}
          className="absolute bottom-4 right-4 cursor-pointer p-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-teal-400 shadow-[0_0_20px_rgba(99,102,241,0.8)] animate-ai-pulse transition-transform duration-300 hover:scale-110"
        >
          <CircleStop className="text-white w-5 h-5 drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
        </div>
      )}
 
    </div>
                   {/* ART STYLE */}
      <div className="mb-4">
      <h1 className="text-white mb-2 text-md font-semibold block">Style</h1>
    <div className="flex gap-4">
  {[
    { value: "generative", label: "Cineamtic", img: realistic },
    { value: "stock", label: "Stock Videos", img: stock },
    { value: "cartoon", label: "Dark Cartoon", img: cartoon },
  ].map((option) => (
    <div
      key={option.value}
      onClick={() => {
        setContentType(option.value);
        save("contentType", option.value);
      }}
      className="cursor-pointer rounded-md hover:scale-102 transition-all duration-400"
    >
      <img
        src={option.img}
        alt={option.label}
        className={`w-[100px] md:w-[130px] lg:w-[180px] aspect-[9/16] object-cover mb-1 rounded-md 
          border transition-all duration-300
          ${contentType === option.value ? "border-cyan-500" : "border-transparent"}
        `}
      />
      <p className="text-white text-sm text-center">{option.label}</p>
    </div>
  ))}
</div>

    </div></>
  );
};

// AI Modal Component
export const AIModal = ({ aiModel, setAiModel, customPrompt, setCustomPrompt, setActiveModal, save }) => (
  <div className="modal bg-[#111]  relative">
    <h3 className="text-white text-lg mb-4">AI Settings</h3>
    <label className="text-white">AI Model</label>
    <select
      value={aiModel}
      onChange={(e) => {
        setAiModel(e.target.value);
        save("aiModel", e.target.value);
      }}
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    >
      <option value="deepseek-chat">DeepSeek Chat (Free)</option>
      <option value="g4f">g4f (Free)</option>
      <option value="gpt3.5-turbo">OpenAI GPT-3.5</option>
      <option value="gpt4">OpenAI GPT-4</option>
      <option value="gemmini">Gemini Pro</option>
    </select>
    
    <label className="text-white">Custom Prompt</label>
    <textarea
      rows="3"
      value={customPrompt}
      onChange={(e) => {
        setCustomPrompt(e.target.value);
        save("customPrompt", e.target.value);
      }}
      placeholder="Replace the default prompt..."
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    />
    
    <button
      onClick={() => setActiveModal(null)}
      className="absolute right-0 top-0 cursor-pointer duration-300 text-gray-300 rounded-md p-2 hover:text-red-500"
    >
      <X />
    </button>
  </div>
);

// Voice Modal Component



export const VoiceSelector = ({ voice, setVoice, save }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const voices = [
    { id: "en_us_ghostface", label: "Ghost Face" },
    { id: "en_us_chewbacca", label: "Chewbacca" },
    { id: "en_us_c3po", label: "C3PO" },
    { id: "en_us_stitch", label: "Stitch" },
    { id: "en_us_stormtrooper", label: "Stormtrooper" },
    { id: "en_us_rocket", label: "Rocket" },
    { id: "en_au_001", label: "English AU - Female" },
    { id: "en_au_002", label: "English AU - Male" },
    { id: "en_uk_001", label: "English UK - Male 1" },
    { id: "en_uk_003", label: "English UK - Male 2" },
    // Add more voices here
  ];

  const handleSelect = (id) => {
    setVoice(id);
    save("voice", id);
    setIsModalOpen(false); // close modal after selection
  };

  return (
    <div className="w-full my-2 rounded-md">
      {/* Button to open modal */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="px-4 py-1 lightborder   items-center text-sm justify-between flex w-full text-white rounded-md hover:bg-gray-900 transition-colors duration-300"
      >
       <h1>Select Voice</h1>
       <ChevronsUpDown size={16} />

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm ">
         <div className="bg-[#000]/70 lightborder backdrop-blur-3xl p-6 rounded-md w-full max-w-2xl relative">
            <h3 className="text-white text-lg font-semibold mb-4">Voice Settings</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {voices.map((v) => (
                <div
                  key={v.id}
                  onClick={() => handleSelect(v.id)}
                  className={`
                    cursor-pointer p-4 rounded-md flex flex-col items-center justify-center
                    transition-all duration-200
                    ${voice === v.id ? "bg-cyan-500/20 ring-2 ring-cyan-400" : "bg-gray-800/50 hover:bg-gray-700/70"}
                  `}
                >
                  <div className="w-12 h-12 mb-2 flex items-center justify-center bg-gray-900 rounded-full">
                    {/* Replace with real play button or audio */}
                    <button className="text-cyan-400">▶</button>
                  </div>
                  <p className="text-center text-sm text-white">{v.label}</p>
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-300 hover:text-red-500"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Subtitles Modal Component
export const SubtitlesModal = ({ subtitlesPosition, setSubtitlesPosition, subtitlesColor, setSubtitlesColor, setActiveModal, save }) => (
  <div className="modal relative">
    <h3 className="text-white text-lg mb-4">Subtitles Settings</h3>
    <label className="text-white">Subtitles Position</label>
    <select
      value={subtitlesPosition}
      onChange={(e) => {
        setSubtitlesPosition(e.target.value);
        save("subtitlesPosition", e.target.value);
      }}
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    >
      <option value="center,center">Center - Center</option>
      <option value="center,top">Center - Top</option>
      <option value="center,bottom">Center - Bottom</option>
      <option value="left,bottom">Left - Bottom</option>
      <option value="right,bottom">Right - Bottom</option>
    </select>

    <label className="text-white">Subtitles Color</label>
    <select
      value={subtitlesColor}
      onChange={(e) => {
        setSubtitlesColor(e.target.value);
        save("subtitlesColor", e.target.value);
      }}
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    >
      <option value="#fff">White</option>
      <option value="#FFFF00">Yellow (Default)</option>
      <option value="#f4a261">Orange</option>
      <option value="#e63946">Red</option>
      <option value="#03071e">Black</option>
    </select>
    
    <button
      onClick={() => setActiveModal(null)}
      className="absolute right-0 top-0 cursor-pointer duration-300 text-gray-300 rounded-md p-2 hover:text-red-500"
    >
      <X />
    </button>
  </div>
);

// Content Modal Component
export const ContentModal = ({
  paragraphNumber,
  setParagraphNumber,
  setContentType,
  contentType,
  setActiveModal,
  save,
}) => (
  <div className="modal relative p-4 bg-[#111] rounded-lg">
    <h3 className="text-white text-lg mb-4">Content Settings</h3>

    <label className="text-white">Paragraph Number</label>
    <input
      type="number"
      value={paragraphNumber}
      min="1"
      max="100"
      onChange={(e) => {
        setParagraphNumber(e.target.value);
        save("paragraphNumber", e.target.value);
      }}
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    />


    {/* Content Type as clickable images */}
    <div className="mb-4">
      <label className="text-white mb-2 block">Content Type:</label>
      <div className="flex gap-4">
        {[
          { value: "generative", label: "Generative", img: realistic },
          { value: "stock", label: "Stock", img: stock },
          { value: "cartoon", label: "Cartoon", img: cartoon },
        ].map((option) => (
          <div
            key={option.value}
            onClick={() => {
              setContentType(option.value);
              save("contentType", option.value);
            }}
            className={`cursor-pointer border rounded-md p-2 transition-all duration-300
              ${contentType === option.value ? "border-cyan-500 scale-105" : "border-gray-700 hover:border-gray-400"}`}
          >
            <img src={option.img} alt={option.label} className="w-25 h-25 object-fit mb-1" />
            <p className="text-white text-xs text-center">{option.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Close Button */}
    <button
      onClick={() => setActiveModal(null)}
      className="absolute right-0 top-0 cursor-pointer duration-300 text-gray-300 rounded-md p-2 hover:text-red-500"
    >
      <X />
    </button>
  </div>
);

// Performance Modal Component
export const PerformanceModal = ({ threads, setThreads, setActiveModal, save }) => (
  <div className="modal relative">
    <h3 className="text-white text-lg mb-4">Performance Settings</h3>
    <label className="text-white">Amount of Shorts</label>
    <input
      type="number"
      value={threads}
      min="1"
      max="100"
      onChange={(e) => {
        setThreads(e.target.value);
        save("threads", e.target.value);
      }}
      className="lightborder bg-black text-white p-2 rounded-md w-full mb-4"
    />
    
    <button
      onClick={() => setActiveModal(null)}
      className="absolute right-0 top-0 cursor-pointer duration-300 text-gray-300 rounded-md p-2 hover:text-red-500"
    >
      <X />
    </button>
  </div>
);

// Preferences Modal Component
export const PreferencesModal = ({ youtubeUpload, setYoutubeUpload, useMusic, setUseMusic, reuseChoices, setReuseChoices, setActiveModal, save }) => (
  <div className="modal relative">
    <h3 className="text-white text-lg mb-4">Preferences</h3>
    <label className="flex items-center text-white mb-4">
      <input
        type="checkbox"
        checked={youtubeUpload}
        onChange={(e) => {
          setYoutubeUpload(e.target.checked);
          save("youtubeUploadToggle", e.target.checked);
        }}
        className="mr-2"
      />
      Upload to YouTube
    </label>

    <label className="flex items-center text-white mb-4">
      <input
        type="checkbox"
        checked={useMusic}
        onChange={(e) => {
          setUseMusic(e.target.checked);
          save("useMusicToggle", e.target.checked);
        }}
        className="mr-2"
      />
      Use Music
    </label>

    <label className="flex items-center text-white mb-4">
      <input
        type="checkbox"
        checked={reuseChoices}
        onChange={(e) => {
          setReuseChoices(e.target.checked);
          localStorage.setItem("reuseChoicesToggleValue", e.target.checked);
        }}
        className="mr-2"
      />
      Reuse Choices?
    </label>
    
    <button
      onClick={() => setActiveModal(null)}
      className="absolute right-0 top-0 cursor-pointer duration-300 text-gray-300 rounded-md p-2 hover:text-red-500"
    >
      <X />
    </button>
  </div>
);