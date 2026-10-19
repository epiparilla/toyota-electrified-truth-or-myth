// IndexedDB Manager for Caching Multiple Fullscreen Screen Saver Videos Locally
const DB_NAME = 'ToyotaPevsDB';
const DB_VERSION = 2; // Incremented for multiple video support
const STORE_NAME = 'screensaverStore';
const PLAYLIST_KEY = 'custom_screensaver_playlist';
const LEGACY_VIDEO_KEY = 'custom_screensaver_video';

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Stores multiple video files/blobs into the cached playlist
 * @param {File[]} files 
 * @returns {Promise<Array<{id: string, name: string, size: number, type: string, blob: Blob, updatedAt: number}>>}
 */
export async function saveMultipleVideos(files) {
  const currentList = await getCachedVideos();
  const db = await openDatabase();

  const newRecords = Array.from(files).map((file, idx) => ({
    id: `vid_${Date.now()}_${idx}_${Math.random().toString(36).substring(2, 7)}`,
    blob: file,
    name: file.name,
    size: file.size,
    type: file.type || 'video/mp4',
    updatedAt: Date.now()
  }));

  const updatedList = [...currentList, ...newRecords];

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(updatedList, PLAYLIST_KEY);

    req.onsuccess = () => resolve(updatedList);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Retrieves the full cached video playlist
 * @returns {Promise<Array<{id: string, name: string, size: number, type: string, blob: Blob}>>}
 */
export async function getCachedVideos() {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(PLAYLIST_KEY);

      req.onsuccess = () => {
        if (req.result && Array.isArray(req.result)) {
          resolve(req.result);
        } else {
          // Check for legacy single-file storage
          const legacyReq = store.get(LEGACY_VIDEO_KEY);
          legacyReq.onsuccess = () => {
            if (legacyReq.result && legacyReq.result.blob) {
              const migrated = [{
                id: `legacy_${Date.now()}`,
                blob: legacyReq.result.blob,
                name: legacyReq.result.name,
                size: legacyReq.result.size,
                type: legacyReq.result.type,
                updatedAt: legacyReq.result.updatedAt || Date.now()
              }];
              resolve(migrated);
            } else {
              resolve([]);
            }
          };
          legacyReq.onerror = () => resolve([]);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Error reading cached videos from IndexedDB:', err);
    return [];
  }
}

/**
 * Deletes a single video by ID from the playlist
 * @param {string} id 
 */
export async function deleteCachedVideoById(id) {
  const currentList = await getCachedVideos();
  const updatedList = currentList.filter((item) => item.id !== id);

  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(updatedList, PLAYLIST_KEY);

    req.onsuccess = () => resolve(updatedList);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Clears all cached videos from IndexedDB
 */
export async function clearAllCachedVideos() {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete(PLAYLIST_KEY);

    req.onsuccess = () => {
      // Also clean legacy key
      store.delete(LEGACY_VIDEO_KEY);
      resolve([]);
    };
    req.onerror = () => reject(req.error);
  });
}

/**
 * Utility to format bytes into readable MB/KB
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  const kb = bytes / 1024;
  return `${kb.toFixed(0)} KB`;
}

// Backward-compatibility export aliases
export const deleteCachedVideo = deleteCachedVideoById;
export const saveVideoToCache = saveMultipleVideos;
export const getCachedVideo = getCachedVideos;

