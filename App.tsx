import React from 'react';
import { Dashboard } from './Dashboard';

const App: React.FC = () => {
  // Acesso direto ao dashboard, removendo a necessidade de senha
  // para a versão final e de uso pessoal do usuário.
  return <Dashboard />;
};

export default App;
