import { CircleFadingPlus } from "lucide-react";
import { useState } from "react";

export function ExtraPrompts({customPrompts, setCustomPrompts, drawerOpen, setDrawerOpen}) {
   
  const updateCustomPrompt = (index, value) => {
    const newPrompts = [...customPrompts];   
    newPrompts[index] = value;              
    setCustomPrompts(newPrompts);        
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
  return (<>
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
      </div></>);
}