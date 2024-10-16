import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '../../services/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [pin, setPin] = useState(Array(6).fill(''));
    const [errorMessage, setErrorMessage] = useState('');
    const inputRefs = useRef([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handlePinChange = (e, index) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            let newPin = [...pin];
            newPin[index] = value;
            setPin(newPin);

            if (index < 5 && value) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (index > 0 && !pin[index]) {
                inputRefs.current[index - 1].focus();
            } else {
                let newPin = [...pin];
                newPin[index] = '';
                setPin(newPin);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const enteredPin = pin.join('');

        try {
            const response = await axios.post('http://localhost:5000/customers/login', { phone, pin: enteredPin });
            const { token, userId } = response.data;
            localStorage.setItem('customer-token',token)
            localStorage.setItem('customer-userId', userId);
            // Store the token in the Redux store
            dispatch(setToken(token));

            // Redirect the user to the dashboard
            navigate('/dashboard'); // Redirect to dashboard or another page
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Invalid credentials. Please try again.');
        }
    };

    useEffect(() => {
        inputRefs.current[0].focus();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-500">
            <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-10 w-full max-w-lg">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            id="phone"
                            name="phone"
                            type="text"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={handlePhoneChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
                            Enter 6-digit MPIN
                        </label>
                        <div className="flex justify-between">
                            {Array(6)
                                .fill('')
                                .map((_, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        className="w-12 h-12 text-center text-black border-b-2 rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 text-2xl"
                                        type="text"
                                        maxLength={1}
                                        value={pin[index]}
                                        onChange={(e) => handlePinChange(e, index)}
                                        onKeyDown={(e) => handleKeyDown(e, index)}
                                    />
                                ))}
                        </div>
                        {errorMessage && <p className="text-red-500 text-center mt-4">{errorMessage}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline w-full"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
                <p className="text-white text-center mt-4">
                    Don't have an account? <a href="/signup" className="underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
