export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  timestamp: Date;
  imageURL?: string;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
  imageURL?: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  imageURL?: string;
}

export interface PostsQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  authorId?: string;
  pinned?: boolean;
}

export interface PaginatedPostsResponse {
  posts: Post[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PostFormData {
  title: string;
  content: string;
  image?: File;
}

export interface ImageUploadResult {
  url: string;
  filename: string;
  size: number;
}