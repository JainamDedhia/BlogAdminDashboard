import React, { useState } from 'react';
import { useCollection } from '../../hooks/useFirestore';
import { updateDocument, deleteDocument } from '../../hooks/useFirestore';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Check, 
  X, 
  Trash2,
  Reply,
  Flag,
  Clock,
  User
} from 'lucide-react';

const CommentsList: React.FC = () => {
  const { documents: comments, loading } = useCollection('comments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState<string | null>(null);

  const filteredComments = comments.filter(comment => {
    const matchesSearch = comment.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comment.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || comment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (commentId: string, newStatus: string) => {
    try {
      setUpdating(commentId);
      await updateDocument('comments', commentId, { status: newStatus });
    } catch (error) {
      console.error('Error updating comment status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await deleteDocument('comments', commentId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'spam':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'spam':
        return <Flag className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Comments</h1>
        <p className="text-gray-600 mt-2">Moderate and manage user comments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: comments.length, color: 'blue' },
          { label: 'Approved', count: comments.filter(c => c.status === 'approved').length, color: 'green' },
          { label: 'Pending', count: comments.filter(c => c.status === 'pending').length, color: 'yellow' },
          { label: 'Spam', count: comments.filter(c => c.status === 'spam').length, color: 'red' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <MessageSquare className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search comments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="spam">Spam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.map((comment) => (
          <div key={comment.id} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{comment.author || 'Anonymous'}</h4>
                  <p className="text-sm text-gray-500">{comment.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center ${getStatusColor(comment.status)}`}>
                  {getStatusIcon(comment.status)}
                  <span className="ml-1 capitalize">{comment.status}</span>
                </span>
                <span className="text-xs text-gray-500">
                  {comment.createdAt?.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 leading-relaxed">{comment.content}</p>
              {comment.postTitle && (
                <p className="text-sm text-gray-500 mt-2">
                  On: <span className="font-medium">{comment.postTitle}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                {comment.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(comment.id, 'approved')}
                    disabled={updating === comment.id}
                    className="inline-flex items-center px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Approve
                  </button>
                )}
                {comment.status !== 'spam' && (
                  <button
                    onClick={() => handleStatusChange(comment.id, 'spam')}
                    disabled={updating === comment.id}
                    className="inline-flex items-center px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                  >
                    <Flag className="h-3 w-3 mr-1" />
                    Mark as Spam
                  </button>
                )}
                <button className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </button>
              </div>
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredComments.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No comments found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria.'
              : 'No comments have been posted yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsList;