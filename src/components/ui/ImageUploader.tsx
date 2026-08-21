'use client';

import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { createBrowserClient } from '@/lib/supabase/client';

interface ImageUploaderProps {
  /** If multiple, value should be string[] of public URLs. Otherwise, a single string URL. */
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  bucketName?: string;
  maxFiles?: number;
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  bucketName = 'product-images',
  maxFiles = 5,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const supabase = createBrowserClient();

  const urls = multiple 
    ? (Array.isArray(value) ? value : value ? [value] : []) 
    : (typeof value === 'string' ? (value ? [value] : []) : []);

  const handleUploadFiles = async (files: FileList) => {
    if (files.length === 0) return;

    if (!multiple && files.length > 1) {
      setError('Only single image upload is supported here.');
      return;
    }

    if (multiple && urls.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed.`);
      return;
    }

    setUploading(true);
    setError(null);

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Basic image check
        if (!file.type.startsWith('image/')) {
          throw new Error(`File "${file.name}" is not an image.`);
        }

        // Limit size to 5MB
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File "${file.name}" is larger than 5MB limit.`);
        }

        const fileExt = file.name.split('.').pop() || '';
        const randomStr = Math.random().toString(36).substring(2, 12);
        const fileName = `${randomStr}_${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw new Error(`Upload failed for "${file.name}": ${uploadError.message}`);
        }

        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        if (data?.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }

      if (multiple) {
        onChange([...urls, ...uploadedUrls]);
      } else {
        onChange(uploadedUrls[0] || '');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload image(s). Make sure the bucket exists and is public.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleUploadFiles(e.target.files);
    }
  };

  const handleDelete = async (urlToDelete: string) => {
    setError(null);
    try {
      const searchStr = `/public/${bucketName}/`;
      const index = urlToDelete.indexOf(searchStr);
      if (index !== -1) {
        const filePath = decodeURIComponent(urlToDelete.substring(index + searchStr.length));
        
        // Remove from Supabase storage
        const { error: deleteError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (deleteError) {
          console.warn('Failed to delete file from Supabase storage bucket:', deleteError.message);
        }
      }

      // Update state
      if (multiple) {
        onChange(urls.filter((url) => url !== urlToDelete));
      } else {
        onChange('');
      }
    } catch (err: any) {
      console.error('Delete error:', err);
      setError('Failed to fully remove the image from storage.');
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', width: '100%' }}>
      {/* Previews */}
      {urls.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: 'var(--space-3)',
            marginBottom: 'var(--space-2)',
          }}
        >
          {urls.map((url, i) => (
            <div
              key={url}
              style={{
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-secondary)',
                position: 'relative',
                border: '1px solid rgba(212,207,196,0.3)',
                overflow: 'hidden',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt="Product preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                type="button"
                onClick={() => handleDelete(url)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  zIndex: 5,
                  transition: 'background-color 200ms',
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-error)')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)')}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Zone */}
      {(!multiple && urls.length === 0) || (multiple && urls.length < maxFiles) ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          style={{
            border: isDragActive ? '2.5px dashed var(--color-accent)' : '2.5px dashed var(--color-secondary-alt)',
            backgroundColor: isDragActive ? 'rgba(245, 166, 35, 0.05)' : 'rgba(237, 232, 219, 0.15)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-6)',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 200ms ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            minHeight: 120,
          }}
          onMouseOver={(e) => {
            if (!isDragActive) {
              e.currentTarget.style.backgroundColor = 'rgba(237, 232, 219, 0.25)';
              e.currentTarget.style.borderColor = 'rgba(245, 166, 35, 0.5)';
            }
          }}
          onMouseOut={(e) => {
            if (!isDragActive) {
              e.currentTarget.style.backgroundColor = 'rgba(237, 232, 219, 0.15)';
              e.currentTarget.style.borderColor = 'var(--color-secondary-alt)';
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {uploading ? (
            <>
              <Loader2 className="animate-spin text-accent" size={24} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                Uploading image(s)…
              </span>
            </>
          ) : (
            <>
              <Upload style={{ color: 'var(--color-text-muted)' }} size={24} />
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text)' }}>
                Drag & drop or <span style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>browse</span>
              </span>
              <span style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>
                Supports JPG, PNG, WEBP (Max 5MB)
              </span>
            </>
          )}
        </div>
      ) : null}

      {error && (
        <span style={{ fontSize: '10px', color: 'var(--color-error)', fontWeight: 500, marginTop: 2 }}>
          {error}
        </span>
      )}
    </div>
  );
}
