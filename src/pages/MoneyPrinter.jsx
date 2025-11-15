import { CircleFadingPlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { VideoPromptInput } from "../components/YoutubeModels/youtubemodal";
import SongList from "../components/YoutubeModels/youtubepages/bgmusic";
import VoiceList from "../components/YoutubeModels/youtubepages/voice";
import { webApi } from "../api/api";
import LanguageSelect from "../components/YoutubeModels/youtubepages/language";
import stylesData from '../json/shorts.json';

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
  const [reuseChoices, setReuseChoices] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [useCustomPrompt, setUseCustomPrompt] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Script");
  const tabs = ["Script", "Voice", "Music", "Caption","Language"];
  const [songs, setSongs] = useState([]); 
  const [songsLoading, setSongsLoading] = useState(true);
  const [songsError, setSongsError] = useState(null);
  
  // Enhanced status tracking state
  const [taskId, setTaskId] = useState(null);
  const [generationStatus, setGenerationStatus] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [stepProgress, setStepProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  // Load from localStorage
  useEffect(() => {
    const reuse = localStorage.getItem("reuseChoicesToggleValue");
    if (reuse === "true") {
      setReuseChoices(true);
      const fields = {
        videoSubject: setVideoSubject,
        aiModel: setAiModel,
        voiceName: setVoiceName,
        language: setLanguage,
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

  // Enhanced status polling
  useEffect(() => {
    let intervalId;
    
    if (taskId && isGenerating) {
      const checkStatus = async () => {
        try {
          const res = await fetch(`${webApi}/generate/status/${taskId}`);
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log('Status update:', data); // Debug log
          
          setGenerationStatus(data.status);
          
          if (data.status === 'processing' || data.status === 'started') {
            // Update all progress information
            if (data.progress !== undefined) setProgress(data.progress);
            if (data.current_video !== undefined) setCurrentVideo(data.current_video);
            if (data.total_videos !== undefined) setTotalVideos(data.total_videos);
            if (data.current_step) setCurrentStep(data.current_step);
            if (data.step_progress !== undefined) setStepProgress(data.step_progress);
            
            // Continue polling
          } else if (data.status === 'completed') {
            // Generation finished successfully
            setIsGenerating(false);
            setProgress(100);
            setStepProgress(100);
            setCurrentStep("Completed");
            
            // Fetch the list of generated videos
            try {
              const videosRes = await fetch(`${webApi}/api/videos`);
              if (videosRes.ok) {
                const videosData = await videosRes.json();
                
                if (videosData.videos && videosData.videos.length > 0) {
                  // Show the first video or let user choose
                  const firstVideo = videosData.videos[0];
                  setVideoUrl(`${webApi}/video/${firstVideo}`);
                }
              }
            } catch (videoErr) {
              console.error("Error fetching videos:", videoErr);
            }
            
            alert(data.message || "Video generation completed!");
            clearInterval(intervalId);
          } else if (data.status === 'error') {
            // Generation failed
            setIsGenerating(false);
            setErrorMessage(data.message || "Generation failed");
            alert(data.message || "Generation failed");
            clearInterval(intervalId);
          } else if (data.status === 'cancelled') {
            setIsGenerating(false);
            setGenerationStatus('cancelled');
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Error checking status:", err);
          // Don't stop polling on network errors - retry next interval
        }
      };

      // Check status immediately and then every 3 seconds
      checkStatus();
      intervalId = setInterval(checkStatus, 3000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [taskId, isGenerating]);

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

  const handleInput = (e, i) => {
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
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

  // Enhanced status message for display
  const getStatusMessage = () => {
    switch (generationStatus) {
      case 'starting':
        return "Starting video generation...";
      case 'processing':
      case 'started':
        if (currentStep) {
          return `${currentStep}...`;
        }
        if (currentVideo > 0 && totalVideos > 0) {
          return `Generating video ${currentVideo} of ${totalVideos}...`;
        }
        return "Processing...";
      case 'completed':
        return "Generation completed!";
      case 'error':
        return errorMessage || "Generation failed";
      case 'cancelled':
        return "Generation cancelled";
      default:
        return "Processing...";
    }
  };

  // Get detailed progress information
  const getDetailedProgress = () => {
    if (currentStep && stepProgress > 0) {
      return `${stepProgress}%`;
    }
    return `${progress}%`;
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
              contentType={contentType}
              cancelGeneration={cancelGeneration}
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

      <div className={`inset-0 w-full flex flex-1 flex-col lightborder-right -top-20 z-40 transition-opacity duration-700`}>
        <div className="lightborderbottom lightbordertop">
          <h1 className="text-sm p-2 font-semibold text-gray-300">Preview</h1>
        </div>

        <div className="flex flex-col w-full h-full items-center justify-center gap-4 animate-fadeInDelay">
          {isGenerating ? (
            <>
              {/* Enhanced Loading Animation with Detailed Status */}
              <div className="relative flex justify-center items-center">
                <div className="relative w-[200px] h-[350px] rounded-md bg-black overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-600/40 to-transparent animate-shimmer" />
                  <div className="absolute -inset-2 rounded-md pointer-events-none">
                    <div className="w-full h-full rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-white opacity-40 blur-3xl animate-[spin_10s_linear_infinite]" />
                  </div>
                </div>
              </div>
              
              {/* Progress Information */}
              <div className="w-80 flex flex-col items-center gap-3">
                {/* Main Progress Bar */}
                <div className="w-full">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{getStatusMessage()}</span>
                    <span>{getDetailedProgress()}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-700 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-blue-500 transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Step Progress (if available) */}
                {currentStep && stepProgress > 0 && stepProgress < 100 && (
                  <div className="w-full">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Current step: {currentStep}</span>
                      <span>{stepProgress}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-gray-800 relative overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-green-500 transition-all duration-300 ease-out"
                        style={{ width: `${stepProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Video Count */}
                {currentVideo > 0 && totalVideos > 0 && (
                  <div className="text-xs text-gray-500">
                    Video {currentVideo} of {totalVideos}
                  </div>
                )}
              </div>
              
              <button 
                onClick={cancelGeneration}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-3 py-1 border border-red-400/30 rounded hover:bg-red-400/10"
              >
                Cancel Generation
              </button>
            </>
          ) : (
            <div className="w-full h-full rounded-md flex items-center justify-center">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-[200px] h-[350px] darkbg shadow-lg rounded"
                />
              ) : (
              <img
    src={stylesData.find(style => style.value === contentType)?.src || stylesData[0].src}
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

    
    </div>
  );
}