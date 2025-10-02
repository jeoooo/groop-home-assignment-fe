'use client';

import React, { useState } from 'react';
import { Post } from '@/types/posts';
import { useAuth } from '@/contexts/AuthContext';
import { postsService } from '@/lib/postsService';
import { Pencil, Trash } from "@phosphor-icons/react";

interface PostCardProps {
  post: Post;
  onEdit?: (post: Post) => void;
  onDelete?: (postId: string) => void;
  onPin?: (postId: string, pinned: boolean) => void;
}

export default function PostCard({ post, onEdit, onDelete, onPin }: PostCardProps) {
  const { userProfile } = useAuth();
  const [loading, setLoading] = useState(false);

  const isOwner = userProfile?.uid === post.authorId;
  const isAdmin = userProfile?.role === 'admin';
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;
  const canPin = isAdmin;

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    try {
      await postsService.deletePost(post.id);
      onDelete?.(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const handlePin = async () => {
    setLoading(true);
    try {
      const updatedPost = await postsService.pinPost(post.id, !post.pinned);
      onPin?.(post.id, updatedPost.pinned);
    } catch (error) {
      console.error('Error pinning post:', error);
      alert('Failed to pin post');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${post.pinned ? 'ring-2 ring-yellow-400' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
            {post.pinned && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                📌 Pinned
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{post.authorName}</span>
            <span className="mx-2">•</span>
            <span>{formatDate(post.timestamp)}</span>
            {post.updatedAt.getTime() !== post.createdAt.getTime() && (
              <>
                <span className="mx-2">•</span>
                <span className="italic">edited</span>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {canPin && (
            <button
              onClick={handlePin}
              disabled={loading}
              className={`p-2 rounded-md text-sm font-medium ${
                post.pinned
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } disabled:opacity-50`}
              title={post.pinned ? 'Unpin post' : 'Pin post'}
            >
              📌
            </button>
          )}
          
          {canEdit && (
            <button
              onClick={() => onEdit?.(post)}
              disabled={loading}
              className="p-2 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 disabled:opacity-50"
              title="Edit post"
            >
              <Pencil size={22} />
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 rounded-md text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 disabled:opacity-50"
              title="Delete post"
            >
              <Trash size={22} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      {/* Image */}
      {post.imageURL && (
        <div className="mb-4">
          <img
            src={post.imageURL}
            alt="Post image"
            className="max-w-full h-auto rounded-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>
      )}

      {/* Footer */}
      <div className="text-xs text-gray-400 border-t pt-3">
        Created: {formatDate(post.createdAt)}
        {post.updatedAt.getTime() !== post.createdAt.getTime() && (
          <span className="ml-4">Updated: {formatDate(post.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}