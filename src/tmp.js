import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Volume2, VolumeX, Music, Headphones } from 'lucide-react';

const CountdownWebsiteV3 = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const navigate = useNavigate(); // ใช้สำหรับเปลี่ยนเส้นทาง

  // วันที่เป้าหมาย (28/12/2024 เวลา 8:08 PM)
  const targetDate = new Date('2024-12-28T20:08:00+07:00');

  // ฟังก์ชันคำนวณเวลาที่เหลือ
  useEffect(() => {
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
  }, [navigate, targetDate]);

  return (
    <div 
      className="relative min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 
      flex flex-col items-center justify-center text-white text-center p-4 overflow-hidden"
    >
      {/* Background เพลง */}
      <div className="absolute top-4 left-4 z-10 text-white/70 animate-pulse">
        <Music size={32} />
      </div>

      {/* ส่วนแสดง Countdown */}
      <h1 className="text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-500">
        Coming Soon!
      </h1>

      <div className="grid grid-cols-4 gap-4 bg-black/30 p-6 rounded-xl backdrop-blur-md shadow-2xl">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center">
            <span className="text-6xl font-bold text-white/90">{value}</span>
            <span className="text-xl capitalize text-white/70">{unit}</span>
          </div>
        ))}
      </div>

      {/* ส่วนแสดงข้อความด้านล่าง */}
      <div className="mt-8 text-2xl font-medium flex items-center justify-center gap-2">
        <Mic className="text-blue-400" size={24} />
        Grand Opening: PlengMa Karaoke
        <Mic className="text-purple-400" size={24} />
      </div>
    </div>
  );
};

export default CountdownWebsiteV3;
