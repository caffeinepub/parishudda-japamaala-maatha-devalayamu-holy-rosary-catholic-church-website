import { useState, useRef } from 'react';
import { useMediaGallery, useAddMediaItem } from '../../hooks/useQueries';
import { useDraftState } from '../../hooks/useDraftState';
import {
  Upload,
  FolderOpen,
  Youtube,
  Image,
  Play,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
} from 'lucide-react';

interface DraftMedia {
  youtubeUrl: string;
  youtubeCaption: string;
}

const initialDraft: DraftMedia = { youtubeUrl: '', youtubeCaption: '' };

interface UploadItem {
  file: File;
  caption: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  previewUrl?: string;
}

function getYouTubeThumbnail(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return '';
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function MediaGalleryManager() {
  const { data: gallery, isLoading } = useMediaGallery();
  const addMutation = useAddMediaItem();
  const [draft, setDraft, clearDraft] = useDraftState<DraftMedia>('mediaGalleryDraft', initialDraft);
  const [uploadItems, setUploadItems] = useState<UploadItem[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'youtube'>('upload');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newItems: UploadItem[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'))
      .map((file) => ({
        file,
        caption: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        progress: 0,
        status: 'pending' as const,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));
    setUploadItems((prev) => [...prev, ...newItems]);
  };

  const updateCaption = (idx: number, caption: string) => {
    setUploadItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, caption } : item))
    );
  };

  const removeUploadItem = (idx: number) => {
    setUploadItems((prev) => {
      const item = prev[idx];
      if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const uploadAll = async () => {
    setError('');
    setSuccess('');
    const hasPending = uploadItems.some((i) => i.status === 'pending');
    if (!hasPending) return;

    setIsUploading(true);

    for (let i = 0; i < uploadItems.length; i++) {
      const item = uploadItems[i];
      if (item.status !== 'pending') continue;

      setUploadItems((prev) =>
        prev.map((it, idx) => (idx === i ? { ...it, status: 'uploading', progress: 10 } : it))
      );

      try {
        // Convert file to data URL for storage
        const dataUrl = await readFileAsDataURL(item.file);

        setUploadItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, progress: 70 } : it))
        );

        await addMutation.mutateAsync({
          mediaType: item.file.type.startsWith('video/') ? 'video' : 'image',
          url: dataUrl,
          caption: item.caption,
        });

        setUploadItems((prev) =>
          prev.map((it, idx) =>
            idx === i ? { ...it, status: 'done', progress: 100 } : it
          )
        );
      } catch {
        setUploadItems((prev) =>
          prev.map((it, idx) => (idx === i ? { ...it, status: 'error', progress: 0 } : it))
        );
      }
    }

    setIsUploading(false);
    setSuccess('Upload complete! Gallery has been updated.');
    setTimeout(() => {
      setUploadItems((prev) => {
        prev.forEach((item) => {
          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        return [];
      });
      setSuccess('');
    }, 3000);
  };

  const handleAddYouTube = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!draft.youtubeUrl) return;
    try {
      await addMutation.mutateAsync({
        mediaType: 'video',
        url: draft.youtubeUrl,
        caption: draft.youtubeCaption,
      });
      setSuccess('YouTube video added to gallery!');
      clearDraft();
      setTimeout(() => setSuccess(''), 4000);
    } catch {
      setError('Failed to add YouTube video. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Add Media Section */}
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy px-6 py-4 flex items-center gap-3">
          <Upload size={18} className="text-gold" />
          <h2 className="font-heading text-white font-semibold">Add Media</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gold/20">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-3 font-cinzel text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'upload'
                ? 'bg-gold/10 text-gold border-b-2 border-gold'
                : 'text-navy/50 hover:text-navy'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Upload size={14} />
              Upload Files / Folder
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('youtube')}
            className={`flex-1 py-3 font-cinzel text-xs tracking-wider uppercase transition-colors ${
              activeTab === 'youtube'
                ? 'bg-gold/10 text-gold border-b-2 border-gold'
                : 'text-navy/50 hover:text-navy'
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <Youtube size={14} />
              YouTube URL
            </span>
          </button>
        </div>

        <div className="p-6">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gold/40 text-navy hover:border-gold hover:bg-gold/5 rounded-lg transition-all font-body text-sm"
                >
                  <Image size={16} className="text-gold" />
                  Select Images / Videos
                </button>
                <button
                  type="button"
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-dashed border-gold/40 text-navy hover:border-gold hover:bg-gold/5 rounded-lg transition-all font-body text-sm"
                >
                  <FolderOpen size={16} className="text-gold" />
                  Select Entire Folder
                </button>
              </div>

              <p className="font-body text-navy/40 text-xs">
                Supports JPG, PNG, GIF, WebP and other image formats. Use "Select Folder" to bulk-upload an entire directory.
              </p>

              {/* Hidden Inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <input
                ref={folderInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                // @ts-ignore - webkitdirectory is a non-standard attribute
                webkitdirectory=""
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />

              {/* Upload Queue */}
              {uploadItems.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-cinzel text-navy/60 text-xs tracking-wider uppercase">
                      Upload Queue ({uploadItems.length} file{uploadItems.length !== 1 ? 's' : ''})
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        uploadItems.forEach((item) => {
                          if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                        });
                        setUploadItems([]);
                      }}
                      className="font-body text-navy/40 hover:text-red-400 text-xs transition-colors"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
                    {uploadItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-ivory rounded-lg border border-gold/20"
                      >
                        {/* Thumbnail */}
                        <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {item.previewUrl ? (
                            <img
                              src={item.previewUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : item.file.type.startsWith('video/') ? (
                            <Play size={14} className="text-gold" />
                          ) : (
                            <Image size={14} className="text-gold" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="font-body text-navy/50 text-xs truncate mb-1">
                            {item.file.name}
                          </p>
                          <input
                            type="text"
                            value={item.caption}
                            onChange={(e) => updateCaption(idx, e.target.value)}
                            placeholder="Add a caption..."
                            disabled={item.status !== 'pending'}
                            className="w-full bg-transparent font-body text-sm text-navy placeholder-navy/30 focus:outline-none border-b border-transparent focus:border-gold/40 transition-colors disabled:opacity-50"
                          />
                          {item.status === 'uploading' && (
                            <div className="mt-1.5 h-1 bg-navy/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold transition-all duration-300 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              />
                            </div>
                          )}
                          {item.status === 'done' && (
                            <p className="text-green-600 text-xs mt-0.5 flex items-center gap-1">
                              <CheckCircle size={10} /> Saved to gallery
                            </p>
                          )}
                          {item.status === 'error' && (
                            <p className="text-red-500 text-xs mt-0.5 flex items-center gap-1">
                              <AlertCircle size={10} /> Upload failed
                            </p>
                          )}
                        </div>

                        {item.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => removeUploadItem(idx)}
                            className="text-navy/30 hover:text-red-400 transition-colors flex-shrink-0"
                            aria-label="Remove"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {success && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3">
                      <CheckCircle size={16} className="text-green-600" />
                      <p className="font-body text-green-700 text-sm">{success}</p>
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                      <AlertCircle size={16} className="text-red-600" />
                      <p className="font-body text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={uploadAll}
                    disabled={isUploading || !uploadItems.some((i) => i.status === 'pending')}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all disabled:opacity-50"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} />
                        Upload All ({uploadItems.filter((i) => i.status === 'pending').length})
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* YouTube Tab */}
          {activeTab === 'youtube' && (
            <form onSubmit={handleAddYouTube} className="space-y-4">
              <div>
                <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                  YouTube Video URL <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  value={draft.youtubeUrl}
                  onChange={(e) => setDraft((p) => ({ ...p, youtubeUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-4 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-body text-navy/70 text-sm mb-1.5 font-medium">
                  Caption / Description
                </label>
                <input
                  type="text"
                  value={draft.youtubeCaption}
                  onChange={(e) => setDraft((p) => ({ ...p, youtubeCaption: e.target.value }))}
                  placeholder="e.g., Sunday Mass Celebration — Oct 2025"
                  className="w-full px-4 py-2.5 border border-gold/30 rounded-sm bg-ivory font-body text-sm text-navy placeholder-navy/30 focus:outline-none focus:border-gold transition-colors"
                />
              </div>

              {/* YouTube Preview */}
              {draft.youtubeUrl && getYouTubeThumbnail(draft.youtubeUrl) && (
                <div className="flex items-center gap-3 p-3 bg-ivory rounded-lg border border-gold/20">
                  <img
                    src={getYouTubeThumbnail(draft.youtubeUrl)}
                    alt="YouTube thumbnail"
                    className="w-20 h-14 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="font-body text-navy text-sm font-medium">
                      {draft.youtubeCaption || 'YouTube Video'}
                    </p>
                    <p className="font-body text-navy/40 text-xs truncate max-w-xs">
                      {draft.youtubeUrl}
                    </p>
                  </div>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-4 py-3">
                  <CheckCircle size={16} className="text-green-600" />
                  <p className="font-body text-green-700 text-sm">{success}</p>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-4 py-3">
                  <AlertCircle size={16} className="text-red-600" />
                  <p className="font-body text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={addMutation.isPending || !draft.youtubeUrl}
                className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy font-cinzel text-sm tracking-wider uppercase font-semibold rounded-sm hover:bg-gold-light transition-all disabled:opacity-50"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Youtube size={16} />
                    Add to Gallery
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Current Gallery */}
      <div className="bg-white rounded-xl border border-gold/30 shadow-sacred overflow-hidden">
        <div className="bg-navy/5 px-6 py-4 border-b border-gold/20 flex items-center gap-3">
          <Image size={18} className="text-gold" />
          <h2 className="font-heading text-navy font-semibold">Current Gallery</h2>
          {gallery && (
            <span className="ml-auto bg-gold/10 text-gold text-xs font-cinzel px-2.5 py-1 rounded-full">
              {gallery.length} item{gallery.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-video bg-ivory-dark rounded-lg animate-pulse" />
              ))}
            </div>
          ) : !gallery || gallery.length === 0 ? (
            <div className="text-center py-10">
              <Image size={36} className="mx-auto text-navy/20 mb-3" />
              <p className="font-body text-navy/40 text-sm italic">
                No media items yet. Upload images or add YouTube videos above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item, idx) => {
                const isVideo = item.mediaType === 'video' || isYouTubeUrl(item.url);
                const thumb = isVideo ? getYouTubeThumbnail(item.url) : null;
                return (
                  <div
                    key={idx}
                    className="group relative rounded-lg overflow-hidden border border-gold/20 hover:border-gold/50 transition-all"
                  >
                    {isVideo ? (
                      <div className="aspect-video bg-navy/10 flex items-center justify-center relative">
                        {thumb ? (
                          <img
                            src={thumb}
                            alt={item.caption}
                            className="absolute inset-0 w-full h-full object-cover opacity-70"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : null}
                        <div className="relative z-10 w-10 h-10 rounded-full bg-gold/80 flex items-center justify-center">
                          <Play size={16} className="text-navy ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={item.url}
                          alt={item.caption}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {item.caption && (
                      <div className="px-2 py-1.5 bg-ivory border-t border-gold/10">
                        <p className="font-body text-navy/70 text-xs truncate">{item.caption}</p>
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-navy/70 text-white text-xs px-1.5 py-0.5 rounded font-body">
                        {isVideo ? 'Video' : 'Image'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
