import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 3.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Render Area */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full">
        {toasts.map((toast) => {
          let styles = '';
          switch (toast.type) {
            case 'error':
              styles = 'border-red-500/30 text-red-400 bg-[#160b0d]/90 shadow-[0_0_15px_rgba(239,68,68,0.25)]';
              break;
            case 'warning':
              styles = 'border-orange-500/30 text-orange-400 bg-[#16100b]/90 shadow-[0_0_15px_rgba(249,115,22,0.25)]';
              break;
            case 'info':
              styles = 'border-blue-500/30 text-blue-400 bg-[#0b1016]/90 shadow-[0_0_15px_rgba(59,130,246,0.25)]';
              break;
            default: // success
              styles = 'border-gold-500/30 text-gold bg-[#121316]/90 shadow-[0_0_15px_rgba(212,175,55,0.25)]';
          }
          return (
            <div
              key={toast.id}
              className={`flex justify-between items-center p-4 rounded-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 scale-100 ${styles}`}
            >
              <div className="font-semibold text-sm">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-4 text-gray-400 hover:text-white focus:outline-none text-xs"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
