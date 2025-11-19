import { useEffect } from "react";
import { webApi } from "../../api/api";
import Customize from "./customize";

export function Preview({isGenerating, generationStatus, setGenerationStatus, taskId, setCurrentStep,setVideoUrl, setTotalVideos, setCurrentVideo,setStepProgress, progress, setIsGenerating, setProgress, currentStep, stepProgress, currentVideo, totalVideos, videoUrl, stylesData, contentType, cancelGeneration}) {
  // Enhanced status message for display
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
  <div className="w-full flex-col h-full rounded-md flex ">
<div className="flex w-full justify-center  lightborderbottom">
      {videoUrl ? (
    <video
      src={videoUrl}
      controls
      autoPlay
      loop
      className="w-[200px] h-[350px] darkbg shadow-lg rounded"
    />
  ) : (
    (() => {
      const selected =
        stylesData.find((style) => style.value === contentType) ||
        stylesData[0];

      const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(selected.src);

      return isVideo ? (
        <video
          src={selected.src}
          autoPlay
          loop
          muted
          className="aspect-[9/16] h-[500px] object-cover rounded-sm shadow-lg"
        />
      ) : (
        <img
          src={selected.src}
          alt="Default"
          className="aspect-[9/16] h-[500px] object-cover rounded-sm shadow-lg"
        />
      );
    })()
  )}
</div>
<div>
   <h1 className="text-white text-lg p-4 lightborderbottom font-semibold" >Customize</h1>
 
    <Customize defaultImage={stylesData.find((s) => s.value === contentType)?.src} />
</div>
</div>

          )}
        </div>
      </div>);
}