'use client';

import React, { useState, useRef } from 'react';
import { postsService } from '@/lib/postsService';

interface ImageUploadProps {
  currentImageURL?: string;
  onImageUpload: (imageURL: string) => void;
  onImageRemove?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  folder?: 'profiles' | 'posts';
}

export default function ImageUpload({
  currentImageURL,
  onImageUpload,
  onImageRemove,
  className = '',
  size = 'md',
  folder = 'profiles'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate upload progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const result = await postsService.uploadImage(file, folder);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Complete the upload
      setTimeout(() => {
        onImageUpload(result.url);
        setUploadProgress(0);
      }, 300);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveImage = () => {
    setError(null);
    onImageRemove?.();
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
          ${sizeClasses[size]} 
          relative border-2 border-dashed border-gray-300 rounded-full 
          flex items-center justify-center cursor-pointer
          hover:border-gray-400 transition-colors
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onClick={triggerFileSelect}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Current Image */}
        {currentImageURL && !uploading && (
          <img
            src={currentImageURL}
            alt="Profile"
            className={`${sizeClasses[size]} rounded-full object-cover`}
          />
        )}

        {/* Upload Placeholder */}
        {!currentImageURL && !uploading && (
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-1">📷</div>
            <div className="text-xs text-gray-500">Upload</div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-full">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-1">
                <svg
                  className="w-full h-full transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="16"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${uploadProgress}, 100`}
                    className="transition-all duration-300"
                  />
                </svg>
              </div>
              <div className="text-xs text-gray-600">{uploadProgress}%</div>
            </div>
          </div>
        )}

        {/* Remove Button */}
        {currentImageURL && !uploading && onImageRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveImage();
            }}
            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 z-10"
          >
            ✕
          </button>
        )}

        {/* Edit Icon Overlay */}
        {currentImageURL && !uploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">✏️</span>
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Message */}
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Upload Instructions */}
      {!uploading && (
        <div className="mt-2 text-xs text-gray-500 text-center">
          {currentImageURL ? 'Click to change' : 'Click or drag to upload'}
          <br />
          Max 5MB • JPG, PNG, GIF
        </div>
      )}
    </div>
  );
}