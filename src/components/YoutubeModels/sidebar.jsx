import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Video,
  Film,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("Generate");
  const navigate = useNavigate();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const menuItems = [
    { id: "Generate", label: "Generate", icon: Video, path: "/youtube" },
    { id: "Saved", label: "Saved", icon: Film, path: "/youtube/saved" },
    { id: "Profile", label: "Profile", icon: User, path: "/profile" },
    { id: "Settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "Logout", label: "Logout", icon: LogOut, path: "/logout" },
  ];

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`sticky border-r lightborder  top-0 left-0 h-[100vh] z-50 bg-[#1111] shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-72" : "w-16 items-center justify-start"}`}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between w-full p-4 ">
          {isOpen && <div className="text-white font-bold text-lg">NEPWOOP</div>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-gray-900/50 transition-colors"
          >
            {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto w-full p-4 space-y-2">
          {menuItems.map(({ id, label, icon: Icon, path }) => (
            <div
              key={id}
              onClick={() => {
                setActiveItem(id);
                navigate(path);
                setIsOpen(false);
              }}
              className={`flex items-center  cursor-pointer ${isOpen ? 'px-3 py-4':'px-0 py-4'}  rounded-lg transition-colors
                ${activeItem === id
                  ? " text-white"
                  : "text-gray-400 hover:text-white"
                }`}
            >
            <Icon
              size={20}
              className="
                mr-3 text-white 
                drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]
                transition-all duration-200
                hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]
              "
            />

              {isOpen && <span className="font-medium">{label}</span>}
            </div>
          ))}
        </div>

        {/* Footer */}
        {isOpen && (
          <div className="p-4 border-t border-cyan-500/30 text-center">
            <div className="text-xs text-cyan-400/60 font-light tracking-wide">
              Sidebar Footer
            </div>
            <div className="flex justify-center mt-2">
              <div className="h-1 w-12 bg-gradient-to-r from-gray-500 to-blue-500 rounded-full"></div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay (optional if you want click outside to close) */}
      {isOpen && (
        <div
          className="fixed inset-0bg-opacity-60 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarMenu;
