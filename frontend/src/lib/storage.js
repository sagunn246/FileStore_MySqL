const API = "http://localhost:5000/api/files";

export const storage = {
  getFiles: async () => {
    const res = await fetch(API);
    return res.json();
  },

  uploadFile: async (file, folderId) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folder_id", folderId);
    const res = await fetch(`${API}/upload`, {
      method: "POST",
      body: formData,
    });
    return res.json();
  },

  deleteFile: async (id) => {
    await fetch(`${API}/${id}`, { method: "DELETE" });
  },

  getFolders: () => {
    const data = localStorage.getItem("filestore_folders");
    return data ? JSON.parse(data) : [];
  },

  saveFolders: (folders) => {
    localStorage.setItem("filestore_folders", JSON.stringify(folders));
  },

  addFolder: (name) => {
    const folders = storage.getFolders();
    const newFolder = {
      id: crypto.randomUUID(),
      name,
      parent_id: null,
      created_at: new Date().toISOString(),
    };
    folders.push(newFolder);
    storage.saveFolders(folders);
    return newFolder;
  },

  deleteFolder: (id) => {
    const folders = storage.getFolders().filter((f) => f.id !== id);
    storage.saveFolders(folders);
  },
};