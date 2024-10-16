import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UilMicrophone, UilMicrophoneSlash } from '@iconscout/react-unicons';
import { useNavigate } from 'react-router-dom';

const VoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const navigate = useNavigate();

  const handleAudioSubmit = async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    try {
      const response = await axios.post('http://127.0.0.1:5000/voice-command', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      const { route, message } = response.data;
      alert(message); // Optionally show the response
      navigate(route); // Navigate based on the route
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  const startListening = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          handleAudioSubmit(audioBlob);
        };
        mediaRecorder.start();
        setIsListening(true);
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            stopListening();
          }
        }, 4000);
      })
      .catch((err) => {
        console.error('Failed to access microphone:', err);
        alert('Failed to access microphone. Please allow microphone permissions.');
      });
  };

  const stopListening = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div>
      <button
        className={`fixed bottom-4 right-4 p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 ${isListening ? 'bg-red-500' : 'bg-blue-500'} text-white`}
        onClick={toggleListening}
      >
        {isListening ? (
          <UilMicrophoneSlash className="text-2xl" />
        ) : (
          <UilMicrophone className="text-2xl" />
        )}
      </button>
      {isListening && (
        <button
          className="fixed bottom-4 right-20 bg-red-500 text-white p-4 rounded-full shadow-lg"
          onClick={stopListening}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default VoiceRecognition;
