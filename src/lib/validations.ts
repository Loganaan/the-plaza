// Type definitions for validation
export interface CreateListingInput {
  title: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  category?: string;
  categoryId?: number;
}

export interface UpdateListingInput {
  title?: string;
  description?: string | null;
  price?: number;
  imageUrl?: string | null;
  status?: 'active' | 'sold' | 'deleted';
}

export interface CreateDiscussionInput {
  title: string;
  description: string;
  categoryId?: number;
}

export interface UpdateDiscussionInput {
  title?: string;
  description?: string;
  categoryId?: number;
}

export interface CreateReplyInput {
  content: string;
  discussionId: number;
}

export interface UpdateReplyInput {
  content?: string;
}

export interface CreateMessageInput {
  conversationId: number;
  content: string;
}

export interface MarkMessageAsReadInput {
  messageIds?: number[];
}

export interface PaginationParams {
  limit: number;
  offset: number;
}

// Validation functions
export const validatePagination = (data: any): { success: boolean; data?: PaginationParams; error?: string } => {
  const limit = parseInt(data.limit || '20', 10);
  const offset = parseInt(data.offset || '0', 10);
  
  if (isNaN(limit) || limit <= 0) {
    return { success: false, error: 'Invalid limit' };
  }
  if (isNaN(offset) || offset < 0) {
    return { success: false, error: 'Invalid offset' };
  }
  
  return { success: true, data: { limit, offset } };
};

export const validateCreateListing = (data: any): { success: boolean; data?: CreateListingInput; error?: any } => {
  const errors: any = {};
  
  if (!data.title || typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 200) {
    errors.title = 'Title is required and must be between 1-200 characters';
  }
  if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
    errors.price = 'Price must be non-negative';
  }
  if (data.imageUrl && typeof data.imageUrl === 'string' && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Invalid URL';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateUpdateListing = (data: any): { success: boolean; data?: UpdateListingInput; error?: any } => {
  const errors: any = {};
  
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 200)) {
    errors.title = 'Title must be between 1-200 characters';
  }
  if (data.price !== undefined && (typeof data.price !== 'number' || data.price < 0)) {
    errors.price = 'Price must be non-negative';
  }
  if (data.imageUrl && typeof data.imageUrl === 'string' && !isValidUrl(data.imageUrl)) {
    errors.imageUrl = 'Invalid URL';
  }
  if (data.status && !['active', 'sold', 'deleted'].includes(data.status)) {
    errors.status = 'Invalid status';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateCreateDiscussion = (data: any): { success: boolean; data?: CreateDiscussionInput; error?: any } => {
  const errors: any = {};
  
  if (!data.title || typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 200) {
    errors.title = 'Title is required and must be between 1-200 characters';
  }
  if (!data.description || typeof data.description !== 'string' || data.description.length === 0 || data.description.length > 5000) {
    errors.description = 'Description is required and must be between 1-5000 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateUpdateDiscussion = (data: any): { success: boolean; data?: UpdateDiscussionInput; error?: any } => {
  const errors: any = {};
  
  if (data.title !== undefined && (typeof data.title !== 'string' || data.title.length === 0 || data.title.length > 200)) {
    errors.title = 'Title must be between 1-200 characters';
  }
  if (data.description !== undefined && (typeof data.description !== 'string' || data.description.length === 0 || data.description.length > 5000)) {
    errors.description = 'Description must be between 1-5000 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateCreateReply = (data: any): { success: boolean; data?: CreateReplyInput; error?: any } => {
  const errors: any = {};
  
  if (!data.content || typeof data.content !== 'string' || data.content.length === 0 || data.content.length > 5000) {
    errors.content = 'Reply content is required and must be between 1-5000 characters';
  }
  if (!data.discussionId || typeof data.discussionId !== 'number' || data.discussionId <= 0) {
    errors.discussionId = 'Valid discussion ID is required';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateUpdateReply = (data: any): { success: boolean; data?: UpdateReplyInput; error?: any } => {
  const errors: any = {};
  
  if (data.content !== undefined && (typeof data.content !== 'string' || data.content.length === 0 || data.content.length > 5000)) {
    errors.content = 'Content must be between 1-5000 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateCreateMessage = (data: any): { success: boolean; data?: CreateMessageInput; error?: any } => {
  const errors: any = {};
  
  if (!data.conversationId || typeof data.conversationId !== 'number' || data.conversationId <= 0) {
    errors.conversationId = 'Valid conversation ID is required';
  }
  if (!data.content || typeof data.content !== 'string' || data.content.length === 0 || data.content.length > 5000) {
    errors.content = 'Message content is required and must be between 1-5000 characters';
  }
  
  if (Object.keys(errors).length > 0) {
    return { success: false, error: errors };
  }
  
  return { success: true, data };
};

export const validateMarkMessageAsRead = (data: any): { success: boolean; data?: MarkMessageAsReadInput; error?: any } => {
  if (data.messageIds && !Array.isArray(data.messageIds)) {
    return { success: false, error: 'messageIds must be an array' };
  }
  
  return { success: true, data };
};

// Helper function to validate URLs
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Utility function for pagination response
export const createPaginatedResponse = <T>(data: T[], total: number, limit: number, offset: number) => ({
  data,
  pagination: {
    total,
    limit,
    offset,
    hasMore: offset + limit < total,
  },
});
