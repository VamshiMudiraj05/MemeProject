const API_URL = 'http://localhost:5000/api';

// Auth API calls
export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    if (data.details && Array.isArray(data.details)) {
      throw new Error(data.details.join(', '));
    }
    throw new Error(data.error || 'Registration failed');
  }
  
  return data;
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }
  
  return data;
};

export const updateUser = async (userData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/auth/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user');
  }

  return data;
};

// Influencer API calls
export const getAllInfluencers = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/influencers`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || data.error || 'Failed to fetch influencers');
    }
    
    return data.data || [];
  } catch (error) {
    console.error('API Error [getAllInfluencers]:', error);
    throw new Error(error.message || 'Failed to fetch influencers. Please try again.');
  }
};

export const getInfluencerById = async (id) => {
  try {
    if (!id) {
      throw new Error('Influencer ID is required');
    }
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/influencers/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Influencer not found');
      }
      throw new Error(data.message || data.error || 'Failed to fetch influencer');
    }
    
    return data.data || null;
  } catch (error) {
    console.error(`API Error [getInfluencerById:${id}]:`, error);
    throw new Error(error.message || 'Failed to fetch influencer details. Please try again.');
  }
};

// Promotion API calls
// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Private (Influencers)
export const getPromotions = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/promotions`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch promotions');
  }
  
  return data;
};

export const createPromotion = async (promotionData) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  
  // Append all promotion data to formData
  Object.entries(promotionData).forEach(([key, value]) => {
    if (key === 'platforms' && Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/promotions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to create promotion');
  }
  
  return data;
};

export const getBrandPromotions = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/promotions/brand`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch promotions');
    }

    return data;
  } catch (error) {
    console.error('API Error [getBrandPromotions]:', error);
    throw new Error(error.message || 'Failed to fetch promotions. Please try again.');
  }
};

// File upload API call
export const uploadFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'File upload failed');
    }

    return data;
  } catch (error) {
    console.error('API Error [uploadFile]:', error);
    throw new Error(error.message || 'Failed to upload file. Please try again.');
  }
};

// Application API calls
export const applyForPromotion = async (applicationData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(applicationData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to apply for promotion');
    }

    return data;
  } catch (error) {
    console.error('API Error [applyForPromotion]:', error);
    throw new Error(error.message || 'Failed to apply for promotion. Please try again.');
  }
};

export const getInfluencerApplications = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/applications/influencer`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch applications');
    }

    return data.data || [];
  } catch (error) {
    console.error('API Error [getInfluencerApplications]:', error);
    throw new Error(error.message || 'Failed to fetch applications. Please try again.');
  }
};

export const getApplicationsForPromotion = async (promotionId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/applications/promotion/${promotionId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch applications');
    }

    return data.data || [];
  } catch (error) {
    console.error('API Error [getApplicationsForPromotion]:', error);
    throw new Error(error.message || 'Failed to fetch applications. Please try again.');
  }
};

export const updateApplicationStatus = async (applicationId, status) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/applications/${applicationId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update application status');
    }

    return data;
  } catch (error) {
    console.error('API Error [updateApplicationStatus]:', error);
    throw new Error(error.message || 'Failed to update application status. Please try again.');
  }
};

// Messaging API calls
export const sendMessage = async (messageData) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    
    // Append message data
    Object.entries(messageData).forEach(([key, value]) => {
      if (key !== 'attachment' && value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    // Append file if present
    if (messageData.attachment) {
      formData.append('attachment', messageData.attachment);
    }

    const response = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message');
    }

    return data;
  } catch (error) {
    console.error('API Error [sendMessage]:', error);
    throw new Error(error.message || 'Failed to send message. Please try again.');
  }
};

export const getConversations = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/conversations`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch conversations');
    }

    return data.data || [];
  } catch (error) {
    console.error('API Error [getConversations]:', error);
    throw new Error(error.message || 'Failed to fetch conversations. Please try again.');
  }
};

export const getConversationMessages = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/conversation/${conversationId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch messages');
    }

    return data.data || [];
  } catch (error) {
    console.error('API Error [getConversationMessages]:', error);
    throw new Error(error.message || 'Failed to fetch messages. Please try again.');
  }
};

export const markMessagesAsRead = async (conversationId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/read`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ conversationId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to mark messages as read');
    }

    return data;
  } catch (error) {
    console.error('API Error [markMessagesAsRead]:', error);
    throw new Error(error.message || 'Failed to mark messages as read. Please try again.');
  }
};

export const getUnreadCount = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/messages/unread-count`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch unread count');
    }

    return data.unreadCount || 0;
  } catch (error) {
    console.error('API Error [getUnreadCount]:', error);
    throw new Error(error.message || 'Failed to fetch unread count. Please try again.');
  }
};