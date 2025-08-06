import React, { useState } from 'react'

interface ProductImageProps {
  src?: string | null
  alt: string
  className?: string
  fallbackIcon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className = '',
  fallbackIcon,
  size = 'md'
}) => {
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }

  const defaultFallbackIcon = (
    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
  )

  // If no src or image failed to load, show placeholder
  if (!src || imageError) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-100 rounded-lg flex items-center justify-center ${className}`}>
        {fallbackIcon || defaultFallbackIcon}
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`max-w-full max-h-full object-contain transition-opacity duration-200 ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
      />
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse bg-gray-200 w-full h-full"></div>
        </div>
      )}
    </div>
  )
}

export default ProductImage 