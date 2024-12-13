import React, { useState } from 'react';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setCurrentPage={setCurrentPage} />;
      case 'karaoke':
        return <KaraokePage />;
      case 'shop':
        return <ShopPage />;
      case 'tools':
        return <ToolsPage />;
      case 'about':
        return <AboutPage />;
      default:
        return <HomePage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="flex-grow container mx-auto px-4 py-8">
        {renderPage()}
      </main>

      <Footer />
    </div>
  );
};

const Navigation = ({ currentPage, setCurrentPage }) => {
  const menuItems = [
    { name: 'หน้าหลัก', page: 'home' },
    { name: 'ร้องเพลง', page: 'karaoke' },
    { name: 'ร้านค้า', page: 'shop' },
    { name: 'เครื่องมือ', page: 'tools' },
    { name: 'เกี่ยวกับ', page: 'about' },
  ];

  return (
    <nav className="bg-purple-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div
          onClick={() => setCurrentPage('home')}
          className="text-2xl font-bold cursor-pointer"
        >
          PlengMa
        </div>

        <div className="space-x-4">
          {menuItems.map((item) => (
            <button
              key={item.page}
              onClick={() => setCurrentPage(item.page)}
              className={`hover:text-purple-200 ${
                currentPage === item.page ? 'text-yellow-300' : ''
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-purple-900 text-white py-6">
      <div className="container mx-auto text-center">
        <p>© 2024 PlengMa - Karaoke and Me!</p>
        <div className="mt-4 space-x-4">
          {/*<a href="#" className="hover:text-purple-200">
            นโยบายความเป็นส่วนตัว
          </a>*/}
          <a href="#" className="hover:text-purple-200">
            เงื่อนไขการใช้งาน
          </a>
          {/* <a href="#" className="hover:text-purple-200">
            ติดต่อเรา
          </a> */}
        </div>
      </div>
    </footer>
  );
};

const HomePage = ({ setCurrentPage }) => {
  const features = [
    {
      icon: '🎤',
      title: 'เล่นคาราโอเกะ',
      description: 'เริ่มร้องเพลงส่วนตัวของคุณได้ทันที!',
      page: 'karaoke',
    },
    {
      icon: '🛒',
      title: 'ร้านค้า',
      description: 'อุปกรณ์คาราโอเกะคุณภาพสูง',
      page: 'shop',
    },
    {
      icon: '🛠️',
      title: 'เครื่องมือ',
      description: 'เครื่องมือเสริมสำหรับคาราโอเกะ',
      page: 'tools',
    },
  ];

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-purple-800 mb-6">
        PlengMa: Karaoke and Me!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.page}
            onClick={() => setCurrentPage(feature.page)}
            className="bg-white shadow-lg rounded-lg p-6 hover:scale-105 transition-transform cursor-pointer"
          >
            <h2 className="text-2xl font-semibold mb-4">
              {feature.icon} {feature.title}
            </h2>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-3xl font-bold text-purple-800 mb-6">
          ซักท่อนในชีวิตต้องเพลงมา!
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xl font-semibold mb-2">🌟 คาราโอเกะส่วนตัว</h4>
            <p>ประสบการณ์คาราโอเกะที่ออกแบบมาเฉพาะตัวคุณ</p>
          </div>
          <div>
            <h4 className="text-xl font-semibold mb-2">🔧 ฟีเจอร์พิเศษ</h4>
            <p>เครื่องมือและฟีเจอร์ที่คุณจะไม่พบที่อื่น</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const KaraokePage = () => {
  const [selectedSong, setSelectedSong] = useState(null);

  const songs = [
    { id: 1, title: 'เพลงรัก', artist: 'ศิลปินยอดนิยม' },
    { id: 2, title: 'หัวใจสีเทา', artist: 'นักร้องดัง' },
    { id: 3, title: 'ความหวัง', artist: 'วงดนตรีชั้นนำ' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
        คาราโอเกะ
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">รายการเพลง</h2>
          <div className="space-y-2">
            {songs.map((song) => (
              <div
                key={song.id}
                onClick={() => setSelectedSong(song)}
                className={`p-3 rounded cursor-pointer ${
                  selectedSong?.id === song.id
                    ? 'bg-purple-200'
                    : 'bg-white hover:bg-purple-100'
                }`}
              >
                <h3 className="font-bold">{song.title}</h3>
                <p className="text-sm text-gray-600">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {selectedSong ? `กำลังเล่น: ${selectedSong.title}` : 'เลือกเพลง'}
          </h2>
          {selectedSong && (
            <div className="bg-white p-6 rounded-lg shadow">
              <p>เตรียมพร้อมสำหรับการร้องเพลง</p>
              <div className="mt-4 space-x-2">
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  เริ่มเล่น
                </button>
                <button className="bg-red-500 text-white px-4 py-2 rounded">
                  หยุด
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShopPage = () => {
  const products = [
    {
      id: 1,
      name: 'ชุดเครื่องเสียง ลำโพงคาราโอเกะ PROPLUS รุ่น Z10',
      price: 6250,
      image:
        'https://down-th.img.susercontent.com/file/th-11134207-7r990-lxv17lsoxlf475@resize_w450_nl.webp',
      affiliateLink: 'https://s.shopee.co.th/7pclqdHfHZ',
    },
    {
      id: 2,
      name: 'TADA MX-320 mixer พร้อมไมค์ลอย2ตัว ธาดา รุ่น MX 320 MX320 มิกเซอร์ EQ ปรับโทนเสียง มิกเซอร์พร้อมไมค์ลอยคู่ เอไอ-ไพศาล',
      price: 2290,
      image:
        'https://down-th.img.susercontent.com/file/sg-11134201-7rdx6-ly24mlj0s45lc2.webp',
      affiliateLink: 'https://s.shopee.co.th/2LHpIhgXwI',
    },
    {
      id: 3,
      name: 'Yamaha MG06X มิกเซอร์ผสมเสียงเหมาะสำหรับงานคาราโอเกะ',
      price: 2999,
      image:
        'https://down-th.img.susercontent.com/file/sg-11134201-7rdxy-m16osaaqx6lgd2.webp',
      affiliateLink: 'https://s.shopee.co.th/20eytzodfd',
    },
  ];

  const handleButtonClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
        ร้านค้าอุปกรณ์คาราโอเกะ
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg p-4 text-center"
          >
            <img
              src={`${product.image}`}
              alt={product.name}
              className="mx-auto mb-4 w-48 h-48 object-cover"
            />
            <h3 className="font-bold text-xl">{product.name}</h3>
            <p className="text-purple-700 font-semibold">
              ราคา {product.price.toLocaleString()} บาท
            </p>
            <button
              className="ml-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              onClick={() => handleButtonClick(product.affiliateLink)}
            >
              ไปดูสินค้า
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// const ToolsPage = () => {
//   const tools = [
//     {
//       id: 1,
//       name: 'แยกเสียงคาราโอเกะ',
//       description: 'แยกเสียงดนตรี/คอรัส/เสียงนักร้อง',
//       icon: '🎙️',
//     },
//     {
//       id: 2,
//       name: 'ปาดเนื้อร้อง',
//       description: 'สร้าง LRC ไฟล์ตั้งเวลาแสดงเนื้อร้อง',
//       icon: '📊',
//     },
//     {
//       id: 3,
//       name: 'ตั้งตัดเสียง/ตั้งเล่นเสียง',
//       description: 'ตั้งเวลาตัดเสียงร้องและเล่นคลิปเสียง',
//       icon: '🎵',
//     },
//   ];

//   return (
//     <div>
//       <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
//         เครื่องมือคาราโอเกะ
//       </h1>

//       <div className="grid md:grid-cols-3 gap-6">
//         {tools.map((tool) => (
//           <div
//             key={tool.id}
//             className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform"
//           >
//             <div className="text-6xl mb-4">{tool.icon}</div>
//             <h3 className="font-bold text-xl mb-2">{tool.name}</h3>
//             <p className="text-gray-600">{tool.description}</p>
//             <button className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
//               เริ่มใช้งาน
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

const ToolsPage = () => {
  const tools = [
    {
      id: 1,
      name: 'แยกเสียงคาราโอเกะ',
      description: 'แยกเสียงดนตรี/คอรัส/เสียงนักร้อง',
      icon: '🎙️',
      action: () => alert('ยังไม่มีการเชื่อมโยงสำหรับเครื่องมือนี้'), // ตัวอย่างการจัดการ
    },
    {
      id: 2,
      name: 'ปาดเนื้อร้อง',
      description: 'สร้าง LRC ไฟล์ตั้งเวลาแสดงเนื้อร้อง',
      icon: '📊',
      action: () => window.open('/lrc', '_blank'), // เปิดแท็บใหม่ไปยัง /lrc
    },
    {
      id: 3,
      name: 'ตั้งตัดเสียง/ตั้งเล่นเสียง',
      description: 'ตั้งเวลาตัดเสียงร้องและเล่นคลิปเสียง',
      icon: '🎵',
      action: () => alert('ยังไม่มีการเชื่อมโยงสำหรับเครื่องมือนี้'), // ตัวอย่างการจัดการ
    },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold text-purple-800 mb-6 text-center">
        เครื่องมือคาราโอเกะ
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:scale-105 transition-transform"
          >
            <div className="text-6xl mb-4">{tool.icon}</div>
            <h3 className="font-bold text-xl mb-2">{tool.name}</h3>
            <p className="text-gray-600">{tool.description}</p>
            <button
              onClick={tool.action}
              className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              เริ่มใช้งาน
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-purple-800 mb-6">
        เกี่ยวกับ PlengMa
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">เส้นทางของเรา</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-bold">EntertainMAN Team</h3>
            <p>จุดเริ่มต้นของความฝันในวงการคาราโอเกะ</p>
          </div>

          <div>
            <h3 className="font-bold">9Karaoke</h3>
            <p>พัฒนาต่อยอดแพลตฟอร์มคาราโอเกะ</p>
          </div>

          <div>
            <h3 className="font-bold">PlengMa</h3>
            <p>คาราโอเกะส่วนตัวที่ออกแบบมาเพื่อคุณโดยเฉพาะ</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
