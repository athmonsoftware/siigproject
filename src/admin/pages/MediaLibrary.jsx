import { useEffect, useState } from "react";
import { Trash2, Upload, Check, Folder, FolderPlus, X } from "lucide-react";
import { isSupabaseConfigured, supabase } from "../../lib/supabase";

export default function MediaLibrary() {
  const [files, setFiles] = useState([]);
  const [availableFolders, setAvailableFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState("");

  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedName, setCopiedName] = useState(null);

  // States for creating a new folder
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const loadFolders = async (selectFolderAfterLoad = null) => {
    const { data, error } = await supabase.storage.from("site-media").list("");

    if (error) {
      setMessage(`Error loading folders: ${error.message}`);
      setLoading(false);
      return;
    }

    const folders = (data || [])
      .filter(
        (item) => item.id === null && item.name !== ".emptyFolderPlaceholder"
      )
      .map((item) => item.name);

    if (folders.length > 0) {
      setAvailableFolders(folders);
      if (selectFolderAfterLoad && folders.includes(selectFolderAfterLoad)) {
        setCurrentFolder(selectFolderAfterLoad);
      } else if (!currentFolder || !folders.includes(currentFolder)) {
        setCurrentFolder(folders[0]);
      }
    } else {
      setAvailableFolders(["articles"]);
      setCurrentFolder("articles");
    }
  };

  const loadFiles = async (folder) => {
    if (!folder) return;
    setLoading(true);
    const { data, error } = await supabase.storage
      .from("site-media")
      .list(folder, {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      setMessage(`Error loading files: ${error.message}`);
      setFiles([]);
    } else {
      setFiles(
        (data || []).filter((file) => file.name !== ".emptyFolderPlaceholder")
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    loadFolders();
  }, []);

  useEffect(() => {
    if (currentFolder) {
      loadFiles(currentFolder);
    }
  }, [currentFolder]);

  // Handle creating a new folder by uploading a placeholder file
  const handleCreateFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setBusy(true);
    setMessage("");

    const sanitized = newFolderName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-");
    const placeholderPath = `${sanitized}/.emptyFolderPlaceholder`;
    const emptyFile = new Blob([""], { type: "text/plain" });

    const { error } = await supabase.storage
      .from("site-media")
      .upload(placeholderPath, emptyFile, { upsert: true });

    setBusy(false);
    if (error) {
      setMessage(`Error creating folder: ${error.message}`);
    } else {
      setMessage(`Folder "${sanitized}" created successfully.`);
      setNewFolderName("");
      setIsCreatingFolder(false);
      await loadFolders(sanitized); // Reload list and switch to it
    }
  };

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setMessage("");

    const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
    const path = `${currentFolder}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("site-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    setBusy(false);
    setMessage(error ? error.message : "Image uploaded successfully.");
    if (!error) loadFiles(currentFolder);
    event.target.value = "";
  };

  const remove = async (fileName) => {
    setBusy(true);
    const path = `${currentFolder}/${fileName}`;
    const { error } = await supabase.storage.from("site-media").remove([path]);
    setBusy(false);
    setMessage(error ? error.message : "Image removed.");
    if (!error) loadFiles(currentFolder);
  };

  const copyUrl = (publicUrl, fileName) => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedName(fileName);
    setTimeout(() => setCopiedName(null), 2000);
  };

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-slate-950">
          Media library
        </h1>
        <p className="mt-2 text-slate-600">
          Upload and manage images for the SIIG website.
        </p>
      </header>

      <section className="border border-slate-200 bg-white p-6 shadow-sm rounded-xl">
        {/* Top Controls: Folder Selector, New Folder Toggle, Upload */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3">
              <Folder className="h-5 w-5 text-emerald-800" />
              <div className="flex flex-col">
                <label
                  htmlFor="folder-select"
                  className="text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  Select Folder
                </label>
                <select
                  id="folder-select"
                  value={currentFolder}
                  onChange={(e) => setCurrentFolder(e.target.value)}
                  className="mt-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm font-bold rounded-lg px-3 py-1.5 focus:ring-emerald-800 focus:border-emerald-800"
                >
                  {availableFolders.map((folder) => (
                    <option key={folder} value={folder}>
                      {folder.charAt(0).toUpperCase() + folder.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* New Folder Toggle Button */}
            {!isCreatingFolder ? (
              <button
                onClick={() => setIsCreatingFolder(true)}
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-lg transition-colors border border-emerald-200"
              >
                <FolderPlus className="h-4 w-4" /> New Folder
              </button>
            ) : (
              <form
                onSubmit={handleCreateFolder}
                className="mt-5 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold rounded-lg px-3 py-1.5 focus:ring-emerald-800 focus:border-emerald-800"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={busy}
                  className="bg-emerald-800 text-white px-3 py-1.5 text-xs font-bold rounded-lg hover:bg-emerald-900 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreatingFolder(false)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>

          <label className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 bg-emerald-800 px-5 font-bold text-white rounded-lg hover:bg-emerald-900 transition-colors shadow-sm">
            <Upload className="h-4 w-4" />
            {busy ? "Working…" : `Upload to ${currentFolder || "folder"}`}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              className="sr-only"
              disabled={busy}
              onChange={upload}
            />
          </label>
        </div>

        {message && (
          <p
            role="status"
            className="mt-4 bg-slate-100 p-3 text-sm font-semibold text-slate-700 rounded-lg"
          >
            {message}
          </p>
        )}

        {/* Loading / Grid view */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-slate-500">Loading media...</div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {files.map((file) => {
              const { data } = supabase.storage
                .from("site-media")
                .getPublicUrl(`${currentFolder}/${file.name}`);

              const publicUrl = data.publicUrl;
              const isCopied = copiedName === file.name;

              return (
                <article
                  key={file.id || file.name}
                  className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col justify-between"
                >
                  <div className="aspect-video w-full bg-slate-100 overflow-hidden relative group">
                    <img
                      src={publicUrl}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4 bg-white">
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-bold text-slate-800"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <button
                        onClick={() => copyUrl(publicUrl, file.name)}
                        className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:underline"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />{" "}
                            Copied URL!
                          </>
                        ) : (
                          "Copy URL"
                        )}
                      </button>
                    </div>
                    <button
                      onClick={() => remove(file.name)}
                      disabled={busy}
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      aria-label={`Delete ${file.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })}

            {!files.length && (
              <p className="py-12 text-center text-slate-500 sm:col-span-2 xl:col-span-3 border border-dashed border-slate-200 rounded-xl">
                No images found in the "{currentFolder}" folder.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
