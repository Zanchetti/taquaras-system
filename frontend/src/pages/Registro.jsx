// frontend/src/pages/Registro.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Registro = () => {
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
  });
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { registro } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setDados({ ...dados, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      await registro(dados);
      alert('Cadastro realizado com sucesso! Faça login.');
      navigate('/login');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-adc-green to-adc-light flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-adc-green mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600">ADC Taquaras</p>
        </div>

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={dados.nome}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={dados.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={dados.telefone}
              onChange={handleChange}
              placeholder="(47) 99999-9999"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Senha</label>
            <input
              type="password"
              name="senha"
              value={dados.senha}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
              required
              minLength={6}
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-adc-green hover:bg-adc-light text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link 
            to="/login" 
            className="text-adc-green hover:underline"
          >
            Já tem conta? Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Registro;