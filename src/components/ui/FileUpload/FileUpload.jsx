import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { kBytes } from '../../../utils/format.js';

export function FileUpload({ onFile, accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.svg'] }, maxSize = 5 * 1024 * 1024, label = 'Upload file' }) {
  const onDrop = useCallback((files) => {
    const f = files?.[0];
    if (f) onFile?.(f);
  }, [onFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, maxSize });

  return (
    <div {...getRootProps()} className={`cursor-pointer rounded-lg border-2 border-dashed px-4 py-6 text-center text-sm ${
      isDragActive ? 'border-brand-500 bg-brand-50' : 'border-slate-200 bg-white'
    }`}>
      <input {...getInputProps()} />
      <p className="font-medium text-slate-700">{label}</p>
      <p className="text-xs text-slate-500 mt-1">Drag & drop or click · max {kBytes(maxSize)}</p>
    </div>
  );
}
