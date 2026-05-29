import { useState } from 'react';
import { Folder, FolderOpen, FolderPlus, Trash2, HardDrive } from 'lucide-react';
import { storage } from '../lib/storage';

export function FolderNav({ folders, currentFolderId, onFolderChange, onUpdate }) {
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    storage.addFolder(newFolderName);
    setNewFolderName('');
    setIsCreating(false);
    onUpdate();
  };

  const handleDeleteFolder = (folderId, folderName) => {
    if (!confirm(`Delete folder "${folderName}" and all its contents?`)) return;
    storage.deleteFolder(folderId);
    if (currentFolderId === folderId) onFolderChange(null);
    onUpdate();
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-4 overflow-y-auto">

      {/* Logo — visible on desktop only */}
      <div className="hidden lg:flex items-center gap-3 mb-8 px-1">
        <div className="w-9 h-9 bg-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <HardDrive className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold text-white">FileStore</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Folders</span>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
          title="New Folder"
        >
          <FolderPlus className="h-4 w-4" />
        </button>
      </div>

      {/* Create folder form */}
      {isCreating && (
        <div className="mb-3 p-3 bg-slate-800 border border-slate-700 rounded-xl">
          <input
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder(e)}
            placeholder="Folder name..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 mb-2"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateFolder}
              className="flex-1 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Create
            </button>
            <button
              onClick={() => { setIsCreating(false); setNewFolderName(''); }}
              className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nav items */}
      <div className="space-y-1">
        <button
          onClick={() => onFolderChange(null)}
          className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
            currentFolderId === null
              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          {currentFolderId === null
            ? <FolderOpen className="h-4 w-4 flex-shrink-0" />
            : <Folder className="h-4 w-4 flex-shrink-0" />
          }
          <span className="flex-1 text-left">All Files</span>
        </button>

        {folders.map((folder) => (
          <div
            key={folder.id}
            className={`group flex items-center gap-2.5 rounded-xl transition-all ${
              currentFolderId === folder.id
                ? 'bg-cyan-500/10 border border-cyan-500/20'
                : 'hover:bg-slate-800 border border-transparent'
            }`}
          >
            <button
              onClick={() => onFolderChange(folder.id)}
              className={`flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium ${
                currentFolderId === folder.id ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {currentFolderId === folder.id
                ? <FolderOpen className="h-4 w-4 flex-shrink-0" />
                : <Folder className="h-4 w-4 flex-shrink-0" />
              }
              <span className="flex-1 text-left truncate">{folder.name}</span>
            </button>
            <button
              onClick={() => handleDeleteFolder(folder.id, folder.name)}
              className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all mr-1"
              title="Delete folder"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {folders.length === 0 && !isCreating && (
          <p className="text-xs text-slate-600 px-3 py-2">No folders yet</p>
        )}
      </div>
    </div>
  );
}