import { z } from 'zod';

// Pagination schema
export const PaginationSchema = z.object({
  limit: z.coerce.number().int().positive().default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

// Listing validation
export const CreateListingSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative('Price must be non-negative'),
  imageUrl: z.string().url().optional().nullable(),
  category: z.string().optional(),
  categoryId: z.number().int().optional(),
});

export const UpdateListingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative().optional(),
  imageUrl: z.string().url().optional().nullable(),
  status: z.enum(['active', 'sold', 'deleted']).optional(),
});

export type CreateListingInput = z.infer<typeof CreateListingSchema>;
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;

// Discussion validation
export const CreateDiscussionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(1, 'Description is required').max(5000),
  categoryId: z.number().int().optional(),
});

export const UpdateDiscussionSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().min(1).max(5000).optional(),
  categoryId: z.number().int().optional(),
});

export type CreateDiscussionInput = z.infer<typeof CreateDiscussionSchema>;
export type UpdateDiscussionInput = z.infer<typeof UpdateDiscussionSchema>;

// Reply validation
export const CreateReplySchema = z.object({
  content: z.string().min(1, 'Reply content is required').max(5000),
  discussionId: z.number().int().positive(),
});

export const UpdateReplySchema = z.object({
  content: z.string().min(1).max(5000).optional(),
});

export type CreateReplyInput = z.infer<typeof CreateReplySchema>;
export type UpdateReplyInput = z.infer<typeof UpdateReplySchema>;

// Message validation
export const CreateMessageSchema = z.object({
  conversationId: z.number().int().positive(),
  content: z.string().min(1, 'Message content is required').max(5000),
});

export const MarkMessageAsReadSchema = z.object({
  messageIds: z.array(z.number().int()).optional(),
});

export type CreateMessageInput = z.infer<typeof CreateMessageSchema>;
export type MarkMessageAsReadInput = z.infer<typeof MarkMessageAsReadSchema>;

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
