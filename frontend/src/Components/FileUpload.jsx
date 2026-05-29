import { useState, useCallback } from 'react';
import { Upload, CloudUpload } from 'lucide-react';
import { storage } from '../lib/storage';

export function FileUpload({ folderId, onUploadComplete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleDrag = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDragIn = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.dataTransfer.items?.length > 0) setIsDragging(true);
  }, []);
  const handleDragOut = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file) => {
    try {
      setUploadProgress((prev) => ({ ...prev, [file.name]: 50 }));
      await storage.uploadFile(file, folderId);
      setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));
      setTimeout(() => {
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[file.name];
          return next;
        });
      }, 1500);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload ${file.name}`);
    }
  };

  const handleDrop = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) await uploadFile(file);
    setUploading(false);
    onUploadComplete();
  }, [folderId, onUploadComplete]);

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) await uploadFile(file);
    setUploading(false);
    onUploadComplete();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200
          ${isDragging
            ? 'border-cyan-500 bg-cyan-500/5 scale-[1.01]'
            : 'border-slate-700 hover:border-slate-600 bg-slate-900/50'
          }
        `}
      >
        <div className={`
          mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors
          ${isDragging ? 'bg-cyan-500/20' : 'bg-slate-800'}
        `}>
          <Upload className={`h-7 w-7 ${isDragging ? 'text-cyan-400' : 'text-slate-400'}`} />
        </div>

        <p className="text-base sm:text-lg font-semibold text-slate-200 mb-1">
          {isDragging ? 'Drop files here' : 'Drop files here or click to upload'}
        </p>
        <p className="text-sm text-slate-500 mb-6">Supports any file type</p>

        <label className="inline-block cursor-pointer">
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={uploading}
          />
          <span className={`
            px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 inline-flex items-center gap-2
            ${uploading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30'
            }
          `}>
            <CloudUpload className="h-4 w-4" />
            {uploading ? 'Uploading...' : 'Select Files'}
          </span>
        </label>
      </div>

      {/* Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="mt-3 space-y-2">
          {Object.entries(uploadProgress).map(([fileName, progress]) => (
            <div key={fileName} className="bg-slate-800 border border-slate-700 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-300 truncate flex-1">{fileName}</span>
                <span className="text-xs text-cyan-400 ml-2 font-medium">{progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-1.5">
                <div
                  className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}