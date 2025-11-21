import { CircleFadingPlus, Scroll, ArrowUp, CircleStop } from "lucide-react";
import {PluginsModals} from '../YoutubeModels/youtubepages/pluginmodal';
import stylesData from '../../json/shorts.json';
import stylesData1 from '../../json/ugc.json';
import stylesData2 from '../../json/aiclone.json';
import { useEffect, useState } from "react";

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
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Shorts");
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [styles, setStyles] = useState([]);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  useEffect(() => {
    if (selectedCategory === "Shorts") setStyles(stylesData);
    if (selectedCategory === "AI Clone") setStyles(stylesData2);
  }, [selectedCategory]);

  // Handle when a style is selected from the modal
  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setContentType(style.value);
    save("contentType", style.value);
    save("selectedStyle", style);
  };

  // Handle category change from modal
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedStyle(null);
    setContentType("");
    save("contentType", "");
  };

  // Handle style click from the grid
  const handleStyleClick = (option) => {
    setSelectedStyle(option);
    setContentType(option.value);
    save("contentType", option.value);
    save("selectedStyle", option);
  };

  // Handle video hover
  const handleVideoHover = (option, isHovering) => {
    if (option.type === "video") {
      if (isHovering) {
        setHoveredVideo(option.value);
      } else {
        setHoveredVideo(null);
      }
    }
  };

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

        <PluginsModals 
          onCategoryChange={handleCategoryChange}
          onStyleSelect={handleStyleSelect}
          selectedCategory={selectedCategory}
        />

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
        <h1 className="text-white mb-2 text-md font-semibold block">Templates</h1>

        <div className="grid grid-cols-4 gap-4">
          {styles.map((option) => {
            const isSelected = selectedStyle?.value === option.value;
            const isVideoHovered = hoveredVideo === option.value;

            return (
              <div
                key={option.value}
                onClick={() => handleStyleClick(option)}
                onMouseEnter={() => handleVideoHover(option, true)}
                onMouseLeave={() => handleVideoHover(option, false)}
                className="cursor-pointer rounded-md hover:scale-102 transition-all duration-400 relative"
              >
                {/* Show video if type is video and it's hovered or selected */}
                {option.type === "video" ? (
                  <>
                    <video
                      src={option.src}
                      className={`w-full aspect-[9/16] object-cover mb-1 rounded-md border-2 transition-all duration-300 ${
                        isSelected ? "border-cyan-500" : "border-transparent"
                      }`}
                      muted
                      loop
                      playsInline
                      controls={false}
                      autoPlay={isSelected || isVideoHovered}
                    />
                    {/* Video indicator */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      ▶
                    </div>
                  </>
                ) : (
                  /* Show image for image type */
                  <img
                    src={option.src}
                    alt={option.label}
                    className={`w-full aspect-[9/16] object-cover mb-1 rounded-md border-2 transition-all duration-300 ${
                      isSelected ? "border-cyan-500" : "border-transparent"
                    }`}
                  />
                )}
              
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};