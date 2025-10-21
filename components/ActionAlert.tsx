import React, { useEffect, useState } from 'react';
import { CheckCircleIcon, XIcon } from './icons';

interface ActionAlertProps {
  message: string | null;
  onClose: () => void;
}

export const ActionAlert: React.FC<ActionAlertProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 3000); // Desaparece após 3 segundos
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleClose = () => {
    setIsVisible(false);
    // Permite que a animação de saída seja concluída antes de chamar onClose
    setTimeout(() => {
        onClose();
    }, 300);
  };
  
  if (!message) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-24 md:bottom-5 right-5 z-50 transition-all duration-300 ease-in-out ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
      role="alert"
    >
      <div className="bg-slate-800/80 backdrop-blur-md border border-green-500/50 rounded-lg shadow-2xl p-4 flex items-center space-x-4 max-w-sm">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="w-6 h-6 text-green-400" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-100">{message}</p>
        </div>
        <div className="flex-shrink-0">
          <button onClick={handleClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500">
            <XIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};