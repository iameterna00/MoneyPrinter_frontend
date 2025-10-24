import {CircleFadingPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AIModal, ContentModal, PerformanceModal, PreferencesModal, SubtitlesModal, VideoPromptInput, VoiceSelector } from "../components/YoutubeModels/youtubemodal";
import SidebarMenu from "../components/YoutubeModels/sidebar";
import silhouette from '../assets/darkimg.jpg'
import cartoon from '../assets/cartoon.png'
import realistic from '../assets/realistic.png'
import SongList from "../components/YoutubeModels/bgmusic";
import VoiceList from "../components/YoutubeModels/voice";
import { webApi } from "../api/api";

export default function MoneyPrinter() {
  const [videoSubject, setVideoSubject] = useState("");
  const [aiModel, setAiModel] = useState("deepseek-chat");
  const [voice, setVoice] = useState([]);
  const [voiceName, setVoiceName] = useState([]);
  const [songsName, setSongsName] = useState("");
  const [contentType, setContentType] = useState("generative");
  const [paragraphNumber, setParagraphNumber] = useState(1);
  const [threads, setThreads] = useState(1);
  const [subtitlesPosition, setSubtitlesPosition] = useState("center,center");
  const [subtitlesColor, setSubtitlesColor] = useState("#fff");
  const [customPrompts, setCustomPrompts] = useState([""]); 
  const [youtubeUpload, setYoutubeUpload] = useState(false);
  const [useMusic, setUseMusic] = useState(false);
  const [reuseChoices, setReuseChoices] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [useCustomPrompt, setUseCustomPrompt] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Script");
  const tabs = ["Script", "Voice", "Music", "Caption"];
  const [songs, setSongs] = useState([]); 
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState(null);


  // Load from localStorage
  useEffect(() => {
    const reuse = localStorage.getItem("reuseChoicesToggleValue");
    if (reuse === "true") {
      setReuseChoices(true);
      const fields = {
        videoSubject: setVideoSubject,
        aiModel: setAiModel,
        voiceName: setVoiceName,
        songsName: setSongsName,
        paragraphNumber: setParagraphNumber,
        contentType: setContentType,
        threads: setThreads,
        subtitlesPosition: setSubtitlesPosition,
        subtitlesColor: setSubtitlesColor,
      };
      Object.entries(fields).forEach(([key, setter]) => {
        const stored = localStorage.getItem(`${key}Value`);
        if (stored !== null) setter(stored);
      });
      setYoutubeUpload(localStorage.getItem("youtubeUploadToggleValue") === "true");
      setUseMusic(localStorage.getItem("useMusicToggleValue") === "true");
    }
  }, []);

  const save = (key, value) => localStorage.setItem(`${key}Value`, value);

const updateCustomPrompt = (index, value) => {
  const newPrompts = [...customPrompts];   
  newPrompts[index] = value;              
  setCustomPrompts(newPrompts);        
};

useEffect(() => {
  const fetchVoice = async () => {
    try {
      const res = await fetch(`${webApi}/voice`);
      if (!res.ok) throw new Error("Failed to fetch voice");
      const data = await res.json();
      setVoice(data.voice || []);
      console.log('Successfully fetched voice', data.voice);
    } catch (err) {
      console.log('Error fetching voice', err);
    }
  };

  fetchVoice();
}, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`${webApi}/songs`);
        if (!res.ok) throw new Error("Failed to fetch songs");
        const data = await res.json();
        setSongs(data.songs || []);
      } catch (err) {
        setSongsError(err.message);
      } finally {
        setSongsLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const generateVideo = async () => {
    setVideoUrl("");
    setIsGenerating(true);
    try {
      const payload = {
        videoSubject,
        aiModel,
        voiceName,
        paragraphNumber,
        contentType,
        automateYoutubeUpload: youtubeUpload,
        useMusic,
        songsName,
        threads,
        subtitlesPosition,
        customPrompts,
        color: subtitlesColor,
      };

      const res = await fetch(`${webApi}/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setVideoUrl(`${webApi}/video/output.mp4`);
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

  const cancelGeneration = async () => {
    try {
      const res = await fetch(`${webApi}/api/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };
  const handleInput = (e, i) => {
  e.target.style.height = "auto"; // reset height
  e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px"; // 200px ≈ h-50
  updateCustomPrompt(i, e.target.value);
};
const removeCustomPrompt = (index) => {
  const newPrompts = [...customPrompts];
  newPrompts.splice(index, 1);
  setCustomPrompts(newPrompts);
};

const addCustomPrompt = () => {
  setCustomPrompts([...customPrompts, ""]);
};


  return (
    <div className="min-h-screen  w-full flex flex-col md:flex-row  relative">
      {/* Main controls */}
      <div className={`transition-all flex-1  lightborder-right p-4 duration-700 z-50 ease-in-out `}>
     <div className="flex gap-6">
      {tabs.map((tab) => (
        <div
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`
            text-gray-400 cursor-pointer font-medium text-sm  m-2 transition-colors duration-200
            ${activeTab === tab ? "text-white border-white border-b" : "hover:text-white"}
          `}
        >
          {tab}
        </div>
      ))}
    </div>
        <div className={` w-full flex flex-col gap-2`}>
          {activeTab === "Script" && (
    <VideoPromptInput
      useCustomPrompt={useCustomPrompt}
      setUseCustomPrompt={setUseCustomPrompt}
      customPrompts={customPrompts}
      updateCustomPrompt={updateCustomPrompt}
      setDrawerOpen={setDrawerOpen}
      videoSubject={videoSubject}
      setVideoSubject={setVideoSubject}
      save={save}
      isGenerating={isGenerating}
      generateVideo={generateVideo}
      setContentType={setContentType}
      contentType={contentType}
      cancelGeneration={cancelGeneration}
    />
  )}

{activeTab === "Voice" && (
  <VoiceList
    onSelectVoice={(filename) => {
      setVoiceName(filename); // store selected voice
      save("voiceName", filename);
    }}
    voiceName={voiceName} // single selected voice string
    Voice={voice} // array of fetched voices
  />
)}

 {activeTab === "Music" && (
            <SongList 
              onSelectSong={(filename) => {
                setSongsName(filename);
                save("songsName", filename);
              }}
              songName={songsName}
              songs={songs} // Pass songs as prop
              loading={songsLoading}
              error={songsError}
            />
          )}


          {/* Option buttons */}
          {/* <div className={`grid ${isGenerating ? 'grid-cols-6' : 'grid-cols-3'} gap-3`}>
            <button onClick={() => setActiveModal("ai")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <BrainCircuit size={15} /> {!isGenerating && 'AI Models'}
              </div>
            </button>
            <button onClick={() => setActiveModal("voice")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <MicVocal size={15} /> {!isGenerating && 'Voice'}
              </div>
            </button>
            <button onClick={() => setActiveModal("subtitles")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <ClosedCaption size={15} /> {!isGenerating && 'Subtitles'}
              </div>
            </button>
            <button onClick={() => setActiveModal("content")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <Clapperboard size={15} /> {!isGenerating && 'Content'}
              </div>
            </button>
            <button onClick={() => setActiveModal("performance")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <SlidersHorizontal size={15} /> {!isGenerating && 'Performance'}
              </div>
            </button>
            <button onClick={() => setActiveModal("preferences")} className="text-white">
              <div className="flex items-center justify-center duration-300 hover:shadow-[0_0_10px_1px_rgba(255,255,255,0.1)] lightborder p-3 cursor-pointer rounded-[30px] gap-2 text-[12px]">
                <Cog size={15} /> {!isGenerating && 'Preference'}
              </div>
            </button>
          </div> */}
        </div>
      </div>

<div
  className={`inset-0 w-full flex flex-1 flex-col lightborder-right  -top-20 z-40 
    transition-opacity duration-700`}
>
  {/* Sample Image heading on top */}
 <div className="lightborderbottom lightbordertop ">
   <h1 className="text-sm  p-2 font-semibold text-gray-300">Preview</h1>
 </div>

  <div className="flex flex-col w-full h-full items-center justify-center gap-4 animate-fadeInDelay">
    {isGenerating ? (
      <>
        {/* Loading Animation */}
        <div className="relative flex justify-center items-center">
          <div className="relative w-[200px] h-[350px] rounded-md bg-black overflow-hidden">
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-600/40 to-transparent" />
            <div className="absolute -inset-2 rounded-md pointer-events-none">
              <div className="w-full h-full rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-white opacity-40 blur-3xl animate-[spin_10s_linear_infinite]" />
            </div>
          </div>
        </div>
        <div className="w-40 h-1 rounded-full bg-gray-700 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-gradient-to-r from-transparent via-gray-500 to-transparent"></div>
        </div>
        <p className="text-xs text-gray-400 animate-pulse">Generating your short...</p>
      </>
    ) : (
      <div className="w-full h-full rounded-md flex items-center justify-center">
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            loop
            className="w-[200px] h-[350px] darkbg shadow-lg"
          />
        ) : (
          <img
            src={
              contentType === "generative"
                ? realistic
                : contentType === "silhouette"
                ? silhouette
                : cartoon
            }
            alt="Default"
            className="aspect-[9/16] h-[500px] object-cover rounded-sm shadow-lg"
          />
        )}
      </div>
    )}
  </div>
</div>


{/* Sliding Drawer */}
<div
  className={`fixed top-0 right-0 h-full w-120 bg-[#000]/60 lightborder backdrop-blur-3xl  z-50 transform transition-transform duration-500 ${
    drawerOpen ? "translate-x-0" : "translate-x-full"
  }`}
>
  <div className="flex justify-between items-center p-4 border-b border-gray-700">
    <h2 className="text-white text-sm">Additional Scripts</h2>
    <button
      onClick={() => setDrawerOpen(false)}
      className="text-gray-400 hover:text-white"
    >
      ✕
    </button>
  </div>

<div className="flex flex-col gap-4 p-4">
  {customPrompts.map((prompt, i) => (
    <div key={i} className="relative">
      <textarea
        rows={3}
        value={prompt}
        placeholder={`Video Script ${i + 1}`}
        onChange={(e) => handleInput(e, i)}
        className="lightborder p-3 rounded-[15px] focus:outline-none bg-[#0f0f0f] text-[12px] text-gray-300 placeholder-gray-400 duration-300 w-full resize-none scrollbar-hide"
      />
      {customPrompts.length > 1 && (
        <button
          onClick={() => removeCustomPrompt(i)}
          className="absolute top-2 cursor-pointer  right-2 text-gray-400 hover:text-white text-xs"
        >
          ✕
        </button>
      )}
    </div>
  ))}
<div className="w-full justify-center items-center flex">
    <button
    onClick={addCustomPrompt}
    className="lightborder p-2 px-4 flex gap-2 started rounded-[15px] text-gray-400 hover:text-white text-xs"
  >
     <CircleFadingPlus size={14} /> Add Another Script
  </button>
</div>
</div>
</div>


          {/* Modal Overlay */}
{activeModal && (
  <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
    <div className="bg-[#111] shadow-[0_0_150px_20px_rgba(255,255,255,0.15)]  p-6 rounded-lg w-11/12 max-w-md max-h-[80vh] overflow-y-auto">

   
      {activeModal === "subtitles" && (
        <SubtitlesModal
          subtitlesPosition={subtitlesPosition}
          setSubtitlesPosition={setSubtitlesPosition}
          subtitlesColor={subtitlesColor}
          setSubtitlesColor={setSubtitlesColor}
          save={save}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal === "content" && (
        <ContentModal
          paragraphNumber={paragraphNumber}
          setParagraphNumber={setParagraphNumber}
          setContentType={setContentType}
          contentType={contentType}
          save={save}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal === "performance" && (
        <PerformanceModal
          threads={threads}
          setThreads={setThreads}
          save={save}
          setActiveModal={setActiveModal}
        />
      )}

      {activeModal === "preferences" && (
        <PreferencesModal
          youtubeUpload={youtubeUpload}
          setYoutubeUpload={setYoutubeUpload}
          useMusic={useMusic}
          setUseMusic={setUseMusic}
          reuseChoices={reuseChoices}
          setReuseChoices={setReuseChoices}
          save={save}
          setActiveModal={setActiveModal}
        />
      )}

    </div>
  </div>
)}

    </div>
  );
}