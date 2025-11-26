import { create } from 'zustand';
import { blogService } from '../services/blogService';

const useBlogStore = create((set, get) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async (includeUnpublished = false) => {
    set({ loading: true, error: null });
    try {
      const data = await blogService.getAll(includeUnpublished);
      set({ posts: data, loading: false });
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      set({ error: error.message, loading: false });
    }
  },

  getPostById: async (id, includeUnpublished = false) => {
    try {
      const post = await blogService.getById(id, includeUnpublished);
      return post;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  getPostsByCategory: async (category) => {
    try {
      const posts = await blogService.getByCategory(category);
      return posts;
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const newPost = await blogService.create({
        ...postData,
        published: postData.published !== undefined ? postData.published : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      set((state) => ({
        posts: [newPost, ...state.posts]
      }));
      return newPost;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  updatePost: async (id, updates) => {
    try {
      const updatedPost = await blogService.update(id, {
        ...updates,
        updated_at: new Date().toISOString()
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post.id === id ? updatedPost : post
        )
      }));
      return updatedPost;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  deletePost: async (id) => {
    try {
      await blogService.delete(id);
      set((state) => ({
        posts: state.posts.filter((post) => post.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },
}));

export default useBlogStore;

