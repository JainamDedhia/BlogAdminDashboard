  import React, { useState, useCallback } from 'react';
  import { useDropzone } from 'react-dropzone';
  import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
  import { storage } from '../../lib/firebase';
  import { useCollection } from '../../hooks/useFirestore';
  import { addDocument, deleteDocument } from '../../hooks/useFirestore';
  import { 
    Upload, 
    Image as ImageIcon, 
    File, 
    Trash2, 
    Download,
    Search,
    Grid,
    List,
    Filter,
    X
  } from 'lucide-react';

  interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  createdAt: Date;
  path?: string; // ✅ added
}

  const MediaLibrary: React.FC = () => {
    const mediaFiles: MediaFile[] = [
  {
    id: '1',
    name: 'example-image.jpg',
    url: 'https://via.placeholder.com/300',
    type: 'image/jpeg',
    size: 102400,
    createdAt: new Date('2025-08-01'),
  },
  {
    id: '2',
    name: 'example-doc.pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    type: 'application/pdf',
    size: 204800,
    createdAt: new Date('2025-08-02'),
  },
];

    const [uploading, setUploading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
      setUploading(true);
      
      try {
        for (const file of acceptedFiles) {
          const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
          const snapshot = await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(snapshot.ref);
          
          await addDocument('media', {
            name: file.name,
            url: downloadURL,
            type: file.type,
            size: file.size,
            path: snapshot.ref.fullPath
          });
        }
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setUploading(false);
      }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        'video/*': ['.mp4', '.webm', '.ogg'],
        'application/pdf': ['.pdf'],
        'text/*': ['.txt', '.md']
      }
    });

    const handleDeleteFile = async (file: MediaFile) => {
      if (window.confirm('Are you sure you want to delete this file?')) {
        try {
          // Delete from storage
          if (file.path) {
            const storageRef = ref(storage, file.path);
            await deleteObject(storageRef);
          }
          
          // Delete from database
          await deleteDocument('media', file.id);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
    };

    const handleBulkDelete = async () => {
      if (window.confirm(`Are you sure you want to delete ${selectedFiles.length} files?`)) {
        try {
          for (const fileId of selectedFiles) {
            const file = mediaFiles.find(f => f.id === fileId);
            if (file) {
              if (file.path) {
                const storageRef = ref(storage, file.path);
                await deleteObject(storageRef);
              }
              await deleteDocument('media', fileId);
            }
          }
          setSelectedFiles([]);
        } catch (error) {
          console.error('Error deleting files:', error);
        }
      }
    };

    const filteredFiles = mediaFiles.filter(file => {
      const matchesSearch = file.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || file.type?.startsWith(typeFilter);
      return matchesSearch && matchesType;
    });

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getFileIcon = (type: string) => {
      if (type?.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
      return <File className="h-5 w-5" />;
    };

    if (uploading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-600 mt-2">Upload and manage your media files</p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          {uploading ? (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">Uploading files...</p>
              <div className="w-32 h-2 bg-gray-200 rounded-full mx-auto">
                <div className="h-2 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-lg font-medium text-gray-900 mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-gray-600">or click to browse files</p>
              <p className="text-sm text-gray-500 mt-2">
                Supports images, videos, PDFs, and text files
              </p>
            </div>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="video">Videos</option>
                  <option value="application">Documents</option>
                </select>
              </div>
            </div>
            
            {selectedFiles.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedFiles.length} selected
                </span>
                <button
                  onClick={handleBulkDelete}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Files Display */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                  selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                  } else {
                    setSelectedFiles([...selectedFiles, file.id]);
                  }
                }}
              >
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                  {file.type?.startsWith('image/') ? (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                </div>
                <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {file.createdAt?.toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <a
                      href={file.url}
                      download={file.name}
                      className="text-gray-400 hover:text-blue-600"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="h-3 w-3" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFile(file);
                      }}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedFiles.length === filteredFiles.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedFiles(filteredFiles.map(f => f.id));
                        } else {
                          setSelectedFiles([]);
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles([...selectedFiles, file.id]);
                          } else {
                            setSelectedFiles(selectedFiles.filter(id => id !== file.id));
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                          {file.type?.startsWith('image/') ? (
                            <img
                              src={file.url}
                              alt={file.name}
                              className="h-8 w-8 object-cover rounded"
                            />
                          ) : (
                            getFileIcon(file.type)
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{file.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {file.createdAt?.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <a
                          href={file.url}
                          download={file.name}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteFile(file)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
            <p className="text-gray-600">
              {searchTerm || typeFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Upload your first file to get started.'
              }
            </p>
          </div>
        )}
      </div>
    );
  };

  export default MediaLibrary;