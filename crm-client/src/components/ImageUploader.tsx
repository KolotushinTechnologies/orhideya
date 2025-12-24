"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { uploadImage } from "../api"

interface ImageUploaderProps {
  onImageUploaded: (imagePath: string) => void
  initialImage?: string
}

export default function ImageUploader({ onImageUploaded, initialImage }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(initialImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5MB')
      return
    }

    // Clear previous errors
    setError(null)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload to server
    try {
      setIsUploading(true)
      const imagePath = await uploadImage(file)
      onImageUploaded(imagePath)
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Ошибка при загрузке изображения')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setPreview(null)
    onImageUploaded('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        id="image-upload"
      />

      {!preview ? (
        <label
          htmlFor="image-upload"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            background: 'var(--color-bg-light)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-primary)'
            e.currentTarget.style.background = 'var(--color-bg-hover)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)'
            e.currentTarget.style.background = 'var(--color-bg-light)'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <Upload size={28} color="var(--color-primary)" />
          </div>
          <p
            style={{
              fontSize: '0.9375rem',
              fontWeight: '500',
              color: 'var(--color-text-primary)',
              marginBottom: '0.5rem',
            }}
          >
            {isUploading ? 'Загрузка...' : 'Нажмите для загрузки изображения'}
          </p>
          <p
            style={{
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            PNG, JPG или WEBP (макс. 5MB)
          </p>
        </label>
      ) : (
        <div
          style={{
            position: 'relative',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
            }}
          />
          <button
            onClick={handleRemoveImage}
            style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              width: '32px',
              height: '32px',
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#ef4444'
              e.currentTarget.style.transform = 'scale(1.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.9)'
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <p
          style={{
            fontSize: '0.8125rem',
            color: '#ef4444',
            marginTop: '0.5rem',
          }}
        >
          {error}
        </p>
      )}
    </div>
  )
}
