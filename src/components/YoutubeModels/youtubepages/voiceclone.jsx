import React, { useState, useRef } from "react";
import { Mic, Play, Trash2, Pause, FileVolume, FileInput } from "lucide-react";
import axios from "axios";
import { webApi } from "../../../api/api";
// --- VoiceCloneUploader Component ---
const VoiceCloneUploader = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);
  const [uploading, setUploading] = useState(false);


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudioURL(URL.createObjectURL(file));
    } else {
      alert('Please select an audio file');
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudioURL(URL.createObjectURL(file));
      } else {
        alert('Please drop an audio file');
      }
    }
  };

  const startRecording = async () => {
    try {
      // Check if browser supports MediaRecorder
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Your browser does not support audio recording');
        return;
      }

      setRecording(true);
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });
      
      streamRef.current = stream;

      // Check for supported MIME types
      const options = { 
        audioBitsPerSecond: 128000,
        mimeType: 'audio/webm;codecs=opus' 
      };
      
      // Try to find a supported MIME type
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/webm';
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/mp4';
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        delete options.mimeType; // Let browser choose default
      }

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { 
          type: mediaRecorderRef.current.mimeType || 'audio/webm' 
        });
        const url = URL.createObjectURL(blob);
        setAudioFile(blob);
        setAudioURL(url);
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
      };

      mediaRecorderRef.current.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      setRecording(false);
      alert('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handlePlayClick = () => {
    setShowAudioPlayer(!showAudioPlayer);
  };

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  const handleUpload = async () => {
    if (!audioFile) {
      alert("Please select or record an audio file first!");
      return;
    }

    const formData = new FormData();
    formData.append("audio", audioFile);

    try {
      setUploading(true);
      const response = await axios.post(`${webApi}/upload-audio`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", response.data);
      alert("Audio uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload audio.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 border-dashed border-2 border-[#ffffff17] rounded-xl text-center">
      {/* Show upload area only when no audio is selected */}
      {!audioURL ? (
        <>
          <div 
            className="flex p-4 flex-col items-center justify-center cursor-pointer"
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <FileInput strokeWidth={0.75}  size={40} className="text-gray-500 mb-2" />
            <label className="text-gray-300 cursor-pointer">
              Click to upload or drag and drop
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-[14px] text-gray-500 mt-1">Supports MP3, WAV, and other audio formats</p>
          </div>

          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-gray-500">or</span>
            {!recording ? (
              <div
                className="flex gradient-magic-button1"
                onClick={startRecording}
              >
                <div className="button-inner">
                  <span className="flex items-center gap-2">
                    <Mic size={16} /> Record audio
                  </span>
                </div>
              </div>
            ) : (
              <button
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                onClick={stopRecording}
              >
                <Mic size={16} /> Stop Recording
              </button>
            )}
          </div>

          {recording && (
            <div className="mt-2 flex items-center justify-center">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-red-500 text-sm">Recording...</span>
            </div>
          )}
        </>
      ) : (
        /* Show audio player when audio is available - replaces the upload area */
     <>
        <div className="p-4 bg-[#0E100F] rounded-lg border border-gray-700">
          <div className="flex items-center justify-between">
            {/* Audio Info */}
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">Recorded Audio</p>
              <p className="text-gray-400 text-xs">
                {audioFile instanceof Blob ? `${(audioFile.size / 1024).toFixed(1)} KB` : 'Audio preview'}
              </p>
            </div>

            {/* Play Button */}
            <button
              onClick={handlePlayClick}
              className="magic-button-simple border border-gray-500 p-2 rounded-lg text-sm ml-4"
            >{showAudioPlayer ? <Pause size={14} /> :  <Play size={14} />}
            
            </button>
          

            {/* Delete Button */}
            <button 
              className="ml-4 p-2 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-sm flex items-center gap-2"
              onClick={() => {
                setAudioFile(null);
                setAudioURL(null);
                setShowAudioPlayer(false);
              }}
            >
              <Trash2 size={14} />
             
            </button>
          </div>
 
        </div>
        <div className="flex w-full items-center justify-center" >
            <div
              onClick={handleUpload}
              className="gradient-magic-button1 mt-4 w-50 flex justify-center cursor-pointer border-gray-500 p-2 text-sm ml-4"
            ><span className="flex button-inner items-center gap-2" >Clone<FileVolume size={14} /></span>
            
            </div>
        </div>
        </>
        
      )
      }

      {/* Audio Player at Bottom */}
      {showAudioPlayer && audioURL && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 rounded-3xl shadow-lg w-full max-w-3xl bg-[#0E100F] border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white text-sm font-medium">Now Playing</span>
            <button 
              onClick={() => setShowAudioPlayer(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <audio 
            controls 
            autoPlay 
            src={audioURL} 
            className="w-full"
            onEnded={() => setShowAudioPlayer(false)}
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};
export default VoiceCloneUploader