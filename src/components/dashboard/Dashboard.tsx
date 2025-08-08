import React from 'react';
import { useCollection } from '../../hooks/useFirestore';
import { 
  FileText, 
  Users, 
  MessageSquare, 
  Eye,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { documents: posts } = useCollection('posts');
  const { documents: users } = useCollection('users');
  const { documents: comments } = useCollection('comments');

  const stats = [
    {
      name: 'Total Posts',
      value: posts.length,
      icon: FileText,
      change: '+12%',
      changeType: 'increase' as const,
      color: 'blue'
    },
    {
      name: 'Total Users',
      value: users.length,
      icon: Users,
      change: '+8%',
      changeType: 'increase' as const,
      color: 'green'
    },
    {
      name: 'Total Comments',
      value: comments.length,
      icon: MessageSquare,
      change: '+23%',
      changeType: 'increase' as const,
      color: 'yellow'
    },
    {
      name: 'Page Views',
      value: '24.5K',
      icon: Eye,
      change: '+5%',
      changeType: 'increase' as const,
      color: 'purple'
    }
  ];

  const recentPosts = posts.slice(0, 5);
  const recentUsers = users.slice(0, 5);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500 text-blue-600 bg-blue-50',
      green: 'bg-green-500 text-green-600 bg-green-50',
      yellow: 'bg-yellow-500 text-yellow-600 bg-yellow-50',
      purple: 'bg-purple-500 text-purple-600 bg-purple-50'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your blog.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color).split(' ');
          
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 ${colors[2]} rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 ${colors[1]}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">from last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {post.createdAt?.toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      post.status === 'published' 
                        ? 'bg-green-100 text-green-800'
                        : post.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No posts yet. Create your first post!
              </div>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.length > 0 ? (
              recentUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800'
                        : user.role === 'editor'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No users yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {/* Sample activities */}
            <div className="flex items-start">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-900">New post published</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
              <div>
                <p className="text-sm text-gray-900">Comment awaiting moderation</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;