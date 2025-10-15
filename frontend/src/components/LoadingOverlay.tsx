import React from 'react'

interface LoadingOverlayProps {
  show: boolean
  message?: string
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ show, message }) => {
  if (!show) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-heritage-800/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-heritage-100">
        <svg
          className="animate-spin h-10 w-10 text-heritage-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="text-center">
          <p className="text-lg font-medium">{message || 'Please wait...'}</p>
          <p className="text-sm text-heritage-100/80">Just a moment while we process your request</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay
