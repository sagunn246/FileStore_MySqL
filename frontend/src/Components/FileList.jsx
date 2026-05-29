import { useState } from 'react';
import { Download, Trash2, File as FileIcon, Image, Video, Music, FileText, Archive } from 'lucide-react';
import { storage } from '../lib/storage';

export function FileList({ files, onDelete }) {
  const [deleting, setDeleting] = useState(null);

  const getFileIcon = (mimeType) => {
    if (!mimeType) return { icon: <FileIcon className="h-6 w-6" />, color: 'text-slate-400 bg-slate-800' };
    if (mimeType.startsWith('image/')) return { icon: <Image className="h-6 w-6" />, color: 'text-blue-400 bg-blue-500/10' };
    if (mimeType.startsWith('video/')) return { icon: <Video className="h-6 w-6" />, color: 'text-purple-400 bg-purple-500/10' };
    if (mimeType.startsWith('audio/')) return { icon: <Music className="h-6 w-6" />, color: 'text-green-400 bg-green-500/10' };
    if (mimeType.includes('pdf') || mimeType.includes('document')) return { icon: <FileText className="h-6 w-6" />, color: 'text-red-400 bg-red-500/10' };
    if (mimeType.includes('zip') || mimeType.includes('archive')) return { icon: <Archive className="h-6 w-6" />, color: 'text-yellow-400 bg-yellow-500/10' };
    return { icon: <FileIcon className="h-6 w-6" />, color: 'text-cyan-400 bg-cyan-500/10' };
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const handleDownload = (file) => {
    const a = document.createElement('a');
    a.href = file.url;
    a.download = file.name;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async (file) => {
    if (!confirm(`Delete "${file.name}"?`)) return;
    setDeleting(file.id);
    try {
      await storage.deleteFile(file.id);
      onDelete();
    } catch (error) {
      alert('Failed to delete file');
    } finally {
      setDeleting(null);
    }
  };

  if (files.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="mx-auto w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <FileIcon className="h-8 w-8 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No files yet</p>
        <p className="text-slate-600 text-sm mt-1">Upload your first file to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
      {files.map((file) => {
        const { icon, color } = getFileIcon(file.type);
        return (
          <div
            key={file.id}
            className="group bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 rounded-xl p-4 transition-all duration-200 hover:bg-slate-800"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                {icon}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDownload(file)}
                  className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(file)}
                  disabled={deleting === file.id}
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm font-medium text-slate-200 truncate mb-1" title={file.name}>
              {file.name}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{formatFileSize(file.size)}</span>
              <span className="text-xs text-slate-600">{formatDate(file.created_at)}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}