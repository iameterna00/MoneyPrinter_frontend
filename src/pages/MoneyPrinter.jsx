import { CircleFadingPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { VideoPromptInput } from "../components/YoutubeModels/videoInput";
import SongList from "../components/YoutubeModels/youtubepages/bgmusic";
import VoiceList from "../components/YoutubeModels/youtubepages/voice";
import { webApi } from "../api/api";
import LanguageSelect from "../components/YoutubeModels/youtubepages/language";
import shortsData  from '../json/shorts.json';
import ugcData  from '../json/ugc.json';
import aiCloneData  from '../json/aiclone.json';
import { ExtraPrompts } from "../components/functionalities/extraprompts";
import { Preview } from "../components/functionalities/preview";
const stylesData = [...shortsData, ...ugcData, ...aiCloneData];
export default function MoneyPrinter() {
  const [videoSubject, setVideoSubject] = useState("");
  const [aiModel, setAiModel] = useState("deepseek-chat");
  const [voice, setVoice] = useState([]);
  const [voiceName, setVoiceName] = useState([]);
  const [language, setLanguage] = useState("en");
  const [songsName, setSongsName] = useState("");
  const [contentType, setContentType] = useState("generative");
  const [paragraphNumber, setParagraphNumber] = useState(1);
  const [threads, setThreads] = useState(1);
  const [subtitlesPosition, setSubtitlesPosition] = useState("center,center");
  const [subtitlesColor, setSubtitlesColor] = useState("#fff");
  const [customPrompts, setCustomPrompts] = useState([""]); 
  const [youtubeUpload, setYoutubeUpload] = useState(false);
  const [useMusic, setUseMusic] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [useCustomPrompt, setUseCustomPrompt] = useState(true);
  const [activeTab, setActiveTab] = useState("Script");
  const tabs = ["Script", "Voice", "Music", "Caption","Language"];
  const [songs, setSongs] = useState([]); 
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState(null);
   const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Enhanced status tracking state
  const [taskId, setTaskId] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [stepProgress, setStepProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Shorts");


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
    // Reset all states
    setVideoUrl("");
    setIsGenerating(true);
    setGenerationStatus("starting");
    setProgress(0);
    setCurrentVideo(0);
    setTotalVideos(0);
    setCurrentStep("Initializing...");
    setStepProgress(0);
    setErrorMessage("");
    
    try {
      const payload = {
        videoSubject,
        aiModel,
        voiceName,
        language,
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

      console.log('Sending payload:', payload); // Debug log

      const res = await fetch(`${webApi}/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Accept: "application/json" 
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Generation response:', data); // Debug log
      
      if (data.task_id) {
        setTaskId(data.task_id);
        // Status polling will be handled by the useEffect above
      } else {
        // Fallback for old API
        setIsGenerating(false);
        alert(data.message || "No task ID received");
      }
    } catch (err) {
      console.error('Generation error:', err);
      setIsGenerating(false);
      setErrorMessage(err.message);
      alert("An error occurred. Please try again later.");
    }
  };

  const cancelGeneration = async () => {
    try {
      const res = await fetch(`${webApi}/generate/cancel/${taskId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsGenerating(false);
        setGenerationStatus("cancelled");
        alert(data.message || "Generation cancelled");
      } else {
        throw new Error("Failed to cancel generation");
      }
    } catch (err) {
      console.error(err);
      // Force stop anyway
      setIsGenerating(false);
      setGenerationStatus("cancelled");
      alert("Generation stopped");
    }
  };




  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row relative">
      {/* Main controls */}
      <div className={`transition-all flex-1 lightborder-right p-4 duration-700 z-50 ease-in-out`}>
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                text-gray-400 cursor-pointer font-medium text-sm m-2 transition-colors duration-200
                ${activeTab === tab ? "text-white border-white border-b" : "hover:text-white"}
              `}
            >
              {tab}
            </div>
          ))}
        </div>
        
        <div className={`w-full flex flex-col gap-2`}>
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
              cancelGeneration={cancelGeneration}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
  
            />
          )}

          {activeTab === "Voice" && (
            <VoiceList
              onSelectVoice={(filename) => {
                setVoiceName(filename);
                save("voiceName", filename);
              }}
              voiceName={voiceName}
              Voice={voice}
            />
          )}

          {activeTab === "Music" && (
            <SongList 
              onSelectSong={(filename) => {
                setSongsName(filename);
                save("songsName", filename);
              }}
              songName={songsName}
              songs={songs}
              loading={songsLoading}
              error={songsError}
            />
          )}
          
          {activeTab === "Language" && (
        <LanguageSelect 
          languages={language}
          setLanguage={setLanguage}
        />
          )}
        </div>
      </div>

    {/* PREVIEW */}
<Preview
  generationStatus={generationStatus}
  setGenerationStatus={setGenerationStatus}
  isGenerating={isGenerating}
  taskId={taskId}
  progress={progress}
  currentStep={currentStep}
  setCurrentStep={setCurrentStep}
  setVideoUrl={setVideoUrl}
  setTotalVideos={setTotalVideos}
  setCurrentVideo={setCurrentVideo}
  setStepProgress={setStepProgress}
  setIsGenerating={setIsGenerating}
  setProgress={setProgress}
  stepProgress={stepProgress}
  currentVideo={currentVideo}
  totalVideos={totalVideos}
  videoUrl={videoUrl}
  stylesData={stylesData}
  contentType={contentType}
  selectedcategory={selectedCategory}
  cancelGeneration={cancelGeneration}
/>



    <ExtraPrompts drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} customPrompts={customPrompts} setCustomPrompts={setCustomPrompts} />

    
    </div>
  );
}