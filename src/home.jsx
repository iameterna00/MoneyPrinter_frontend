import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './header';

function Home() {
  const navigate = useNavigate();
  const reelVideos = [
    'https://cdn.openai.com/nf2/nf2-blog/nf2-blog-cameos/5eb66c14-86d6-45f5-8ea6-610939ba491b/cameo_empty.mp4',
    'https://cdn.openai.com/nf2/nf2-blog/nf2-blog-cameos/5eb66c14-86d6-45f5-8ea6-610939ba491b/cameo1-2.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-white-flower-1174-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-going-down-a-curved-highway-through-a-mountain-1177-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-a-girl-blowing-a-bubble-gum-at-an-amusement-park-1226-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-footballer-running-with-ball-in-field-1227-large.mp4',
  ];

  return (
    <div className="bg-[#0B0B0B] text-white min-h-screen overflow-x-hidden">
      <Header />
      <main className="relative flex flex-col items-center justify-center min-h-screen pb-10 pt-20">
        <div className="absolute inset-0 overflow-hidden opacity-20 z-0">
          <div className="absolute top-10 left-0 w-full">
            <div className="flex space-x-6 animate-circularLoop">
              {[...reelVideos, ...reelVideos, ...reelVideos].map((video, index) => (
                <div key={index} className="flex-shrink-0 w-36 h-20 bg-gradient-to-r from-purple-900 to-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                  <video 
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Middle Circular Reel */}
          <div className="absolute top-1/2 left-0 w-full transform -translate-y-1/2">
            <div className="flex space-x-6 animate-circularLoopReverse">
              {[...reelVideos, ...reelVideos, ...reelVideos].map((video, index) => (
                <div key={index} className="flex-shrink-0 w-44 h-24 bg-gradient-to-r from-gray-800 to-purple-900 rounded-lg overflow-hidden border-2 border-gray-600">
                  <video 
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Circular Reel */}
          <div className="absolute bottom-16 left-0 w-full">
            <div className="flex space-x-6 animate-circularLoopSlow">
              {[...reelVideos, ...reelVideos, ...reelVideos].map((video, index) => (
                <div key={index} className="flex-shrink-0 w-40 h-22 bg-gradient-to-r from-purple-900 to-gray-800 rounded-lg overflow-hidden border-2 border-gray-600">
                  <video 
                    src={video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center z-10 px-4">
          {/* Heading */}
          <h1 className="text-4xl md:text-7xl font-bold leading-tight mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#9900FF] to-[#999999]">
            Generate AI videos <span className="text-white opacity-90">with just text</span>
          </h1>

          {/* Text Content */}
          <div className="w-full flex justify-center mb-10">
            <p className="text-sm md:text-xl leading-relaxed text-center max-w-2xl opacity-90">
              Instantly turn your text inputs into publish-worthy videos. Nepwoop AI video generator
              simplifies the process, generating the script and adding video clips, subtitles,
              background music, and transitions. Add finishing touches with an intuitive editor.
              Create videos at scale without any learning curve!
            </p>
          </div>

          {/* CTA Button */}
<button
  onClick={() => navigate('/youtube')}
  className="
    cursor-pointer
    bg-gradient-to-r from-[#738FFF] to-[#725D80]
    text-white font-semibold
    px-8 py-4 rounded-full text-lg md:text-xl
    shadow-[0_0_20px_rgba(115,143,255,0.4)]
    transform
    hover:shadow-[0_0_30px_rgba(114,93,128,0.6)]
   
    transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    [transition-property:background-position,background-color,border-color,color,fill,stroke,opacity,box-shadow,transform,filter,backdrop-filter]
  "
  style={{
    backgroundSize: '200% 200%',
    backgroundPosition: 'left center',
  }}
  onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}
>
    Generate Video Now
</button>


        </div>
      </main>

      <style jsx>{`
        @keyframes circularLoop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 24px)); /* accounts for gap space */
          }
        }
        
        @keyframes circularLoopReverse {
          0% {
            transform: translateX(calc(-50% - 24px));
          }
          100% {
            transform: translateX(0);
          }
        }
        
        @keyframes circularLoopSlow {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-50% - 24px));
          }
        }
        
        .animate-circularLoop {
          animation: circularLoop 25s linear infinite;
        }
        
        .animate-circularLoopReverse {
          animation: circularLoopReverse 30s linear infinite;
        }
        
        .animate-circularLoopSlow {
          animation: circularLoopSlow 35s linear infinite;
        }
        
        /* Smooth seamless looping */
        .animate-circularLoop:hover,
        .animate-circularLoopReverse:hover,
        .animate-circularLoopSlow:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default Home;