import React from 'react';

const Modal = ({ isOpen, onClose, children, title, size = 'medium', isDarkMode = true }) => {
  if (!isOpen) return null;

  const sizes = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
    full: 'max-w-4xl',
  };

  const overlayClasses = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
  const modalClasses = `w-full ${sizes[size]} ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl`;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div className={modalClasses}>
        {title && (
          <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold">{title}</h3>
            <button
              onClick={onClose}
              className={`p-1 rounded-full hover:bg-gray-200 ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
