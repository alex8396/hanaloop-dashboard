import { useState, useEffect, useCallback } from 'react';
import { fetchPosts, createOrUpdatePost, deletePost, Post } from '@/lib/api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const addPostOptimistic = async (newPost: Omit<Post, 'id'>) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticPost: Post = { ...newPost, id: tempId };
    
    // 1. Optimistic Update
    setPosts(prev => [...prev, optimisticPost]);
    
    try {
      // 2. Server Request
      const savedPost = await createOrUpdatePost(newPost);
      // 3. Replace temp with real
      setPosts(prev => prev.map(p => p.id === tempId ? savedPost : p));
      return savedPost;
    } catch (err) {
      // 4. Rollback on failure
      setPosts(prev => prev.filter(p => p.id !== tempId));
      throw err;
    }
  };

  return { posts, isLoading, error, refetch: loadPosts, addPostOptimistic };
}
