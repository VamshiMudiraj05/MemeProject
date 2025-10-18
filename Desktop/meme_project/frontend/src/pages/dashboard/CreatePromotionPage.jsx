import React, { useState, useRef } from 'react';
import Layout from '../../components/layout/Layout';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, UploadCloud, Calendar, DollarSign, Tag, FileText, Globe } from 'lucide-react';
import { createPromotion } from '../../services/api';

function CreatePromotionPage() {
  const navigate = useNavigate();
  const [promotionData, setPromotionData] = useState({
    title: '',
    description: '',
    platforms: [],
    budget: '',
    startDate: '',
    endDate: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };

  const handlePlatformChange = (platform) => {
    setPromotionData((prevState) => ({
      ...prevState,
      platforms: prevState.platforms.includes(platform)
        ? prevState.platforms.filter((p) => p !== platform)
        : [...prevState.platforms, platform],
    }));
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const promotionDataToSend = {
        ...promotionData,
        budget: promotionData.budget, // Fix the typo in 'budget' to 'budget'
        briefFile: selectedFile,
      };

      const result = await createPromotion(promotionDataToSend);
      console.log('Promotion created successfully:', result);
      // Navigate to dashboard or a success page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('An error occurred while creating the promotion.');
    }
  };

  const platforms = ['Instagram', 'Youtube', 'Twitter'];

  return (
    <Layout>
      <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6 flex items-center">
            <PlusCircle className="h-8 w-8 mr-3 text-orange-500" />
            Create New Promotion
          </h1>

          <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={promotionData.title}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Summer Collection Campaign"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <textarea
                    name="description"
                    id="description"
                    rows="4"
                    value={promotionData.description}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="Describe your promotion in detail..."
                    required
                  ></textarea>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Target Platforms</label>
                <div className="mt-2 flex flex-wrap gap-3">
                  {platforms.map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformChange(platform)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                        promotionData.platforms.includes(platform)
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Budget (INR)</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-500" aria-hidden="true" />
                  </div>
                  <input
                    type="number"
                    name="budget"
                    id="budget"
                    value={promotionData.budget}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                    placeholder="e.g., 50000"
                    required
                    min="0"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="startDate"
                      id="startDate"
                      value={promotionData.startDate}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-500" aria-hidden="true" />
                    </div>
                    <input
                      type="date"
                      name="endDate"
                      id="endDate"
                      value={promotionData.endDate}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div>
                <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-300 mb-1">Upload Brief or Media</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                    <div className="flex text-sm text-gray-400">
                      <label 
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                      >
                        <span onClick={handleFileButtonClick}>Upload a file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          onChange={handleFileChange}
                          ref={fileInputRef}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    {selectedFile && <p className="text-sm text-gray-400">File selected: {selectedFile.name}</p>}
                    {!selectedFile && <p className="text-xs text-gray-500">PNG, JPG, GIF, PDF, DOCX up to 10MB</p>}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CreatePromotionPage; 