// import React, { useState } from 'react';
// import Recorder from './components/Recorder';
// import JournalPane from './components/JournalPane';
// import axios from 'axios';
// import { FaSmile, FaFrown, FaMeh, FaAngry, FaSurprise, FaSadCry, FaLaughSquint } from 'react-icons/fa';
// import { motion } from 'framer-motion';
// import ClipLoader from 'react-spinners/ClipLoader';

// const emotionIcons = {
//   happy: <FaSmile className="text-yellow-300 w-24 h-24" />,
//   sad: <FaFrown className="text-blue-300 w-24 h-24" />,
//   angry: <FaAngry className="text-red-500 w-24 h-24" />,
//   surprise: <FaSurprise className="text-purple-500 w-24 h-24" />,
//   neutral: <FaMeh className="text-gray-300 w-24 h-24" />,
//   fear: <FaSadCry className="text-indigo-500 w-24 h-24" />,
//   disgust: <FaLaughSquint className="text-green-500 w-24 h-24" />,
//   calm: <FaMeh className="text-teal-500 w-24 h-24" />,
// };

// function App() {
//   const [audioBlob, setAudioBlob] = useState(null);
//   const [emotion, setEmotion] = useState('');
//   const [confidence, setConfidence] = useState(0);
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState('');
//   const [refreshJournal, setRefreshJournal] = useState(false);
  
//   const triggerRefreshJournal = () => {
//     setRefreshJournal((prev) => !prev);
//   };

//   const handleRecordingComplete = (blob) => {
//     setAudioBlob(blob);
//     setEmotion('');
//     setConfidence(0);
//     setError('');
//   };

//   const uploadAudio = async () => {
//     if (!audioBlob) {
//       alert("Please record an audio clip first.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', audioBlob, 'recorded_audio.mp3');

//     setIsUploading(true);
//     setError('');

//     try {
//       // Predict emotion
//       const response = await axios.post('http://localhost:8001/predict', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const { emotion, confidence } = response.data;
//       console.log(`Predicted Emotion: ${emotion}, Confidence: ${confidence}`);
//       setEmotion(emotion);
//       setConfidence(confidence);

//       // Save to journal
//       const journalFormData = new FormData();
//       journalFormData.append('file', audioBlob, 'recorded_audio.mp3');
//       journalFormData.append('emotion', emotion);
//       journalFormData.append('note', `You went through this emotion: ${emotion}. How do you feel?`);
//       console.log(`Journal Emotion: ${journalFormData.get('emotion')}`);
//       await axios.post('http://localhost:8001/journal', journalFormData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       // Trigger journal refresh
//       triggerRefreshJournal();
      
//     } catch (error) {
//       console.error('Error uploading audio:', error);
//       setError("Failed to process audio. Please try again.", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append('file', file);

//     setIsUploading(true);
//     setError('');
//     setEmotion('');
//     setConfidence(0);

//     try {
//       const response = await axios.post('http://localhost:8001/predict', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       const { emotion, confidence } = response.data;
//       console.log(`Predicted Emotion: ${emotion}, Confidence: ${confidence}`);
//       setEmotion(emotion);
//       setConfidence(confidence);

//       // Save to journal
//       const journalFormData = new FormData();
//       journalFormData.append('file', file);
//       journalFormData.append('emotion', emotion);
//       await axios.post('http://localhost:8001/journal', journalFormData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
      
//       // Trigger journal refresh
//       triggerRefreshJournal();

//     } catch (error) {
//       console.error('Error uploading audio:', error);
//       setError("Failed to process audio. Please try again.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div style={{ display: "flex", height: "100vh" }}>
//       <div style={{ flex: "1 0 25%", height: "100%", backgroundColor: "#f7f9fc", overflowY: "auto" }}>
//         <JournalPane refresh={refreshJournal} />
//       </div>
//       <div style={{
//   flex: "3 0 75%",
//   height: "100%",
//   padding: "1rem",
//   background: "linear-gradient(to right, #3b82f6, #9333ea)",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   flexDirection: "column", // Ensures vertical stacking if you add more elements later
// }}>        <motion.h1
//           className="text-5xl font-bold text-white mb-8"
//           initial={{ y: -250 }}
//           animate={{ y: 0 }}
//           transition={{ type: 'spring', stiffness: 120 }}
//         >
//           🎤 Speech Emotion Detection 🎶
//         </motion.h1>
//         <Recorder onRecordingComplete={handleRecordingComplete} />
//         <motion.div
//   className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
//   initial={{ opacity: 0 }}
//   animate={{ opacity: 1 }}
//   transition={{ delay: 1 }}
//   style={{
//     display: "flex",
//     flexDirection: "row", // Align buttons side by side
//     justifyContent: "center", // Center horizontally
//     alignItems: "center", // Center vertically
//     gap: "1rem", // Add space between buttons
//   }}
// >
//   <div className='py-10'>

//   <button
//     onClick={uploadAudio}
//     className={`flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ${
//       isUploading || !audioBlob ? "opacity-50 cursor-not-allowed" : ""
//     }`}
//     disabled={isUploading || !audioBlob}
//     >
//     {isUploading ? "Processing..." : "Upload & Analyze"}
//   </button>

//     </div>
//   <div className="relative">
//     <input
//       type="file"
//       accept="audio/*"
//       onChange={handleFileUpload}
//       className="hidden"
//       id="upload-audio"
//     />
//     <label
//       htmlFor="upload-audio"
//       className="flex items-center justify-center bg-indigo-500 text-white px-6 py-3 rounded-full cursor-pointer hover:bg-indigo-600 transition duration-300"
//     >
//       Upload Audio
//     </label>
//   </div>
// </motion.div>

//         {isUploading && (
//           <ClipLoader color="#ffffff" loading={isUploading} size={50} />
//         )}
//         {error && <p className="text-red-500">{error}</p>}
//         {emotion && (
//           <motion.div
//             className="mt-8 p-6 bg-white bg-opacity-20 rounded-xl shadow-2xl flex flex-col items-center"
//             initial={{ scale: 0.8 }}
//             animate={{ scale: 1 }}
//             transition={{ type: 'spring', stiffness: 100 }}
//           >
//             <h2 className="text-2xl text-white mb-4">Detected Emotion:</h2>
//             <div className="mb-4">
//               {emotionIcons[emotion.toLowerCase()] || <FaMeh className="text-gray-300 w-24 h-24" />}
//             </div>
//             <p className="text-4xl text-yellow-300 font-semibold">{emotion}</p>
//             <p className="text-lg text-white mt-2">Confidence: {(confidence * 100).toFixed(2)}%</p>
//           </motion.div>
//         )}
//       </div>
//     </div>
//   );
  
// }

// export default App;
import React, { useState } from "react";
import Recorder from "./components/Recorder";
import JournalPane from "./components/JournalPane";
import axios from "axios";
import { FaSmile, FaFrown, FaMeh, FaAngry, FaSurprise, FaSadCry, FaLaughSquint } from "react-icons/fa";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";

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
  const [emotion, setEmotion] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [refreshJournal, setRefreshJournal] = useState(false);
  const [isJournalVisible, setIsJournalVisible] = useState(true); // State for toggling JournalPane visibility

  const triggerRefreshJournal = () => {
    setRefreshJournal((prev) => !prev);
  };

  const handleRecordingComplete = (blob) => {
    setAudioBlob(blob);
    setEmotion("");
    setConfidence(0);
    setError("");
  };

  const uploadAudio = async () => {
    if (!audioBlob) {
      alert("Please record an audio clip first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", audioBlob, "recorded_audio.mp3");

    setIsUploading(true);
    setError("");

    try {
      // Predict emotion
      const response = await axios.post("http://localhost:8001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { emotion, confidence } = response.data;
      setEmotion(emotion);
      setConfidence(confidence);

      // Save to journal
      const journalFormData = new FormData();
      journalFormData.append("file", audioBlob, "recorded_audio.mp3");
      journalFormData.append("emotion", emotion);
      journalFormData.append("note", `You went through this emotion: ${emotion}. How do you feel?`);

      await axios.post("http://localhost:8001/journal", journalFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Trigger journal refresh
      triggerRefreshJournal();
    } catch (error) {
      console.error("Error uploading audio:", error);
      setError("Failed to process audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setError("");
    setEmotion("");
    setConfidence(0);

    try {
      const response = await axios.post("http://localhost:8001/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { emotion, confidence } = response.data;
      setEmotion(emotion);
      setConfidence(confidence);

      // Save to journal
      const journalFormData = new FormData();
      journalFormData.append("file", file);
      journalFormData.append("emotion", emotion);
      journalFormData.append("note", `You went through this emotion: ${emotion}. How do you feel?`);

      await axios.post("http://localhost:8001/journal", journalFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Trigger journal refresh
      triggerRefreshJournal();
    } catch (error) {
      console.error("Error uploading audio:", error);
      setError("Failed to process audio. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {isJournalVisible && (
        <div style={{ flex: "1 0 25%", height: "100%", backgroundColor: "#f7f9fc", overflowY: "auto" }}>
          <JournalPane refresh={refreshJournal} />
        </div>
      )}
      <div
        style={{
          flex: "3 0 75%",
          height: "100%",
          padding: "1rem",
          background: "linear-gradient(to right, #3b82f6, #9333ea)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <motion.h1
          className="text-5xl font-bold text-white mb-8"
          initial={{ y: -250 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          🎤 Speech Emotion Detection 🎶
        </motion.h1>
        <button
          onClick={() => setIsJournalVisible(!isJournalVisible)}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem 1rem",
            backgroundColor: "#e9d9b0",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "1rem",
            cursor: "pointer",
            fontStyle: "bold"
          }}
        >
          {isJournalVisible ? "Hide Journal" : "Show Journal"}
        </button>
        <Recorder onRecordingComplete={handleRecordingComplete} />
        <motion.div
          className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div className="py-10">
          <button
            onClick={uploadAudio}
            className={`flex items-center justify-center bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300 ${
              isUploading || !audioBlob ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isUploading || !audioBlob}
          >
            {isUploading ? "Processing..." : "Upload & Analyze"}
          </button>
          </div>
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
              Upload Audio
            </label>
          </div>
        </motion.div>
        {isUploading && <ClipLoader color="#ffffff" loading={isUploading} size={50} />}
        {error && <p className="text-red-500">{error}</p>}
        {emotion && (
          <motion.div
            className="mt-8 p-6 bg-white bg-opacity-20 rounded-xl shadow-2xl flex flex-col items-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
          >
            <h2 className="text-2xl text-white mb-4">Detected Emotion:</h2>
            <div className="mb-4">{emotionIcons[emotion.toLowerCase()] || <FaMeh className="text-gray-300 w-24 h-24" />}</div>
            <p className="text-4xl text-yellow-300 font-semibold">{emotion}</p>
            <p className="text-lg text-white mt-2">Confidence: {(confidence * 100).toFixed(2)}%</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
