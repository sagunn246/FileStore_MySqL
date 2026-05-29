import { useState, useEffect, useCallback } from 'react';
import { storage } from './lib/storage';
import { FolderNav } from './components/FolderNav';
import { FileUpload } from './components/FileUpload';
import { FileList } from './components/FileList';
import { Search, Menu, X } from 'lucide-react';

function App() {
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchFiles = useCallback(async () => {
    const allFiles = await storage.getFiles();
    const filtered = currentFolderId
      ? allFiles.filter((f) => f.folder_id === currentFolderId)
      : allFiles;
    setFiles(filtered);
  }, [currentFolderId]);

  useEffect(() => {
    setFolders(storage.getFolders());
    fetchFiles();
  }, [fetchFiles]);

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentFolder = folders.find((f) => f.id === currentFolderId);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-30
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex-shrink-0
      `}>
        <div className="flex items-center justify-between p-4 border-b border-slate-800 lg:hidden">
          <span className="font-semibold text-cyan-400">Menu</span>
          <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <FolderNav
          folders={folders}
          currentFolderId={currentFolderId}
          onFolderChange={(id) => { setCurrentFolderId(id); setSidebarOpen(false); }}
          onUpdate={() => { setFolders(storage.getFolders()); fetchFiles(); }}
        />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur border-b border-slate-800">
          <div className="px-4 sm:px-6 py-4">
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 flex-1">
                <div>
                  <h1 className="text-lg font-bold text-white leading-none">FileStore</h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {currentFolder ? currentFolder.name : 'All Files'}
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <FileUpload folderId={currentFolderId} onUploadComplete={fetchFiles} />
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                {searchQuery ? `Results (${filteredFiles.length})` : 'Your Files'}
              </h2>
              <FileList files={filteredFiles} onDelete={fetchFiles} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;