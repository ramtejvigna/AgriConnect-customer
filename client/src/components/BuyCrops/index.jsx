import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BuyCrops = () => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch crops data from the backend
    useEffect(() => {
        const fetchCrops = async () => {
            try {
                const response = await axios.get('http://localhost:5000/crops/available');
                setCrops(response.data);
                setLoading(false);
            } catch (error) {
                setError('Failed to load crops');
                setLoading(false);
            }
        };

        fetchCrops();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading crops...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-xl font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-green-600">Available Crops</h2>

            {crops.length === 0 ? (
                <div className="flex justify-center">
                    <p className="text-xl text-gray-500">No crops available for purchase at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {crops.map((crop) => (
                        <div
                            key={crop._id}
                            className="border border-gray-300 rounded-lg shadow-lg p-6 bg-white hover:shadow-2xl transition-shadow duration-300"
                        >
                            <h3 className="text-xl font-semibold text-green-500 mb-4">{crop.name}</h3>
                            <div className="text-gray-700">
                                <p><strong>Farmer:</strong> {crop.farmer.name}</p>
                                <p><strong>Phone:</strong> {crop.farmer.phone}</p>
                                <p><strong>Location:</strong> {crop.farmer.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BuyCrops;
