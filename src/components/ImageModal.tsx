
import React from 'react';
import { XIcon } from './icons';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 z-[100] flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-slate-900 p-2 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] border border-slate-700 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt={altText} className="max-w-full max-h-[calc(90vh-2rem)] object-contain" />
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 p-2 rounded-full text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-600"
          aria-label="Fechar imagem"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
