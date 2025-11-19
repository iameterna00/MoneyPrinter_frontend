import { useState } from 'react';
import { IoExtensionPuzzle } from 'react-icons/io5';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full flex justify-center items-center fixed md:top-5 z-50">
      <div className="
        flex items-center m-2 md:m-0 bg-gradient-to-r from-[#655172]/30 to-[#323232]/30 backdrop-blur-md
        -webkit-backdrop-blur-md                            
        border border-white/10                                
        py-2 h-15 md:h-auto px-6 rounded-[30px] justify-between
        md:w-[60%] w-[100%] space-x-4 md:space-x-8
        shadow-lg/5                                           
      ">
        <div className="bg-[#4A4A5C] w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm flex-shrink-0">
          W
        </div>

    <div className="flex items-center md:hidden space-x-4">
          <div
                onClick={() => {}}
                className=" p-[1px] rounded-[20px] flex gap-2 bottom-4 left-4 cursor-pointer text-gray-300 display-hidden hover:text-white text-[12px] items-center justify-center duration-500 group"
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
           <div className="relative cursor-pointer rounded-[20px] overflow-hidden group">
            
            <div className="
              absolute inset-0 bg-gradient-to-r from-[#323232] to-[#655172]
              transition-opacity duration-500
              group-hover:opacity-0
            "></div>

            <div className="
              absolute inset-0 bg-gradient-to-r from-[#655172] to-[#323232]
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "></div>
            <div className="relative z-10 text-white px-4 py-2 flex items-center gap-2">
              <span>Sign Up</span>
            </div>
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
        
        <button 
          className="md:hidden flex flex-col justify-center items-center w-6 h-6 cursor-pointer"
          onClick={toggleMenu}
        >
          <span className={`bg-white h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <span className={`bg-white h-0.5 w-6 rounded-full my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
          <span className={`bg-white h-0.5 w-6 rounded-full transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
    </div>

        <nav className="hidden md:flex justify-between w-full items-center">
          <div className="flex items-center">
            <ul className="flex space-x-4 md:space-x-8">
              <li>
                <a href="#models" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                  Models
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#explore" className="text-white text-sm hover:text-gray-300 transition-colors duration-200">
                  Explore
                </a>
              </li>
            </ul>
          </div>
           <div
                onClick={() => {}}
                className=" p-[1px] rounded-[20px] flex gap-2 bottom-4 left-4 cursor-pointer text-gray-300 display-hidden hover:text-white text-[12px] items-center justify-center duration-500 group"
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
           <div className="relative cursor-pointer rounded-[20px] overflow-hidden group">
            
            <div className="
              absolute inset-0 bg-gradient-to-r from-[#323232] to-[#655172]
              transition-opacity duration-500
              group-hover:opacity-0
            "></div>

            <div className="
              absolute inset-0 bg-gradient-to-r from-[#655172] to-[#323232]
              opacity-0 group-hover:opacity-100
              transition-opacity duration-500
            "></div>
            <div className="relative z-10 text-white px-4 py-2 flex items-center gap-2">
              <span>Sign Up</span>
            </div>
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
        </nav>
        

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-r from-[#655172]/30 to-[#323232]/30 backdrop-blur-md border border-white/10 rounded-[20px] shadow-lg md:hidden">
            <ul className="flex flex-col p-4 space-y-4">
              <li>
                <a 
                  href="#models" 
                  className="text-white text-sm hover:text-gray-300 transition-colors duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Models
                </a>
              </li>
              <li>
                <a 
                  href="#pricing" 
                  className="text-white text-sm hover:text-gray-300 transition-colors duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
              </li>
              <li>
                <a 
                  href="#explore" 
                  className="text-white text-sm hover:text-gray-300 transition-colors duration-200 block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Explore
                </a>
              </li>
            </ul>
          </div>
        )}
        
      </div>
    </header>
  );
}