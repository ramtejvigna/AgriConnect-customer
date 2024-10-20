import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, Filter, Search } from 'lucide-react';
import axios from 'axios';

const BuyCrops = () => {
  const [crops, setCrops] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterQuery, setFilterQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/customers/available');
        setCrops(response.data);
      } catch (error) {
        console.error('Error fetching crops:', error);
      }
    };

    fetchCrops();
  }, []);

  const sortedAndFilteredCrops = crops
    .filter(crop =>
      crop.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      crop.farmer.toLowerCase().includes(filterQuery.toLowerCase()) ||
      crop.location.toLowerCase().includes(filterQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'farmer') return a.farmer.localeCompare(b.farmer);
      if (sortBy === 'location') return a.location.localeCompare(b.location);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <motion.h2
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center text-green-600"
      >
        Available Crops
      </motion.h2>

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Search crops..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex items-center">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <Filter size={20} className="mr-2" />
            Filters
            <ChevronDown
              size={20}
              className={`ml-2 transform transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 bg-white p-4 rounded-lg shadow-md"
          >
            <div className="flex flex-wrap gap-4">
              {['name', 'farmer', 'location', 'price'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg ${
                    sortBy === option ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                  } capitalize`}
                >
                  Sort by {option}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedAndFilteredCrops.map((crop, index) => (
          <motion.div
            key={crop.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedCrop(crop)}
          >
            <img src={crop.image} alt={crop.name} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-2xl font-semibold text-green-600 mb-2">{crop.name}</h3>
              <p className="text-gray-600 mb-2">Farmer: {crop.farmer}</p>
              <p className="text-gray-600 mb-2">Location: {crop.location}</p>
              <p className="text-green-500 font-semibold">${crop.price.toFixed(2)} / unit</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedCrop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCrop(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-green-600">{selectedCrop.name}</h3>
                <button
                  onClick={() => setSelectedCrop(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <img
                src={selectedCrop.image}
                alt={selectedCrop.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-2">Farmer: {selectedCrop.farmer}</p>
              <p className="text-gray-600 mb-2">Location: {selectedCrop.location}</p>
              <p className="text-green-500 font-semibold mb-2">
                ${selectedCrop.price.toFixed(2)} / unit
              </p>
              <p className="text-gray-600 mb-4">Quantity available: {selectedCrop.quantity} units</p>
              <button
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors duration-200"
                onClick={() => alert(`Requested ${selectedCrop.name} from ${selectedCrop.farmer}`)}
              >
                Request Crop
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BuyCrops;
