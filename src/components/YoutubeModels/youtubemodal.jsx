import React, { useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react'; 
import silhouette from '../../assets/darkimg.jpg'
import cartoon from '../../assets/cartoon.png'
import silhouette_3d from '../../assets/silhouette_3d.jpg'
import realistic from '../../assets/realistic.png'
import { CircleFadingPlus, Scroll, ArrowUp, CircleStop } from "lucide-react";
import { IoExtensionPuzzle } from 'react-icons/io5';
import {PluginsModals} from '../YoutubeModels/youtubepages/pluginmodal';

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

          <PluginsModals />

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
    { value: "generative", label: "Cinematic", img: realistic },
    { value: "silhouette", label: "Silhouette", img: silhouette },
    { value: "cartoon", label: "Dark Cartoon", img: cartoon },
    { value: "silhouette_3d", label: "Dark 3D", img: silhouette_3d },
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

