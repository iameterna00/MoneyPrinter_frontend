export function Header() {
  return(
  <header className="w-full flex justify-center items-center fixed top-0 md:top-5 z-50">
        <div className="
          flex items-center bg-gradient-to-r from-[#655172]/30 to-[#323232]/30 backdrop-blur-md
          -webkit-backdrop-blur-md                            
          border border-white/10                                
          py-2 h-15 md:h-auto px-6 md:rounded-[30px] justify-between
          md:w-[60%] w-[100%] space-x-4 md:space-x-8
          shadow-lg/5                                           
        ">
          <div className="bg-[#4A4A5C] w-10 h-10 rounded-full flex justify-center items-center font-bold text-sm flex-shrink-0">
            W
          </div>

          <nav className="flex justify-between w-full items-center">
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
            <button className="bg-gradient-to-r cursor-pointer from-[#323232] to-[#655172] hover:from-[#655172] hover:to-[#323232] text-white px-6 py-2 rounded-[30px] text-sm transition-all duration-300 shadow-lg">
              Sign up
            </button>
          </nav>
        </div>
      </header>);
}