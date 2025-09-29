import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, AlertTriangle, X, Eye, EyeOff } from 'lucide-react';
import { commentsService, Comment } from '../services/comments';
import { useLanguage } from './LanguageContext';
import { translations } from '../data/i18n';
import { useIsMobile } from '../hooks/useIsMobile';

interface CommentsSectionProps {
  mediaType: 'movie' | 'tv';
  mediaId: number;
  mediaTitle: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  mediaType,
  mediaId,
  mediaTitle
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [showSpoilerWarning, setShowSpoilerWarning] = useState(false);
  const [userComment, setUserComment] = useState<Comment | null>(null);
  const [canComment, setCanComment] = useState(true);
  const [rateLimitInfo, setRateLimitInfo] = useState<{ count: number; limit: number } | null>(null);

  const { language } = useLanguage();
  const t = translations[language] || translations.en;
  const isMobile = useIsMobile();

  useEffect(() => {
    if (showComments) {
      loadComments();
      checkUserComment();
      checkRateLimit();
    }
  }, [showComments, mediaType, mediaId]);

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const commentsData = await commentsService.getComments(mediaType, mediaId);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkUserComment = async () => {
    try {
      const existingComment = await commentsService.getUserComment(mediaType, mediaId);
      setUserComment(existingComment);
    } catch (err) {
      console.error('Failed to check user comment:', err);
    }
  };

  const checkRateLimit = async () => {
    try {
      const info = await commentsService.getRateLimitInfo();
      setRateLimitInfo(info);
      setCanComment(info.count < info.limit);
    } catch (err) {
      console.error('Failed to check rate limit:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submitting || !canComment) return;

    setSubmitting(true);
    setError(null);

    try {
      const comment = await commentsService.addComment(
        mediaType,
        mediaId,
        newComment.trim()
      );
      
      setUserComment(comment);
      setNewComment('');
      await loadComments();
      await checkRateLimit();
    } catch (err: any) {
      setError(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShowComments = () => {
    if (!showComments) {
      setShowSpoilerWarning(true);
    } else {
      setShowComments(false);
    }
  };

  const handleAcceptSpoilerWarning = () => {
    setShowSpoilerWarning(false);
    setShowComments(true);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      {/* Spoiler Warning Modal */}
      {showSpoilerWarning && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-700 max-w-md w-full ${isMobile ? 'mx-4' : ''}`}>
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                Spoiler Warning
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 text-center mb-6 leading-relaxed">
                Comments may contain spoilers for <strong>{mediaTitle}</strong>. 
                Are you sure you want to view them?
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSpoilerWarning(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptSpoilerWarning}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-200"
                >
                  Show Comments
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm mobile-card rounded-2xl shadow-xl border border-pink-200/50 dark:border-gray-700/50 transition-colors duration-300 ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-bold text-gray-900 dark:text-white flex items-center ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <MessageCircle className={`mr-2 text-pink-500 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
            Comments
          </h3>
          
          <button
            onClick={handleShowComments}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              showComments
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] hover:opacity-95 text-white shadow-lg'
            } ${isMobile ? 'text-sm px-3 py-2' : ''}`}
          >
            {showComments ? (
              <>
                <EyeOff className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                <span>Hide Comments</span>
              </>
            ) : (
              <>
                <Eye className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                <span>Show Comments</span>
              </>
            )}
          </button>
        </div>

        {showComments && (
          <div className="space-y-6">
            {/* Comment Form */}
            {canComment && !userComment && (
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts... (No spoilers in titles please!)"
                    maxLength={256}
                    rows={isMobile ? 3 : 4}
                    className={`w-full px-4 py-3 bg-white/90 dark:bg-gray-900/90 border border-pink-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200 ${isMobile ? 'text-sm' : ''}`}
                    disabled={submitting}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {newComment.length}/256 characters
                    </span>
                    {rateLimitInfo && (
                      <span className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {rateLimitInfo.count}/{rateLimitInfo.limit} comments used
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 flex-1 mr-4 ${isMobile ? 'p-2' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className={`text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5 ${isMobile ? 'w-4 h-4' : 'w-5 h-5'}`} />
                      <p className={`text-yellow-800 dark:text-yellow-200 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        Please be respectful and avoid major spoilers
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!newComment.trim() || submitting || newComment.length > 256}
                    className={`bg-gradient-to-r from-[var(--grad-from)] to-[var(--grad-to)] text-white font-semibold rounded-xl hover:opacity-95 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3'}`}
                  >
                    <Send className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} />
                    <span>{submitting ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Rate Limit Message */}
            {!canComment && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                <p className="text-red-800 dark:text-red-200 text-center">
                  You've reached the maximum number of comments (25). Thank you for your participation!
                </p>
              </div>
            )}

            {/* User's Existing Comment */}
            {userComment && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-semibold text-blue-800 dark:text-blue-200">
                        {userComment.username}
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 text-sm">
                        (Your comment)
                      </span>
                    </div>
                    <p className="text-blue-900 dark:text-blue-100">{userComment.content}</p>
                    <span className="text-blue-600 dark:text-blue-400 text-sm">
                      {formatTimeAgo(userComment.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-4">
                <p className="text-red-800 dark:text-red-200 text-center">{error}</p>
              </div>
            )}

            {/* Comments List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading comments...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
                </h4>
                
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border border-gray-200 dark:border-gray-600"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`font-semibold text-gray-900 dark:text-white ${isMobile ? 'text-sm' : ''}`}>
                        {comment.username}
                      </span>
                      <span className={`text-gray-500 dark:text-gray-400 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {formatTimeAgo(comment.created_at)}
                      </span>
                    </div>
                    <p className={`text-gray-800 dark:text-gray-200 leading-relaxed ${isMobile ? 'text-sm' : ''}`}>
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default CommentsSection;