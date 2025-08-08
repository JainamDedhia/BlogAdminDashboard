import React, { useState, useEffect } from 'react';
import { useDocument } from '../../hooks/useFirestore';
import { updateDocument, addDocument } from '../../hooks/useFirestore';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Edit, 
  MessageSquare, 
  Image, 
  Link,
  Save,
  Palette,
  Shield,
  Database
} from 'lucide-react';

const Settings: React.FC = () => {
  const { document: settings, loading } = useDocument('settings', 'general');
  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    // General Settings
    siteTitle: '',
    siteTagline: '',
    siteUrl: '',
    adminEmail: '',
    timezone: 'UTC',
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12',
    
    // Writing Settings
    defaultCategory: '',
    defaultPostFormat: 'standard',
    
    // Reading Settings
    frontPageDisplay: 'posts',
    postsPerPage: 10,
    feedItems: 10,
    
    // Discussion Settings
    allowComments: true,
    commentModeration: 'auto',
    requireRegistration: false,
    closeCommentsAfter: 14,
    
    // Media Settings
    thumbnailWidth: 150,
    thumbnailHeight: 150,
    mediumWidth: 300,
    mediumHeight: 300,
    largeWidth: 1024,
    largeHeight: 1024,
    
    // Permalink Settings
    permalinkStructure: '/%postname%/',
    
    // Appearance Settings
    theme: 'default',
    primaryColor: '#3B82F6',
    secondaryColor: '#10B981',
    
    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: 24,
    maxLoginAttempts: 5
  });

  useEffect(() => {
    if (settings) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      if (settings) {
        await updateDocument('settings', 'general', formData);
      } else {
        await addDocument('settings', { ...formData, id: 'general' });
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'writing', label: 'Writing', icon: Edit },
    { id: 'reading', label: 'Reading', icon: Database },
    { id: 'discussion', label: 'Discussion', icon: MessageSquare },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'permalinks', label: 'Permalinks', icon: Link },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield }
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your blog settings</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Title
                    </label>
                    <input
                      type="text"
                      name="siteTitle"
                      value={formData.siteTitle}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="My Awesome Blog"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site Tagline
                    </label>
                    <input
                      type="text"
                      name="siteTagline"
                      value={formData.siteTagline}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Just another blog"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Site URL
                    </label>
                    <input
                      type="url"
                      name="siteUrl"
                      value={formData.siteUrl}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://myblog.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="admin@myblog.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezone
                    </label>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Format
                    </label>
                    <select
                      name="dateFormat"
                      value={formData.dateFormat}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                      <option value="dd/MM/yyyy">dd/MM/yyyy</option>
                      <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                      <option value="MMM dd, yyyy">MMM dd, yyyy</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'writing' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Writing Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Category
                    </label>
                    <input
                      type="text"
                      name="defaultCategory"
                      value={formData.defaultCategory}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Uncategorized"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Post Format
                    </label>
                    <select
                      name="defaultPostFormat"
                      value={formData.defaultPostFormat}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="standard">Standard</option>
                      <option value="gallery">Gallery</option>
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="quote">Quote</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reading' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Reading Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Front Page Display
                    </label>
                    <select
                      name="frontPageDisplay"
                      value={formData.frontPageDisplay}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="posts">Latest Posts</option>
                      <option value="page">Static Page</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Posts Per Page
                    </label>
                    <input
                      type="number"
                      name="postsPerPage"
                      value={formData.postsPerPage}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feed Items
                    </label>
                    <input
                      type="number"
                      name="feedItems"
                      value={formData.feedItems}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'discussion' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Discussion Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="allowComments"
                      checked={formData.allowComments}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Allow comments on new posts
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="requireRegistration"
                      checked={formData.requireRegistration}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Users must be registered to comment
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Comment Moderation
                      </label>
                      <select
                        name="commentModeration"
                        value={formData.commentModeration}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="auto">Auto-approve</option>
                        <option value="manual">Manual approval</option>
                        <option value="registered">Auto-approve registered users</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Close Comments After (days)
                      </label>
                      <input
                        type="number"
                        name="closeCommentsAfter"
                        value={formData.closeCommentsAfter}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'media' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Media Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Thumbnail Size</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Width</label>
                        <input
                          type="number"
                          name="thumbnailWidth"
                          value={formData.thumbnailWidth}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Height</label>
                        <input
                          type="number"
                          name="thumbnailHeight"
                          value={formData.thumbnailHeight}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Medium Size</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Width</label>
                        <input
                          type="number"
                          name="mediumWidth"
                          value={formData.mediumWidth}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Height</label>
                        <input
                          type="number"
                          name="mediumHeight"
                          value={formData.mediumHeight}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Large Size</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Width</label>
                        <input
                          type="number"
                          name="largeWidth"
                          value={formData.largeWidth}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Height</label>
                        <input
                          type="number"
                          name="largeHeight"
                          value={formData.largeHeight}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'permalinks' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Permalink Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permalink Structure
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '/%postname%/', label: 'Post name', example: '/sample-post/' },
                      { value: '/%year%/%monthnum%/%postname%/', label: 'Day and name', example: '/2024/01/sample-post/' },
                      { value: '/%year%/%monthnum%/%postname%/', label: 'Month and name', example: '/2024/01/sample-post/' },
                      { value: '/%category%/%postname%/', label: 'Category and name', example: '/category/sample-post/' }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          name="permalinkStructure"
                          value={option.value}
                          checked={formData.permalinkStructure === option.value}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          {option.label} <span className="text-gray-500">({option.example})</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Appearance Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="default">Default</option>
                      <option value="dark">Dark</option>
                      <option value="minimal">Minimal</option>
                      <option value="magazine">Magazine</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <input
                      type="color"
                      name="primaryColor"
                      value={formData.primaryColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <input
                      type="color"
                      name="secondaryColor"
                      value={formData.secondaryColor}
                      onChange={handleInputChange}
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="enableTwoFactor"
                      checked={formData.enableTwoFactor}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Enable two-factor authentication
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Session Timeout (hours)
                      </label>
                      <input
                        type="number"
                        name="sessionTimeout"
                        value={formData.sessionTimeout}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                        max="168"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        name="maxLoginAttempts"
                        value={formData.maxLoginAttempts}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;