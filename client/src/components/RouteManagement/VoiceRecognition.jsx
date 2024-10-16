import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UilMicrophone, UilMicrophoneSlash } from '@iconscout/react-unicons';

const VoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (isListening) {
            const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.lang = 'en-US'; // English language code
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                handleCommand(transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        }
    }, [isListening]);

    const handleCommand = (command) => {
        if (command.includes('open crop disease') || command.includes('disease')) {
            navigate('/disease');
            speak('Opened crop disease page');
        } else if (command.includes('open crop recommendation') || command.includes('recommendation')) {
            navigate('/recommendation');
            speak('Opened crop recommendation page');
        } else if (command.includes('open crop yield') || command.includes('yield')) {
            navigate('/yield');
            speak('Opened crop yield page');
        } else if (command.includes('open dashboard') || command.includes('dashboard')) {
            navigate('/dashboard');
            speak('Opened dashboard page');
        } else if (command.includes('open home') || command.includes('home')) {
            navigate('/home');
            speak('Opened home page');
        }
    };

    const speak = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <button
            className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
            onClick={() => setIsListening(!isListening)}
        >
            {isListening ? (
                <UilMicrophoneSlash className="text-2xl" />
            ) : (
                <UilMicrophone className="text-2xl" />
            )}
        </button>
    );
};

export default VoiceRecognition;
