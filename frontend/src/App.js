// src/App.js

import React, { useState } from 'react';
import Recorder from './components/Recorder';
import axios from 'axios';
import { FaMicrophone, FaUpload, FaSmile, FaFrown, FaMeh, FaAngry, FaSurprise, FaSadCry, FaLaughSquint } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ClipLoader from 'react-spinners/ClipLoader';

const emotionIcons = {
  happy: <FaSmile className="text-yellow-300 w-24 h-24" />,
  sad: <FaFrown className="text-blue-300 w-24 h-24" />,
  angry: <FaAngry className="text-red-500 w-24 h-24" />,
  surprise: <FaSurprise className="text-purple-500 w-24 h-24" />,
  neutral: <FaMeh className="text-gray-300 w-24 h-24" />,
  fear: <FaSadCry className="text-indigo-500 w-24 h-24" />,
  disgust: <FaLaughSquint className="text-green-500 w-24 h-24" />,
  calm: <FaMeh className="text-teal-500 w-24 h-24" />,
};

function App() {
  const [audioBlob, setAudioBlob] = useState(null);
  const [emotion, setEmotion] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
    setEmotion('');
    setConfidence(0);
    setError('');
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("Please record an audio clip first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', audioBlob, 'recorded_audio.mp3');

    setIsUploading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEmotion(response.data.emotion);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError("Failed to process audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    setError('');
    setEmotion('');
    setConfidence(0);

    try {
      const response = await axios.post('http://localhost:8001/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEmotion(response.data.emotion);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error('Error uploading audio:', error);
      setError("Failed to process audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <motion.h1
        className="text-5xl font-bold text-white mb-8"
        initial={{ y: -250 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        🎤 Speech Emotion Detection🎶
      </motion.h1>
      
      <motion.div
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Recorder onRecordingComplete={handleRecordingComplete} />
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <button
          onClick={uploadAudio}
          className={`flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ${
            isUploading || !audioBlob ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isUploading || !audioBlob}
        >
          <FaMicrophone className="mr-2" />
          {isUploading ? 'Processing...' : 'Upload & Analyze'}
        </button>

        <div className="relative">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="upload-audio"
          />
          <label
            htmlFor="upload-audio"
            className="flex items-center justify-center bg-indigo-500 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-indigo-600 transition duration-300"
          >
            <FaUpload className="mr-2" />
            Upload Audio
          </label>
        </div>
      </motion.div>

      {isUploading && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <ClipLoader color="#ffffff" loading={isUploading} size={50} />
          <p className="text-white mt-2">Analyzing your audio...</p>
        </motion.div>
      )}

      {error && (
        <motion.div
          className="mt-4 p-4 bg-red-500 text-white rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {error}
        </motion.div>
      )}

      {emotion && (
        <motion.div
          className="mt-8 p-6 bg-white bg-opacity-20 rounded-xl shadow-2xl flex flex-col items-center"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <h2 className="text-2xl text-white mb-4">Detected Emotion:</h2>
          <div className="mb-4">
            {emotionIcons[emotion.toLowerCase()] || <FaMeh className="text-gray-300 w-24 h-24" />}
          </div>
          <p className="text-4xl text-yellow-300 font-semibold">{emotion}</p>
          <p className="text-lg text-white mt-2">Confidence: {(confidence * 100).toFixed(2)}%</p>
        </motion.div>
      )}
    </div>
  );
}

export default App;
