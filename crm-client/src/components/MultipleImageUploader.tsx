"use client"

import { useState, useRef } from "react"
import { Upload, X, Plus, Image as ImageIcon } from "lucide-react"
import { uploadImage } from "../api"

interface MultipleImageUploaderProps {
  onImagesUploaded: (imagePaths: string[]) => void
  initialImages?: string[]
}

export default function MultipleImageUploader({ onImagesUploaded, initialImages = [] }: MultipleImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages)
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

    // Upload to server
    try {
      setIsUploading(true)
      const imagePath = await uploadImage(file)
      
      // Add new image to the list
      const newImages = [...images, imagePath]
      setImages(newImages)
      onImagesUploaded(newImages)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err) {
      console.error('Error uploading image:', err)
      setError('Ошибка при загрузке изображения')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
    onImagesUploaded(newImages)
  }

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
          id="multiple-image-upload"
        />

        <label
          htmlFor="multiple-image-upload"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px dashed var(--color-border)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
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
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'var(--color-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
            }}
          >
            <Plus size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p
              style={{
                fontSize: '0.9375rem',
                fontWeight: '500',
                color: 'var(--color-text-primary)',
                marginBottom: '0.25rem',
              }}
            >
              {isUploading ? 'Загрузка...' : 'Добавить изображение'}
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
              }}
            >
              PNG, JPG или WEBP (макс. 5MB)
            </p>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
            gap: '1rem',
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                aspectRatio: '1',
              }}
            >
              <img
                src={image.startsWith('/') ? `http://localhost:8080${image}` : image}
                alt={`Изображение ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <button
                onClick={() => handleRemoveImage(index)}
                style={{
                  position: 'absolute',
                  top: '0.25rem',
                  right: '0.25rem',
                  width: '24px',
                  height: '24px',
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
                <X size={14} />
              </button>
            </div>
          ))}
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
