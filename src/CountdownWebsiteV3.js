import React, { useState, useEffect } from 'react';
import { Mic, Volume2, VolumeX, Music, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const promotions = [
  "เปิดประสบการณ์ร้องเพลงใหม่!",
  "PlengMa - เวทีนักร้องตัวจริง",
  "Karaoke ระดับมืออาชีพ",
  "เสียงเพลงรอคุณอยู่!",
  "PlengMa - Music Revolution",
  "ปลดปล่อยพลังเสียงกัน",
  "Karaoke ที่คุณรอคอย",
  "เตรียมพบกับความบันเทิงระดับใหม่",
  "PlengMa - Your Ultimate Stage",
  "ร้องเพลงแบบไม่มีขีดจำกัด",
  "Karaoke สุดล้ำ",
  "เสียงเพลงกำลังจะเริ่ม!",
  "PlengMa - เหนือกว่าการร้องเพลง",
  "เวทีของคนรักเพลง",
  "Karaoke ที่ทำให้คุณประทับใจ",
  "PlengMa - Music Unleashed",
  "เตรียมพบกับมาตรฐานใหม่",
  "ร้องได้ สนุกได้",
  "PlengMa - Your Music Destination",
  "รอไม่ได้แล้ว มาร้องเพลงกัน!"
];

const CountdownWebsiteV3 = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [currentPromotion, setCurrentPromotion] = useState(promotions[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [musicWaves, setMusicWaves] = useState([]);
  const navigate = useNavigate();

  // Generate music wave background
  useEffect(() => {
    const generateMusicWaves = () => {
      const waves = Array.from({ length: 20 }).map(() => ({
        left: `${Math.random() * 100}%`,
        height: `${Math.random() * 200 + 50}px`,
        animationDuration: `${Math.random() * 5 + 3}s`,
        delay: `${Math.random() * 2}s`
      }));
      setMusicWaves(waves);
    };

    generateMusicWaves();
  }, []); 

  useEffect(() => {
    const audio = new Audio('/background-music.mp3');
    audio.loop = true;
    
    if (!isMuted) {
      audio.play().catch(error => console.log('Audio play failed:', error));
    }

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isMuted]);

  useEffect(() => {
    const targetDate = new Date('2024-12-28T08:08:00+07:00');

    const calculateTimeLeft = () => {
      const difference = targetDate - new Date();
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        return { days, hours, minutes, seconds };
      }
      return null; // Countdown สิ้นสุด
    };

    const timer = setInterval(() => {
      const time = calculateTimeLeft();
      if (time) {
        setTimeLeft(time);
      } else {
        clearInterval(timer); // หยุดการทำงานเมื่อ Countdown สิ้นสุด
        navigate('/home'); // เปลี่ยนเส้นทางไปยังหน้า Home
      }
    }, 1000);

    return () => clearInterval(timer); // ล้าง timer เมื่อคอมโพเนนต์ถูก unmount
  }, [navigate]);

  // Rotate promotions
  useEffect(() => {
    const promotionTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * promotions.length);
      setCurrentPromotion(promotions[randomIndex]);
    }, 3000);

    return () => clearInterval(promotionTimer);
  }, [navigate]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div 
      className="relative min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 
      flex flex-col items-center justify-center text-white text-center p-4 overflow-hidden"
    >
      {/* Music Wave Background */}
      {musicWaves.map((wave, index) => (
        <div 
          key={index}
          className="absolute bg-white/10 rounded-full animate-music-wave"
          style={{
            left: wave.left,
            width: '2px',
            height: wave.height,
            animationDuration: wave.animationDuration,
            animationDelay: wave.delay
          }}
        />
      ))}

      {/* Audio Control */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-4">
        <Headphones 
          className="text-white/70 hover:text-white transition-all" 
          size={24} 
        />
        {isMuted ? (
          <VolumeX 
            className="cursor-pointer text-white" 
            size={32} 
            onClick={toggleMute} 
          />
        ) : (
          <Volume2 
            className="cursor-pointer text-white" 
            size={32} 
            onClick={toggleMute} 
          />
        )}
      </div>

      {/* Music Icon */}
      <Music 
        className="absolute top-4 left-4 z-10 text-white/70 animate-pulse" 
        size={32} 
      />

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500 animate-bounce">
          Coming Soon!
        </h1>

        <div className="text-3xl font-semibold mb-8 text-yellow-200 animate-wiggle">
          {currentPromotion}
        </div>

        <div className="grid grid-cols-4 gap-4 bg-black/30 p-6 rounded-xl backdrop-blur-md shadow-2xl">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <span className="text-6xl font-bold text-white/90">{value}</span>
              <span className="text-xl capitalize text-white/70">{unit}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-2xl font-medium flex items-center justify-center gap-2">
          <Mic className="text-blue-400" size={24} />
          Grand Opening: PlengMa Karaoke
          <Mic className="text-purple-400" size={24} />
        </div>
      </div>
    </div>
  );
};

export default CountdownWebsiteV3;