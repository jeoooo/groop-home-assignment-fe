'use client';

import { apiClient } from '@/lib/apiClient';
import { API_ENDPOINTS } from '@/lib/api';
import { 
  Post, 
  CreatePostData, 
  UpdatePostData, 
  PostsQueryParams, 
  PaginatedPostsResponse,
  ImageUploadResult
} from '@/types/posts';

export class PostsService {
  /**
   * Get all posts with pagination and filtering
   */
  async getPosts(params: PostsQueryParams = {}): Promise<PaginatedPostsResponse> {
    const queryString = new URLSearchParams();
    
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
    if (params.authorId) queryString.append('authorId', params.authorId);
    if (params.pinned !== undefined) queryString.append('pinned', params.pinned.toString());

    const endpoint = queryString.toString() 
      ? `${API_ENDPOINTS.POSTS.LIST}?${queryString.toString()}`
      : API_ENDPOINTS.POSTS.LIST;

    const response = await apiClient.get<PaginatedPostsResponse>(endpoint);
    
    if (response.success && response.data) {
      // Convert date strings to Date objects
      const posts = response.data.posts.map(post => ({
        ...post,
        timestamp: new Date(post.timestamp),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
      
      return {
        ...response.data,
        posts,
      };
    }
    
    throw new Error(response.error || 'Failed to fetch posts');
  }

  /**
   * Get user's posts
   */
  async getMyPosts(params: PostsQueryParams = {}): Promise<PaginatedPostsResponse> {
    const queryString = new URLSearchParams();
    
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
    if (params.pinned !== undefined) queryString.append('pinned', params.pinned.toString());

    const endpoint = queryString.toString() 
      ? `${API_ENDPOINTS.POSTS.MY_POSTS}?${queryString.toString()}`
      : API_ENDPOINTS.POSTS.MY_POSTS;

    const response = await apiClient.get<PaginatedPostsResponse>(endpoint);
    
    if (response.success && response.data) {
      // Convert date strings to Date objects
      const posts = response.data.posts.map(post => ({
        ...post,
        timestamp: new Date(post.timestamp),
        createdAt: new Date(post.createdAt),
        updatedAt: new Date(post.updatedAt),
      }));
      
      return {
        ...response.data,
        posts,
      };
    }
    
    throw new Error(response.error || 'Failed to fetch posts');
  }

  /**
   * Get a single post by ID
   */
  async getPost(id: string): Promise<Post> {
    const response = await apiClient.get<Post>(API_ENDPOINTS.POSTS.GET(id));
    
    if (response.success && response.data) {
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    }
    
    throw new Error(response.error || 'Failed to fetch post');
  }

  /**
   * Create a new post
   */
  async createPost(postData: CreatePostData): Promise<Post> {
    const response = await apiClient.post<Post>(API_ENDPOINTS.POSTS.CREATE, postData);
    
    if (response.success && response.data) {
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    }
    
    throw new Error(response.error || 'Failed to create post');
  }

  /**
   * Update an existing post
   */
  async updatePost(id: string, updateData: UpdatePostData): Promise<Post> {
    const response = await apiClient.put<Post>(API_ENDPOINTS.POSTS.UPDATE(id), updateData);
    
    if (response.success && response.data) {
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    }
    
    throw new Error(response.error || 'Failed to update post');
  }

  /**
   * Delete a post
   */
  async deletePost(id: string): Promise<void> {
    const response = await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id));
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete post');
    }
  }

  /**
   * Pin/unpin a post (admin only)
   */
  async pinPost(id: string, pinned: boolean): Promise<Post> {
    const response = await apiClient.patch<Post>(API_ENDPOINTS.POSTS.PIN(id), { pinned });
    
    if (response.success && response.data) {
      return {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt),
      };
    }
    
    throw new Error(response.error || 'Failed to pin post');
  }

  /**
   * Upload an image
   */
  async uploadImage(file: File, folder: 'profiles' | 'posts' = 'posts'): Promise<ImageUploadResult> {
    try {
      const response = await apiClient.uploadFile<ImageUploadResult>(
        API_ENDPOINTS.POSTS.UPLOAD, 
        file, 
        { folder }
      );
      
      if (response.success && response.data) {
        return response.data;
      }
      
      throw new Error(response.error || 'Failed to upload image');
    } catch (error) {
      console.error('Upload failed, using fallback:', error);
      
      // Fallback: Create a mock image URL for development
      // In a real app, you might want to store the image as base64 or use a different service
      const mockImageURL = `data:${file.type};base64,${await this.fileToBase64(file)}`;
      
      return {
        url: mockImageURL,
        filename: file.name,
        size: file.size
      };
    }
  }

  /**
   * Convert file to base64 (fallback helper)
   */
  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}

export const postsService = new PostsService();