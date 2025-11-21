import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Video,
  Film,
  User,
  Home,
  UserStar,
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

  // top menu items
  const menuItems = [
    { id: "Generate", label: "Generate", icon: Video, path: "/youtube" },
    { id: "Saved", label: "Saved", icon: Film, path: "Fv" },
    { id: "Home", label: "Home", icon: Home, path: "/" },
    { id: "Avatar", label: "Avatar", icon: UserStar, path: "/youtube/avatar" },
  ];

  const profileItem = { id: "Profile", label: "Profile", icon: User, path: "/profile" };

  return (
    <>
      <div
        className={`sticky top-0 left-0 h-[100vh] border-r lightborder z-50 bg-[#1111]/80 shadow-lg backdrop-blur-sm
        transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? "w-72" : "w-16 items-center justify-start"}`}
      >

        <div className="flex items-center justify-between w-full p-4">
          {isOpen && <div className="text-white font-bold text-lg">NEPWOOP</div>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 rounded hover:bg-gray-900/50 transition-colors"
          >
            {isOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
          </button>
        </div>

        {/* Menu Items (scrollable area) */}
        <div className="flex-1 w-full p-4 space-y-2">
          {menuItems.map(({ id, label, icon: Icon, path }) => (
            <div
              key={id}
              onClick={() => {
                setActiveItem(id);
                navigate(path);
                setIsOpen(false);
              }}
              className={`flex items-center cursor-pointer ${isOpen ? "px-3 py-4" : "px-0 py-4"} rounded-lg transition-colors
                ${activeItem === id ? "text-white" : "text-gray-400 hover:text-white"}`}
            >
              <Icon
                size={20}
                className="mr-3 text-white drop-shadow-[0_0_4px_rgba(0,255,255,0.3)] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.6)]"
              />
              {isOpen && <span className="font-medium">{label}</span>}
            </div>
          ))}
        </div>

        <div
          onClick={() => {
            setActiveItem(profileItem.id);
            navigate(profileItem.path);
            setIsOpen(false);
          }}
          className={`flex w-full   items-center cursor-pointer ${isOpen ? "px-4 py-4" : "px-0 py-4 ml-2 justify-center"} 
           border-cyan-500/30 text-gray-400 hover:text-white transition-colors`}
        >
          <profileItem.icon
            size={20}
            className="mr-3 text-white drop-shadow-[0_0_4px_rgba(0,255,255,0.3)]"
          />
          {isOpen && <span className="font-medium">{profileItem.label}</span>}
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarMenu;
