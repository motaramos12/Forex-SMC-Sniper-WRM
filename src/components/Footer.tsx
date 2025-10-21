
import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 border-t border-slate-800 mt-auto py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
        <p className="font-semibold text-slate-400">
          © {currentYear} Forex SMC Sniper WRM. Todos os direitos reservados.
        </p>
        <p className="mt-2 max-w-2xl mx-auto">
          Aviso de Risco: As informações e ferramentas fornecidas por esta aplicação são apenas para fins educacionais e de simulação. Negociar no mercado Forex envolve risco substancial e não é adequado para todos os investidores. Não arrisque mais do que você está preparado para perder.
        </p>
      </div>
    </footer>
  );
};
