import { useState } from 'react';
import { Laugh, ArrowLeft } from 'lucide-react';
import StepIndicator from '../components/registration/StepIndicator';
import { registerUser, uploadFile } from '../services/api';

// Influencer Steps
import PageDetailsStep from '../components/registration/influencer/PageDetailsStep';
import PricingStep from '../components/registration/influencer/PricingStep';
import VerificationStep from '../components/registration/influencer/VerificationStep';

// Brand Steps
import BrandDetailsStep from '../components/registration/brand/BrandDetailsStep';

// User Type Selection
import UserTypeSelector from '../components/registration/UserTypeSelector';

export default function GetStarted() {
  const [userType, setUserType] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    // Common fields
    email: '',
    password: '',
    confirmPassword: '',
    
    // Influencer fields
    alias: '',
    instagram: '',
    followers: '',
    engagement: '',
    accountType: '',
    samplePosts: ['', '', ''],
    storyPrice: '',
    postPrice: '',
    reelPrice: '',
    negotiable: false,
    verificationScreenshot: null,
    bio: '',
    profilePic: null,
    
    // Brand fields
    fullName: '',
    companyName: '',
    industry: '',
    monthlyBudget: '',
    campaignDescription: '',
    logo: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'file' ? files[0] : 
              value
    }));
  };

  const handleArrayChange = (name, value, checked) => {
    setFormData(prev => {
      const array = [...(prev[name] || [])];
      if (checked) {
        array.push(value);
      } else {
        const index = array.indexOf(value);
        if (index > -1) array.splice(index, 1);
      }
      return { ...prev, [name]: array };
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => {
    // If going back from the combined account step, reset user type and go to step 1
    if (step === 2) {
      setUserType(null);
      setStep(1);
    } else {
      // Otherwise, just go back one step
      setStep(step - 1);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Basic client-side validation for required influencer fields
      if (userType === 'influencer') {
        if (!formData.alias || !formData.storyPrice || !formData.postPrice || !formData.reelPrice) {
          throw new Error('Please fill in all required fields: Alias, Story Price, Post Price, and Reel Price.');
        }
        // Validate samplePosts: ensure at least one non-empty URL is provided
        if (!formData.samplePosts || formData.samplePosts.filter(post => typeof post === 'string' && post.trim() !== '').length === 0) {
           throw new Error('Please provide at least one valid URL for Sample Posts.');
        }
      }

      // Handle file uploads first if they exist
      let uploadedFiles = {};
      
      if (userType === 'influencer') {
        if (formData.verificationScreenshot) {
          const verificationResult = await uploadFile(formData.verificationScreenshot);
          uploadedFiles.verificationScreenshot = {
            url: verificationResult.url,
            public_id: verificationResult.public_id
          };
        }
        if (formData.profilePic) {
          const profileResult = await uploadFile(formData.profilePic);
          uploadedFiles.profilePic = {
            url: profileResult.url,
            public_id: profileResult.public_id
          };
        }
      } else if (userType === 'brand') {
        if (formData.logo) {
          const logoResult = await uploadFile(formData.logo);
          uploadedFiles.logo = {
            url: logoResult.url,
            public_id: logoResult.public_id
          };
        }
      }

      // Prepare registration data
      const registrationData = {
        // Common user fields
        email: formData.email,
        password: formData.password,
        userType: userType,

        // Profile data based on user type
        ...(userType === 'influencer' ? {
          alias: formData.alias,
          instagram: formData.instagram,
          followers: formData.followers,
          engagement: formData.engagement,
          accountType: formData.accountType,
          // Format samplePosts as array of objects with url
          samplePosts: formData.samplePosts.filter(post => post.trim() !== '').map(post => ({ url: post, public_id: '' })), // Sending empty public_id for now
          pricing: {
            storyPrice: formData.storyPrice,
            postPrice: formData.postPrice,
            reelPrice: formData.reelPrice,
            negotiable: formData.negotiable,
            pricingNotes: formData.pricingNotes,
          },
          bio: formData.bio,
          ...uploadedFiles
        } : {
          fullName: formData.fullName,
          companyName: formData.companyName,
          instagram: formData.instagram,
          industry: formData.industry,
          monthlyBudget: formData.monthlyBudget,
          campaignDescription: formData.campaignDescription,
          ...uploadedFiles
        })
      };

      // Log registration data
      console.log('Registration data:', registrationData);

      // Register user
      const { success, token } = await registerUser(registrationData);
      
      if (success) {
        // Store the token in localStorage or your preferred storage
        localStorage.setItem('token', token);
        
        // Handle successful registration
        alert(`Registration complete! Welcome to MemEconomy ${userType === 'influencer' ? 'creator' : 'brand'}`);
        // Redirect to login page after successful registration
        window.location.href = '/login';
      } else {
        // This else block might be redundant if registerUser throws on error
        throw new Error('Registration failed. Please try again.');
      }
      
    } catch (error) {
      // Handle specific error messages
      if (error.message.includes('Email already registered')) {
        setError('This email is already registered. Please use a different email or try logging in.');
      } else if (error.message.includes('Validation Error') || error.message.includes('Cast to embedded failed') || error.message.includes('required')) {
         setError('Please fill in all required fields correctly and ensure data is in the correct format.');
      } 
      else {
        setError(error.message || 'Registration failed. Please try again.');
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderInitialStep = () => (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-white">Choose Account Type</h2>
      <UserTypeSelector 
        setUserType={setUserType} 
        nextStep={nextStep} 
      />
    </div>
  );

  // Combined Account Details step
  const renderAccountDetailsStep = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white ml-4">Account Details</h2>
      </div>
      <div className="space-y-6">
        {/* Name/Alias field - conditional based on user type */}
        {userType === 'influencer' ? (
          <div>
            <label className="block text-gray-300 mb-2">Full Name / Alias</label>
            <input
              type="text"
              name="alias"
              value={formData.alias}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Dank Memester"
              required
            />
          </div>
        ) : userType === 'brand' ? (
          <div>
            <label className="block text-gray-300 mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your full name"
              required
            />
          </div>
        ) : null}

        {/* Email, Password, Confirm Password fields */}
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
            required
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            required
            minLength="8"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
            required
            minLength="8"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:from-purple-600 hover:to-blue-500 transition-all duration-300"
        >
          Next: {userType === 'influencer' ? 'Page Details' : 'Brand Details'}
        </button>
      </div>
    </div>
  );

  const renderPageDetailsStep = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white ml-4">Page Details</h2>
      </div>
      <PageDetailsStep 
        formData={formData} 
        handleChange={handleChange} 
        handleArrayChange={handleArrayChange}
        prevStep={prevStep} // Keep prevStep here for navigation within influencer steps
        nextStep={nextStep} 
      />
    </div>
  );

  const renderPricingStep = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white ml-4">Pricing</h2>
      </div>
      <PricingStep 
        formData={formData} 
        handleChange={handleChange} 
        prevStep={prevStep} // Keep prevStep here
        nextStep={nextStep} 
      />
    </div>
  );

  const renderVerificationStep = () => (
    <div className="p-8">
       <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-white ml-4">Verification & Profile</h2>
      </div>
      <VerificationStep 
        formData={formData} 
        handleChange={handleChange} 
        prevStep={prevStep} // Keep prevStep here
        onSubmit={submitForm}
        loading={loading}
      />
    </div>
  );

  const renderBrandDetailsStep = () => (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <button
          type="button"
          onClick={prevStep}
          className="text-gray-400 hover:text-white transition-colors duration-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-white ml-4">Brand Details</h2>
      </div>
      <BrandDetailsStep 
        formData={formData} 
        handleChange={handleChange} 
        prevStep={prevStep} // Keep prevStep here
        onSubmit={submitForm}
        loading={loading}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Laugh className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-pink-500 to-blue-400">
              MemEconomy Registration
            </h1>
          </div>
          
          {/* Progress indicator */}
          <div className="flex justify-between items-center mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -z-10">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500" 
                style={{
                  width: 
                    step === 1 ? '0%' :
                    userType === 'influencer' ?
                      `${((step - 1) / 4) * 100}%` : // 4 steps after choosing type
                    userType === 'brand' ?
                      `${((step - 1) / 2) * 100}%` : // 2 steps after choosing type
                    '0%'
                }}
              ></div>
            </div>
            {/* Step Indicators */}
            {userType === 'influencer' ? (
              <>
                <StepIndicator number={1} active={step === 1} complete={step > 1} label="Choose Type" />
                <StepIndicator number={2} active={step === 2} complete={step > 2} label="Account" />
                <StepIndicator number={3} active={step === 3} complete={step > 3} label="Page Details" />
                <StepIndicator number={4} active={step === 4} complete={step > 4} label="Pricing" />
                <StepIndicator number={5} active={step === 5} complete={step > 5} label="Verification" />
              </>
            ) : userType === 'brand' ? (
              <>
                <StepIndicator number={1} active={step === 1} complete={step > 1} label="Choose Type" />
                <StepIndicator number={2} active={step === 2} complete={step > 2} label="Account" />
                <StepIndicator number={3} active={step === 3} complete={step > 3} label="Brand Details" />
              </>
            ) : (
              <>
                {/* Initial state before user type is selected */}
                <StepIndicator number={1} active={step === 1} label="Choose Type" />
                <StepIndicator number={2} active={step === 2} label="Account" />
              </>
            )}
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Form content */}
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <form onSubmit={submitForm}>
            {step === 1 && renderInitialStep()}
            {step === 2 && renderAccountDetailsStep()} {/* Use combined account step */}
            {step === 3 && userType === 'influencer' && renderPageDetailsStep()}
            {step === 4 && userType === 'influencer' && renderPricingStep()}
            {step === 5 && userType === 'influencer' && renderVerificationStep()}
            {step === 3 && userType === 'brand' && renderBrandDetailsStep()}
          </form>
        </div>
      </div>
    </div>
  );
}