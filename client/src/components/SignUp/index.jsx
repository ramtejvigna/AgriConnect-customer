import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        location: '',
        preferredProducts: '', // Assuming you might add this in future steps
        pin: '',
        confirmPin: '',
    });

    const [currentPage, setCurrentPage] = useState(1);
    const pinRefs = useRef([]);
    const confirmPinRefs = useRef([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handlePinChange = (e, index, type) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value)) {
            let newPin = type === 'pin' ? formData.pin : formData.confirmPin;
            newPin = newPin.substring(0, index) + value + newPin.substring(index + 1);
            setFormData((prevData) => ({
                ...prevData,
                [type]: newPin,
            }));

            if (index < 5 && value) {
                if (type === 'pin') {
                    pinRefs.current[index + 1].focus();
                } else {
                    confirmPinRefs.current[index + 1].focus();
                }
            }
        }
    };

    const handleKeyDown = (e, index, type) => {
        if (e.key === 'Backspace') {
            if (index > 0 && !formData[type][index]) {
                if (type === 'pin') {
                    pinRefs.current[index - 1].focus();
                } else {
                    confirmPinRefs.current[index - 1].focus();
                }
            } else {
                let newPin = type === 'pin' ? formData.pin : formData.confirmPin;
                newPin = newPin.substring(0, index) + '' + newPin.substring(index + 1);
                setFormData((prevData) => ({
                    ...prevData,
                    [type]: newPin,
                }));
            }
        }
    };

    const handleNext = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevious = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.pin !== formData.confirmPin) {
            alert('PIN and Confirm PIN do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/customers/register', formData);
            const { token, userId } = response.data;

            // Store the token in local storage or cookies
            localStorage.setItem('customer-token', token);
            localStorage.setItem('customer-userId', userId);

            // Redirect the user or perform other actions
            alert('Sign up successful!');
            window.location.href = '/dashboard'; // Redirect to dashboard or another page
        } catch (error) {
            console.error('Error registering user:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        if (currentPage === 3) {
            pinRefs.current[0].focus();
        }
    }, [currentPage]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
            <div className="bg-white/30 backdrop-blur-lg shadow-lg rounded-lg p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-white mb-6">Customer Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    {currentPage === 1 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="phone"
                                    name="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="location">
                                    Location
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="Enter your location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg w-full"
                                    type="button"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {currentPage === 2 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="preferredProducts">
                                    Preferred Products
                                </label>
                                <input
                                    className="w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    id="preferredProducts"
                                    name="preferredProducts"
                                    type="text"
                                    placeholder="Enter your preferred products"
                                    value={formData.preferredProducts}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handleNext}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                    {currentPage === 3 && (
                        <>
                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="pin">
                                    Set New PIN
                                </label>
                                <div className="flex justify-between">
                                    {Array(6)
                                        .fill('')
                                        .map((_, index) => (
                                            <input
                                                key={index}
                                                ref={el => pinRefs.current[index] = el}
                                                className="w-12 h-12 text-center text-black border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
                                                type="text"
                                                maxLength={1}
                                                value={formData.pin[index] || ''}
                                                onChange={(e) => handlePinChange(e, index, 'pin')}
                                                onKeyDown={(e) => handleKeyDown(e, index, 'pin')}
                                                required
                                            />
                                        ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-white text-sm font-bold mb-2" htmlFor="confirmPin">
                                    Confirm PIN
                                </label>
                                <div className="flex justify-between">
                                    {Array(6)
                                        .fill('')
                                        .map((_, index) => (
                                            <input
                                                key={index}
                                                ref={el => confirmPinRefs.current[index] = el}
                                                className="w-12 h-12 text-center text-black border-b-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-2xl"
                                                type="text"
                                                maxLength={1}
                                                value={formData.confirmPin[index] || ''}
                                                onChange={(e) => handlePinChange(e, index, 'confirmPin')}
                                                onKeyDown={(e) => handleKeyDown(e, index, 'confirmPin')}
                                                required
                                            />
                                        ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg"
                                    type="button"
                                    onClick={handlePrevious}
                                >
                                    Previous
                                </button>
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg"
                                    type="submit"
                                >
                                    Sign Up
                                </button>
                            </div>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default SignUp;
