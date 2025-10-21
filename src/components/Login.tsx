
import React, { useState } from 'react';
import { TargetIcon } from './icons';

interface LoginProps {
  onLogin: (password: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError('');
    } else {
      setError('Senha de acesso incorreta. Tente novamente.');
      // Adiciona um efeito de vibração ao formulário em caso de erro
      const form = e.currentTarget as HTMLFormElement;
      form.parentElement?.classList.add('animate-shake');
      setTimeout(() => {
        form.parentElement?.classList.remove('animate-shake');
      }, 500);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200 p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <TargetIcon className="h-12 w-12 text-sky-500 mx-auto" />
            <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mt-4">
              Forex SMC Sniper
            </h1>
            <p className="text-slate-400 mt-2">Acesso Restrito à Versão de Teste</p>
          </div>
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl shadow-lg p-8 transition-transform duration-500">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                  Senha de Acesso
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-slate-100 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="********"
                  required
                  aria-describedby={error ? "password-error" : undefined}
                />
              </div>
              {error && <p id="password-error" className="text-red-400 text-sm mb-4">{error}</p>}
              <button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                Entrar
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-500 mt-6">
            Esta é uma aplicação para uso pessoal e testes.
          </p>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};
