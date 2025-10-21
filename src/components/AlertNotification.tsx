
import React, { useEffect, useState } from 'react';
import { BellIcon, XIcon } from './icons';

interface AlertNotificationProps {
  show: boolean;
  message: string;
  onClose: () => void;
}

export const AlertNotification: React.FC<AlertNotificationProps> = ({ show, message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 4000); // A notificação desaparece após 4 segundos
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  const handleClose = () => {
    setIsVisible(false);
    // Permite que a animação de saída seja concluída antes de chamar onClose
    setTimeout(() => {
        onClose();
    }, 300);
  };
  
  if (!show) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
      role="alert"
    >
      <div className="bg-slate-800/80 backdrop-blur-md border border-sky-500/50 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm">
        <div className="flex-shrink-0">
          <BellIcon className="w-6 h-6 text-sky-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-100">{message}</p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
