/**
 * Media upload helper.
 *
 * Prefers backend `/media/upload` endpoint which:
 *  - validates file size (8MB images, 650MB videos)
 *  - applies Cloudinary transformations (1080x1080 crop, auto quality)
 *  - organizes into `socialdesk/` folder
 *  - keeps Cloudinary API keys on server
 *
 * Falls back to direct Cloudinary only if backend is unavailable.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/mov',
  'video/quicktime',
  'video/avi',
  'video/mkv',
];

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;          // 8 MB
const MAX_VIDEO_SIZE = 650 * 1024 * 1024;        // 650 MB

/**
 * Validate file locally before upload.
 * Returns { ok: true } or { ok: false, reason: '...' }
 */
export function validateMediaFile(file) {
  if (!file) {
    return { ok: false, reason: 'No file selected' };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      ok: false,
      reason: 'Unsupported file type. Use JPEG, PNG, GIF, WebP, MP4, MOV, AVI, or MKV.',
    };
  }

  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;

  if (file.size > maxSize) {
    const sizeMB = isVideo ? 650 : 8;
    return {
      ok: false,
      reason: `File too large. Max ${sizeMB} MB for ${isVideo ? 'videos' : 'images'}.`,
    };
  }

  return { ok: true, isVideo };
}

/**
 * Upload file via backend /media/upload.
 * Returns { url, publicId, resourceType, format, width, height, duration, sizeBytes }
 * Throws Error on failure.
 */
export async function uploadMedia(file) {
  // ─── Local validation ───
  const check = validateMediaFile(file);
  if (!check.ok) {
    throw new Error(check.reason);
  }

  // ─── Get auth token from localStorage/sessionStorage ───
  const TOKEN_KEY = 'socialdesk_token';
  const token =
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY);

  if (!token) {
    throw new Error('Not authenticated. Please log in again.');
  }

  // ─── Build FormData ───
  const fd = new FormData();
  fd.append('file', file);

  // ─── Upload to backend ───
  const res = await fetch(`${API_BASE}/media/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Don't set Content-Type — browser sets it with boundary
    },
    body: fd,
  });

  // ─── Handle response ───
  if (!res.ok) {
    let errMsg = `Upload failed (${res.status})`;
    try {
      const data = await res.json();
      errMsg = data?.detail || errMsg;
    } catch {
      // Ignore JSON parse error
    }
    throw new Error(errMsg);
  }

  const data = await res.json();

  // ─── Normalize response ───
  return {
    url: data.url,
    publicId: data.public_id,
    resourceType: data.resource_type,
    format: data.format,
    width: data.width,
    height: data.height,
    duration: data.duration,
    sizeBytes: data.size_bytes,
  };
}

/**
 * Legacy helper — kept for backwards compatibility.
 * Now uses backend upload instead of direct Cloudinary.
 */
export async function uploadToCloudinary(file) {
  return uploadMedia(file);
}