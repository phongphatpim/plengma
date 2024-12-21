import React, { useState } from 'react';
import {
  PlayCircle,
  PauseCircle,
  Square,
  SkipForward,
  SkipBack,
  Volume2,
  Music,
  ListMusic,
  Mic,
  Settings,
  Plus,
  Trash,
  ArrowUp,
  ArrowDown,
  Repeat,
  Shuffle,
  Volume1,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

const KaraokePlayer = () => {
  const [volume, setVolume] = useState(80);
  const [vocalVolume, setVocalVolume] = useState(100);
  const [instrumentalVolume, setInstrumentalVolume] = useState(80);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  
  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleSidebarVisibility = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const SidebarButton = () => (
    <button 
      onClick={toggleSidebarVisibility}
      className="fixed left-4 top-20 z-50 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-700 shadow-lg"
    >
      <Menu size={24} />
    </button>
  );
  
  return (
    <div className="min-h-screen bg-[#f8f5ff] text-gray-800">
      {/* Header */}
      <div className="bg-[#663399] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">PlengMa</h1>
          <nav className="space-x-6">
            <a href="#" className="hover:text-purple-200">หน้าหลัก</a>
            <a href="#" className="hover:text-purple-200">ร้องเพลง</a>
            <a href="#" className="hover:text-purple-200">ร้านค้า</a>
            <a href="#" className="hover:text-purple-200">เครื่องมือ</a>
            <a href="#" className="hover:text-purple-200">เกี่ยวกับ</a>
          </nav>
        </div>
      </div>

      <div className="flex flex-row h-[calc(100vh-64px)]">
        {/* Sidebar Toggle Button */}
        <SidebarButton />

        {/* Left Panel - Controls and Playlist */}
        <div className={`
          fixed lg:relative
          ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}
          ${isExpanded ? 'w-96' : 'w-24'}
          bg-white border-r border-purple-100 h-full
          transition-all duration-300 ease-in-out
          z-40
        `}>
          {/* Expand/Collapse Toggle */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 
                     bg-purple-600 text-white p-1 rounded-full shadow-lg
                     hover:bg-purple-700 z-50"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>

          <div className="h-full overflow-y-auto p-4">
            {/* Now Playing Info */}
            <div className="bg-purple-50 rounded-lg p-4 flex items-center mb-4">
              <img src="/api/placeholder/80/80" alt="Album" className="w-20 h-20 rounded" />
              {isExpanded && (
                <div className="ml-4">
                  <h2 className="text-xl font-bold">ชื่อเพลง</h2>
                  <p className="text-purple-600">ศิลปิน - อัลบั้ม</p>
                </div>
              )}
            </div>

            {/* Main Controls */}
            <div className="bg-white border border-purple-100 rounded-lg p-4 mb-4 shadow-sm">
              {/* Seek Bar - Always visible */}
              <div className="mb-4">
                <input
                  type="range"
                  className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer"
                  value="30"
                />
                {isExpanded && (
                  <div className="flex justify-between text-sm text-purple-600 mt-1">
                    <span>1:23</span>
                    <span>3:45</span>
                  </div>
                )}
              </div>
              
              {/* Playback Controls - Always visible but reorganized when collapsed */}
              <div className={`flex items-center ${isExpanded ? 'justify-center space-x-4' : 'flex-col space-y-4'} mb-4`}>
                <button className="p-2 hover:bg-purple-50 rounded-full text-purple-600">
                  <SkipBack size={24} />
                </button>
                <button className="p-4 bg-purple-600 rounded-full hover:bg-purple-700 text-white">
                  <PlayCircle size={32} />
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-full text-purple-600">
                  <Square size={24} />
                </button>
                <button className="p-2 hover:bg-purple-50 rounded-full text-purple-600">
                  <SkipForward size={24} />
                </button>
              </div>

              {/* Volume Controls - Simplified when collapsed */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <Volume2 size={20} className="mr-2 text-purple-600" />
                  {isExpanded && (
                    <input
                      type="range"
                      className="flex-grow h-2 bg-purple-100 rounded-lg"
                      value={volume}
                      onChange={(e) => setVolume(e.target.value)}
                    />
                  )}
                </div>
                {isExpanded && (
                  <>
                    <div className="flex items-center">
                      <Mic size={20} className="mr-2 text-purple-600" />
                      <input
                        type="range"
                        className="flex-grow h-2 bg-purple-100 rounded-lg"
                        value={vocalVolume}
                        onChange={(e) => setVocalVolume(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center">
                      <Music size={20} className="mr-2 text-purple-600" />
                      <input
                        type="range"
                        className="flex-grow h-2 bg-purple-100 rounded-lg"
                        value={instrumentalVolume}
                        onChange={(e) => setInstrumentalVolume(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Extended Controls - Only visible when expanded */}
              {isExpanded && (
                <>
                  {/* Key & Tempo */}
                  <div className="flex space-x-2 mb-4">
                    <select className="bg-purple-50 border border-purple-100 rounded p-2 flex-grow">
                      <option>Key: C</option>
                    </select>
                    <select className="bg-purple-50 border border-purple-100 rounded p-2 flex-grow">
                      <option>Tempo: 100%</option>
                    </select>
                  </div>

                  {/* EQ Controls */}
                  <div className="flex space-x-4 justify-center mb-4">
                    <div className="flex-grow text-center">
                      <input
                        type="range"
                        className="h-24 writing-vertical"
                        orient="vertical"
                      />
                      <div className="text-sm mt-2 text-purple-600">Low</div>
                    </div>
                    <div className="flex-grow text-center">
                      <input
                        type="range"
                        className="h-24 writing-vertical"
                        orient="vertical"
                      />
                      <div className="text-sm mt-2 text-purple-600">Mid</div>
                    </div>
                    <div className="flex-grow text-center">
                      <input
                        type="range"
                        className="h-24 writing-vertical"
                        orient="vertical"
                      />
                      <div className="text-sm mt-2 text-purple-600">High</div>
                    </div>
                  </div>

                  {/* Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Volume2 size={20} className="mr-2" />
                      <span>Mix</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Volume1 size={20} className="mr-2" />
                      <span>Vocal</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Music size={20} className="mr-2" />
                      <span>Instrumental</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <VolumeX size={20} className="mr-2" />
                      <span>Mute</span>
                    </button>
                  </div>

                  {/* Play Mode Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Repeat size={20} className="mr-2" />
                      <span>Repeat All</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Repeat size={20} className="mr-2" />
                      <span>Repeat One</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <Shuffle size={20} className="mr-2" />
                      <span>Shuffle</span>
                    </button>
                    <button className="p-2 bg-purple-50 rounded-lg hover:bg-purple-100 flex items-center justify-center text-purple-600">
                      <ListMusic size={20} className="mr-2" />
                      <span>Sequential</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Playlist - Only visible when expanded */}
            {isExpanded && (
              <div className="bg-white border border-purple-100 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-purple-600">เพลย์ลิสต์</h2>
                  <button className="p-2 bg-purple-600 rounded-full hover:bg-purple-700 text-white">
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center bg-purple-50 p-2 rounded">
                    <img src="/api/placeholder/40/40" alt="Album" className="w-10 h-10 rounded" />
                    <div className="ml-2 flex-grow">
                      <div className="font-medium">ชื่อเพลง</div>
                      <div className="text-sm text-purple-600">ศิลปิน</div>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 hover:bg-purple-100 rounded text-purple-600">
                        <ArrowUp size={16} />
                      </button>
                      <button className="p-1 hover:bg-purple-100 rounded text-purple-600">
                        <ArrowDown size={16} />
                      </button>
                      <button className="p-1 hover:bg-purple-100 rounded text-red-400">
                        <Trash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Lyrics Display */}
        <div className="flex-grow bg-[#f8f5ff] p-4">
          <div className="h-full bg-white border border-purple-100 rounded-lg p-8 flex items-center justify-center shadow-sm">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-purple-600 mb-4">เนื้อเพลง</h1>
              <p className="text-2xl text-purple-400">พร้อมที่จะเล่น</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KaraokePlayer;