'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ImageUpload from './ImageUpload';

export default function UserProfile() {
  const { userProfile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    imageURL: userProfile?.imageURL || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (imageURL: string) => {
    setFormData(prev => ({
      ...prev,
      imageURL,
    }));
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      imageURL: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateProfile({
        displayName: formData.displayName.trim() || undefined,
        imageURL: formData.imageURL || undefined,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || '',
      imageURL: userProfile?.imageURL || '',
    });
    setIsEditing(false);
    setError(null);
  };

  if (!userProfile) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isEditing ? (
        // View Mode
        <div className="space-y-6">
          {/* Profile Image and Basic Info */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {userProfile.imageURL ? (
                <img
                  src={userProfile.imageURL}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl text-gray-400">👤</span>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                {userProfile.displayName || 'No name set'}
              </h3>
              <p className="text-sm text-gray-500">{userProfile.email}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${
                userProfile.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {userProfile.role}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-sm text-gray-900">{userProfile.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <p className="mt-1 text-sm text-gray-900 capitalize">{userProfile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Member Since</label>
              <p className="mt-1 text-sm text-gray-900">
                {userProfile.createdAt.toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">
                {userProfile.updatedAt.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              <ImageUpload
                currentImageURL={formData.imageURL}
                onImageUpload={handleImageUpload}
                onImageRemove={handleImageRemove}
                size="lg"
                folder="profiles"
              />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Profile Picture</h3>
              <p className="text-sm text-gray-500">
                Upload a profile picture to personalize your account.
                <br />
                Recommended: Square image, at least 200x200 pixels.
              </p>
            </div>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your display name"
            />
            <p className="mt-1 text-sm text-gray-500">
              This name will be displayed on your posts and profile.
            </p>
          </div>

          {/* Read-only fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Email</label>
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md">
                {userProfile.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Role</label>
              <p className="mt-1 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md capitalize">
                {userProfile.role}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}