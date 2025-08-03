import React, { useState, useEffect } from 'react';
import { UserInfo } from '../types';
import { Send, Loader2, Trash2 } from 'lucide-react';

const API_URL = 'https://hirespark-job-portal-backend.onrender.com';

interface Post {
  _id: string;
  text: string;
  author: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface NetworkingPageProps {
  userInfo: UserInfo | null;
  onNavigate: (page: string) => void;
}

const NetworkingPage: React.FC<NetworkingPageProps> = ({ userInfo, onNavigate }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsFetching(true);
      try {
        const res = await fetch(`${API_URL}/api/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error('Failed to fetch posts.');
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred.');
      } finally {
        setIsFetching(false);
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || isPosting) return;
    if (!userInfo) {
      alert("You must be logged in to post.");
      onNavigate('login');
      return;
    }
    setIsPosting(true);
    try {
      const res = await fetch(`${API_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userInfo.token}` },
        body: JSON.stringify({ text: newPostText }),
      });
      const createdPost = await res.json();
      if (!res.ok) throw new Error(createdPost.message || 'Failed to create post.');
      setPosts([createdPost, ...posts]);
      setNewPostText('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not create post.');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    if (!userInfo) return alert("You must be logged in to delete posts.");
    try {
      const res = await fetch(`${API_URL}/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userInfo.token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete post.');
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
      alert("Post deleted successfully.");
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not delete post.');
    }
  };

  if (isFetching) return <div className="text-center py-20">Loading Community Feed...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Community Feed</h1>
      {userInfo && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              className="w-full p-2 border rounded-md"
              placeholder={`Share an update, ${userInfo.name.split(' ')[0]}...`}
              rows={3}
              maxLength={280}
            />
            <div className="flex justify-end items-center mt-2">
              <span className="text-sm text-gray-500 mr-4">{280 - newPostText.length}</span>
              <button type="submit" disabled={isPosting || !newPostText.trim()} className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center disabled:bg-gray-400">
                {isPosting ? <><Loader2 className="animate-spin mr-2" size={20} /> Posting...</> : <><Send className="mr-2" size={16} /> Post</>}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-6">
        {posts.length === 0 && (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-700">The feed is quiet...</h3>
                <p className="text-gray-500 mt-2">Be the first to share something with the community!</p>
            </div>
        )}

        {posts.map(post => (
          <div key={post._id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 uppercase">
                  {post.author.name.charAt(0)}
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-800">{post.author.name}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>
              {userInfo && userInfo._id === post.author._id && (
                <button onClick={() => handleDeletePost(post._id)} className="text-gray-400 hover:text-red-500" title="Delete post">
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <p className="text-gray-800 text-base whitespace-pre-wrap">{post.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkingPage;
