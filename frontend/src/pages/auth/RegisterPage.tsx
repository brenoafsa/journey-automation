import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { setAuthToken } from '../../services/api';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { token } = await authService.register({ name, email, password });
      setAuthToken(token);
      navigate('/');
    } catch (err) {
      setError('Erro ao registrar. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md min-w-[320px] flex flex-col gap-4"
      >
        <h2 className="text-center mb-2 text-2xl font-bold text-gray-800">Registrar</h2>
        <input
          type="text"
          placeholder="Nome"
          value={name}
          required
          onChange={e => setName(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          required
          onChange={e => setPassword(e.target.value)}
          className="p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
        <button
          type="submit"
          className="py-2 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
        >
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;