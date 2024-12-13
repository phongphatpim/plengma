import React, { useState, useRef } from 'react';

function LRC() {
  const [lyrics, setLyrics] = useState('');
  const [lyricsLines, setLyricsLines] = useState([]);
  const [audioFile, setAudioFile] = useState(null);
  const [lrcContent, setLrcContent] = useState('');
  const [isLrcGenerated, setIsLrcGenerated] = useState(false);
  const audioRef = useRef(null);

  const handleLyricsChange = (event) => {
    setLyrics(event.target.value);
  };

  const handleNext = () => {
    const lines = lyrics
      .split('\n')
      .map((line) => ({ text: line.trim(), startTime: 0, endTime: 0 }));
    setLyricsLines(lines);
  };

  const handleAudioChange = (event) => {
    const file = event.target.files[0];
    setAudioFile(file);
  };

  const handlePlay = (index) => {
    audioRef.current.currentTime = lyricsLines[index].startTime;
    audioRef.current.play();
  };

  const handleStart = (index) => {
    const newLyricsLines = [...lyricsLines];
    newLyricsLines[index].startTime = audioRef.current.currentTime;
    setLyricsLines(newLyricsLines);
  };

  const handleEnd = (index) => {
    const newLyricsLines = [...lyricsLines];
    newLyricsLines[index].endTime = audioRef.current.currentTime;
    setLyricsLines(newLyricsLines);
  };

  const generateLRC = () => {
    let lrc = '';

    lyricsLines.forEach((line, index) => {
      const start = line.startTime;
      const end = line.endTime;
      const startFormatted = formatTime(start);
      const endFormatted = formatTime(end);

      if (start !== 0 && line.text) {
        lrc += `[${startFormatted}] ${line.text}\n`;
      }
      if (end !== 0 && line.text) {
        lrc += `[${endFormatted}] \n`;
      }
    });

    setLrcContent(lrc);
    setIsLrcGenerated(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}.00`;
  };

  const downloadLRC = () => {
    if (lrcContent) {
      const element = document.createElement('a');
      const file = new Blob([lrcContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'lyrics.lrc';
      document.body.appendChild(element);
      element.click();
    } else {
      alert('Please generate LRC content first.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">PlengMa LRC Maker</h1>
      {lyricsLines.length === 0 ? (
        <div className="w-full max-w-lg">
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter lyrics here..."
            value={lyrics}
            onChange={handleLyricsChange}
          />
          <button
            onClick={handleNext}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <input
            type="file"
            accept="audio/*"
            onChange={handleAudioChange}
            className="mb-4"
          />
          {audioFile && (
            <audio ref={audioRef} controls className="w-full mb-4">
              <source src={URL.createObjectURL(audioFile)} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          <div className="space-y-4">
            {lyricsLines.map((line, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-white border border-gray-300 rounded-lg"
              >
                <button
                  onClick={() => handlePlay(index)}
                  className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Play
                </button>
                <button
                  onClick={() => handleStart(index)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Start
                </button>
                <button
                  onClick={() => handleEnd(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  End
                </button>
                <span className="flex-1 text-gray-700">{line.text}</span>
              </div>
            ))}
          </div>
          <button
            onClick={generateLRC}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Generate LRC
          </button>
          <pre className="mt-4 bg-gray-200 p-3 rounded-lg whitespace-pre-wrap">
            {lrcContent}
          </pre>
          {isLrcGenerated && (
            <button
              onClick={downloadLRC}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Download LRC
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default LRC;
