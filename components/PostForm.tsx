'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
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
        try {
          const uploadResult = await postsService.uploadImage(formData.image, 'posts');
          imageURL = uploadResult.url;
        } catch (uploadError) {
          console.warn('Image upload failed, proceeding without image:', uploadError);
          // Continue without image instead of failing the entire post creation
          imageURL = '';
        }
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
    <div className="fixed inset-0 bg-black bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border border-gray-600 w-11/12 max-w-2xl shadow-lg rounded-md bg-black">
        <div className="mt-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white font-primary">
              {post ? 'Edit Post' : 'Create New Post'}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                placeholder="Enter post title..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-white mb-1">
                Content *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent placeholder-gray-400"
                placeholder="Write your post content..."
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Image (optional)
              </label>
              <div className="space-y-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-white file:text-black hover:file:bg-gray-200"
                />
                <p className="text-xs text-gray-400">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Image Preview */}
              {currentImageURL && (
                <div className="mt-3">
                  <div className="relative inline-block">
                    <Image
                      src={currentImageURL}
                      alt="Preview"
                      width={400}
                      height={192}
                      className="max-w-full max-h-48 rounded-lg object-cover"
                      unoptimized={currentImageURL.startsWith('data:')}
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-gray-800 border border-white"
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
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="ml-2 text-sm text-white">Uploading image...</span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-black bg-white border border-gray-600 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploadProgress}
                className="px-4 py-2 text-sm font-medium text-white bg-black border border-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50"
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