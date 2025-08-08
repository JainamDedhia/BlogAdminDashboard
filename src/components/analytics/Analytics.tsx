import React, { useState, useEffect } from 'react';
import { useCollection } from '../../hooks/useFirestore';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  MessageSquare, 
  Calendar,
  Globe,
  Smartphone,
  Monitor
} from 'lucide-react';

const Analytics: React.FC = () => {
  const { documents: posts } = useCollection('posts');
  const { documents: users } = useCollection('users');
  const { documents: comments } = useCollection('comments');
  const [timeRange, setTimeRange] = useState('7d');

  // Generate mock analytics data based on real data
  const generateAnalyticsData = () => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 200) + 50,
        posts: posts.filter(p => {
          const postDate = new Date(p.createdAt?.seconds * 1000 || p.createdAt);
          return postDate.toDateString() === date.toDateString();
        }).length,
        comments: comments.filter(c => {
          const commentDate = new Date(c.createdAt?.seconds * 1000 || c.createdAt);
          return commentDate.toDateString() === date.toDateString();
        }).length
      });
    }
    
    return data;
  };

  const analyticsData = generateAnalyticsData();
  
  const totalViews = analyticsData.reduce((sum, day) => sum + day.views, 0);
  const totalVisitors = analyticsData.reduce((sum, day) => sum + day.visitors, 0);
  const avgViews = Math.round(totalViews / analyticsData.length);
  const avgVisitors = Math.round(totalVisitors / analyticsData.length);

  const deviceData = [
    { name: 'Desktop', value: 45, color: '#3B82F6' },
    { name: 'Mobile', value: 35, color: '#10B981' },
    { name: 'Tablet', value: 20, color: '#F59E0B' }
  ];

  const topPosts = posts
    .sort(() => Math.random() - 0.5)
    .slice(0, 5)
    .map(post => ({
      ...post,
      views: Math.floor(Math.random() * 1000) + 100
    }));

  const stats = [
    {
      name: 'Total Views',
      value: totalViews.toLocaleString(),
      change: '+12.5%',
      changeType: 'increase' as const,
      icon: Eye,
      color: 'blue'
    },
    {
      name: 'Unique Visitors',
      value: totalVisitors.toLocaleString(),
      change: '+8.2%',
      changeType: 'increase' as const,
      icon: Users,
      color: 'green'
    },
    {
      name: 'Avg. Views/Day',
      value: avgViews.toString(),
      change: '+5.1%',
      changeType: 'increase' as const,
      icon: TrendingUp,
      color: 'yellow'
    },
    {
      name: 'Engagement Rate',
      value: '3.2%',
      change: '+0.8%',
      changeType: 'increase' as const,
      icon: MessageSquare,
      color: 'purple'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your blog's performance and engagement</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm font-medium text-green-600">{stat.change}</span>
                <span className="text-sm text-gray-500 ml-2">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Views Over Time */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="visitors" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Breakdown</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {deviceData.map((device) => (
              <div key={device.name} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: device.color }}
                ></div>
                <span className="text-sm text-gray-600">
                  {device.name} ({device.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Performance */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="posts" fill="#3B82F6" />
              <Bar dataKey="comments" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Posts */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div key={post.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {post.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.createdAt?.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{post.views}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Sources */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { source: 'Direct', visits: '2,847', percentage: '45%', icon: Globe, color: 'blue' },
            { source: 'Social Media', visits: '1,923', percentage: '30%', icon: Users, color: 'green' },
            { source: 'Search Engines', visits: '1,284', percentage: '25%', icon: TrendingUp, color: 'yellow' }
          ].map((source) => {
            const Icon = source.icon;
            return (
              <div key={source.source} className="text-center">
                <div className={`mx-auto h-12 w-12 bg-${source.color}-100 rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`h-6 w-6 text-${source.color}-600`} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900">{source.visits}</h4>
                <p className="text-sm text-gray-600">{source.source}</p>
                <p className="text-xs text-gray-500">{source.percentage} of total</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Analytics;