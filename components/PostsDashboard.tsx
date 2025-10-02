'use client';

import React, { useState, useEffect } from 'react';
import { Post, PostsQueryParams, PaginatedPostsResponse } from '@/types/posts';
import { useAuth } from '@/contexts/AuthContext';
import { postsService } from '@/lib/postsService';
import PostCard from './PostCard';
import PostForm from './PostForm';

type ViewMode = 'all' | 'my-posts' | 'pinned';
type SortBy = 'createdAt' | 'updatedAt' | 'title';
type SortOrder = 'asc' | 'desc';

export default function PostsDashboard() {
  const { userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | undefined>(undefined);
  
  // Filters and pagination
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: PostsQueryParams = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (viewMode === 'pinned') {
        params.pinned = true;
      }

      let response: PaginatedPostsResponse;
      
      if (viewMode === 'my-posts') {
        response = await postsService.getMyPosts(params);
      } else {
        response = await postsService.getPosts(params);
      }

      setPosts(response.posts);
      setTotalPages(response.totalPages);
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [viewMode, sortBy, sortOrder, currentPage]);

  const handleCreatePost = () => {
    setEditingPost(undefined);
    setShowForm(true);
  };

  const handleEditPost = (post: Post) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleFormSubmit = (post: Post) => {
    setShowForm(false);
    setEditingPost(undefined);
    
    if (editingPost) {
      // Update existing post in the list
      setPosts(prevPosts => 
        prevPosts.map(p => p.id === post.id ? post : p)
      );
    } else {
      // Add new post to the beginning of the list
      setPosts(prevPosts => [post, ...prevPosts]);
    }
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prevPosts => prevPosts.filter(p => p.id !== postId));
  };

  const handlePinPost = (postId: string, pinned: boolean) => {
    setPosts(prevPosts => 
      prevPosts.map(p => p.id === postId ? { ...p, pinned } : p)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: SortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  if (!userProfile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to view posts</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Posts Dashboard</h1>
        <button
          onClick={handleCreatePost}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Create Post
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* View Mode */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">View:</label>
            <select
              value={viewMode}
              onChange={(e) => handleViewModeChange(e.target.value as ViewMode)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm text-black"
            >
              <option value="all">All Posts</option>
              <option value="my-posts">My Posts</option>
              <option value="pinned">Pinned Posts</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <button
              onClick={() => handleSortChange('createdAt')}
              className={`px-3 py-1 text-sm rounded-md ${
                sortBy === 'createdAt'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Created {sortBy === 'createdAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              onClick={() => handleSortChange('updatedAt')}
              className={`px-3 py-1 text-sm rounded-md ${
                sortBy === 'updatedAt'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Updated {sortBy === 'updatedAt' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
            <button
              onClick={() => handleSortChange('title')}
              className={`px-3 py-1 text-sm rounded-md ${
                sortBy === 'title'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Title {sortBy === 'title' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading posts...</span>
          </div>
        </div>
      )}

      {/* Posts List */}
      {!loading && (
        <>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {viewMode === 'my-posts' 
                  ? "You haven't created any posts yet."
                  : viewMode === 'pinned'
                  ? "No pinned posts found."
                  : "No posts found."
                }
              </p>
              {viewMode === 'my-posts' && (
                <button
                  onClick={handleCreatePost}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                  onPin={handlePinPost}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Post Form Modal */}
      {showForm && (
        <PostForm
          post={editingPost}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingPost(undefined);
          }}
        />
      )}
    </div>
  );
}