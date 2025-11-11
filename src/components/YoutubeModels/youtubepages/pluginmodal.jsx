import React, { useState, useRef, useEffect } from "react";
import { IoExtensionPuzzle } from "react-icons/io5";
import { Volume2, VolumeX, X } from "lucide-react";
import Lenis from "@studio-freight/lenis";
import cartoon from '../../../assets/cartoon.png';
import silhouette_3d from '../../../assets/silhouette_3d.jpg';
import realistic from '../../../assets/realistic.png';
import silhouette from '../../../assets/darkimg.jpg';
import ugc from '../../../assets/ugc_1.mp4';
import glass_right from '../../../assets/glass_right.mp4';
import cover from '../../../assets/cover.png';

export function PluginsModals() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeTab, setActiveTab] = useState("Shorts");
  const [scrollY, setScrollY] = useState(0);
  const [globalMuted, setGlobalMuted] = useState(true); // Global mute state
  const [hoveredVideo, setHoveredVideo] = useState(null); // Track hovered video
  const contentRef = useRef();
  const lenisRef = useRef();
  const scrollPositionRef = useRef(0);
  const hoverTimeoutRef = useRef({});
  const videoRefs = useRef({});

  const images = {
    Shorts: [
      { type: "image", src: silhouette },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette_3d },
      { type: "image", src: realistic },
      { type: "image", src: silhouette },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette_3d },
      { type: "image", src: realistic },
    ],
    UGC: [
      { type: "video", src: ugc, id: "ugc-1" },
      { type: "video", src: glass_right, id: "ugc-2" },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette_3d },
      { type: "image", src: realistic },
      { type: "image", src: silhouette },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette_3d },
    ],
    "AI Clone": [
      { type: "image", src: silhouette },
      { type: "image", src: cartoon },
      { type: "image", src: silhouette_3d },
      { type: "image", src: realistic },
    ],
  };

  // Apply global mute to all videos
  useEffect(() => {
    Object.values(videoRefs.current).forEach(video => {
      if (video) {
        video.muted = globalMuted;
      }
    });
  }, [globalMuted]);

  // Lenis smooth scroll setup
  useEffect(() => {
    if (!isOpen) return;

    const lenis = new Lenis({
      wrapper: contentRef.current,
      content: contentRef.current,
      smooth: true,
      duration: 1.2,
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    const handleScroll = ({ scroll }) => {
      setScrollY(scroll);
      scrollPositionRef.current = scroll;
    };

    lenis.on('scroll', handleScroll);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.off('scroll', handleScroll);
      lenis.destroy();
    };
  }, [isOpen]);

  const handleTabChange = (tab) => {
    const currentScroll = scrollPositionRef.current;
    setActiveTab(tab);
    
    setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(currentScroll);
      }
    }, 50);
  };

  const handleVideoHover = (videoId, isHovering) => {
    // Clear existing timeout
    if (hoverTimeoutRef.current[videoId]) {
      clearTimeout(hoverTimeoutRef.current[videoId]);
    }

    if (isHovering) {
      setHoveredVideo(videoId);
      // Set timeout to play after 2 seconds
      hoverTimeoutRef.current[videoId] = setTimeout(() => {
        const videoElement = videoRefs.current[videoId];
        if (videoElement) {
          videoElement.play().catch(error => {
            console.log("Video play failed:", error);
          });
        }
      }, 1000);
    } else {
      setHoveredVideo(null);
      // Stop immediately on mouse leave
      const videoElement = videoRefs.current[videoId];
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0; // Reset to beginning
      }
    }
  };

  const toggleGlobalAudio = (e) => {
    e.stopPropagation();
    setGlobalMuted(!globalMuted);
  };

  const coverScale = Math.max(1 - scrollY / 1200, 0.85);
  const tabsSticky = scrollY >= 220; 

  const handleClose = () => {
    setIsClosing(true);
    
    // Wait for close animation to complete before updating state
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
      setScrollY(0);
      scrollPositionRef.current = 0;
      setGlobalMuted(true); // Reset to muted when closing
      setHoveredVideo(null);
      
      // Clear all hover timeouts and pause all videos
      Object.values(hoverTimeoutRef.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      
      Object.values(videoRefs.current).forEach(video => {
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      });
      
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0);
      }
    }, 300);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setScrollY(0);
    scrollPositionRef.current = 0;
  };

  return (
    <>
      {/* Trigger button */}
      <div
        onClick={handleOpen}
        className="absolute p-[2px] rounded-xl flex gap-2 bottom-4 left-4 cursor-pointer text-gray-300 hover:text-white text-[12px] items-center justify-center duration-500 group"
        style={{
          background: 'linear-gradient(90deg, #00FFFF, #FF00FF, #00FFFF)',
          backgroundSize: '200% 200%',
          animation: 'none'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.animation = 'gradientRotate 2s linear infinite';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.animation = 'none';
        }}
      >
        <div className="bg-black rounded-lg px-3 py-1 flex items-center gap-2 transition-all duration-300 group-hover:bg-gray-900">
          <IoExtensionPuzzle size={14} />
          <span className="">{activeTab}</span>
        </div>

        <style>
          {`
            @keyframes gradientRotate {
              0% {
                background-position: 0% 50%;
              }
              100% {
                background-position: 200% 50%;
              }
            }
          `}
        </style>
      </div>

      {/* Overlay with opening and closing animations */}
      {(isOpen || isClosing) && (
        <div 
          className={`fixed inset-0 backdrop-blur-sm flex justify-center z-50 transition-all duration-300 ${
            isClosing ? 'bg-opacity-0' : 'bg-opacity-100'
          }`}
          onClick={handleClose}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className={`mt-[10vh] w-11/12 max-w-6xl h-[90vh] bg-[#1c1c1c] rounded-2xl shadow-lg relative flex flex-col overflow-hidden transform transition-all duration-300 ${
              isClosing ? 'animate-slide-down' : 'animate-slide-up'
            }`}
          >
            {/* Scrollable content */}
            <div ref={contentRef} className="flex-1 overflow-y-auto scrollbar-hide relative">

              {/* Cover image */}
              <div
                className="w-full h-64 overflow-hidden scale-115 rounded-t-2xl transform origin-top transition-transform duration-100"
                style={{ transform: `scale(${coverScale})` }}
              >
                <img
                  src={cover}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Tabs */}
              <div
                className={`flex gap-2 border-[#303030]  p-2  z-10 bg-[#1c1c1c] transition-all duration-200 ${
                  tabsSticky ? "sticky top-0" : "relative"
                }`}
              >
                {["Shorts", "UGC", "AI Clone"].map((tab) => (
                  <div
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    className={`py-2 mt-4 text-gray-400 bg-[#303030] hover:scale-102 duration-300 cursor-pointer px-4 font-semibold ${
                      activeTab === tab
                        ? "border rounded-[30px] border-cyan-500"
                        : "border border-transparent rounded-[30px]"
                    }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-4 grid grid-cols-4 gap-4">
                {images[activeTab].map((item, idx) => {
                  const videoId = item.id || `${activeTab}-${idx}`;
                  const isHovered = hoveredVideo === videoId;

                  return (
                    <div
                      key={idx}
                      className="w-full rounded-lg overflow-hidden relative cursor-pointer hover:scale-102 duration-500 transition-transform aspect-[5/9] group"
                      onClick={() => alert(`Clicked ${activeTab} item ${idx + 1}`)}
                      onMouseEnter={() => item.type === "video" && handleVideoHover(videoId, true)}
                      onMouseLeave={() => item.type === "video" && handleVideoHover(videoId, false)}
                    >
                      {item.type === "video" ? (
                        <>
                          <video
                            ref={(el) => (videoRefs.current[videoId] = el)}
                            src={item.src}
                            className="w-full h-full object-cover"
                            muted={globalMuted}
                            loop
                            playsInline
                            controls={false}
                            preload="metadata"
                          />
                          {/* Global audio toggle button - only show on hover */}
                          {isHovered && (
                            <button
                              className="absolute top-2 right-2 bg-black bg-opacity-70 text-white rounded-full w-7 h-7 flex items-center justify-center z-20 hover:bg-opacity-90 transition-all duration-200"
                              onClick={toggleGlobalAudio}
                            >
                              {globalMuted ? (
                                <VolumeX size={14} />
                              ) : (
                                <Volume2 size={14} />
                              )}
                            </button>
                          )}
                        </>
                      ) : (
                        <img
                          src={item.src}
                          alt={`${activeTab}-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-white bg-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 z-30"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add the animation styles */}
          <style>
        {`
          @keyframes slideUp {
            from {
              opacity: 1;
              transform: translateY(500px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideDown {
            from {
              opacity: 1;
              transform: translateY(0);
            }
            to {
              opacity: 0.5;
              transform: translateY(700px);
            }
          }
          
          .animate-slide-up {
            animation: slideUp 0.3s ease-out forwards;
          }
          
          .animate-slide-down {
            animation: slideDown 0.3s ease-out forwards;
          }
        `}
      </style>
    </>
  );
}