export async function uploadToCloudinary(file) {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) {
    // Local fallback: object URL preview
    return { url: URL.createObjectURL(file), publicId: `local_${Date.now()}` };
  }
  const fd = new FormData();
  fd.append('file', file);
  fd.append('upload_preset', preset);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/auto/upload`, {
    method: 'POST', body: fd,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return { url: data.secure_url, publicId: data.public_id };
}
