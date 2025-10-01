'use client';

import React, { useState, useRef } from 'react';
import { Post, PostFormData } from '@/types/posts';
import { postsService } from '@/lib/postsService';

interface PostFormProps {
  post?: Post;
  onSubmit: (post: Post) => void;
  onCancel: () => void;
}

export default function PostForm({ post, onSubmit, onCancel }: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    image: undefined,
  });
  const [currentImageURL, setCurrentImageURL] = useState(post?.imageURL || '');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file,
      }));

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentImageURL(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: undefined,
    }));
    setCurrentImageURL('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageURL = currentImageURL;

      // Upload image if a new one was selected
      if (formData.image) {
        setUploadProgress(true);
        const uploadResult = await postsService.uploadImage(formData.image, 'posts');
        imageURL = uploadResult.url;
        setUploadProgress(false);
      }

      // Create or update post
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        imageURL: imageURL || undefined,
      };

      let resultPost: Post;
      if (post) {
        // Update existing post
        resultPost = await postsService.updatePost(post.id, postData);
      } else {
        // Create new post
        resultPost = await postsService.createPost(postData);
      }

      onSubmit(resultPost);
    } catch (error) {
      console.error('Error saving post:', error);
      alert(error instanceof Error ? error.message : 'Failed to save post');
    } finally {
      setLoading(false);
      setUploadProgress(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {post ? 'Edit Post' : 'Create New Post'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter post title..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Write your post content..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (optional)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Image Preview */}
              {currentImageURL && (
                <div className="mt-3">
                  <div className="relative inline-block">
                    <img
                      src={currentImageURL}
                      alt="Preview"
                      className="max-w-full max-h-48 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="text-center">
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-sm text-gray-600">Uploading image...</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadProgress}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}