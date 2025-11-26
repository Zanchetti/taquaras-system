import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { UserPlus, Users, X } from 'lucide-react';

const Inscricoes = () => {
  const [dias, setDias] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [inscritos, setInscritos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDias();
  }, []);

  const carregarDias = async () => {
    try {
      const response = await api.get('/inscricoes/dias-jogo');
      setDias(response.data);
    } catch (error) {
      console.error('Erro ao carregar dias:', error);
    }
  };

  const carregarInscritos = async (diaId) => {
    try {
      const response = await api.get(`/inscricoes/inscritos/${diaId}`);
      setInscritos(response.data);
      setDiaSelecionado(diaId);
    } catch (error) {
      console.error('Erro ao carregar inscritos:', error);
    }
  };

  const inscrever = async (diaId) => {
    setLoading(true);
    try {
      await api.post('/inscricoes/inscrever', { dia_jogo_id: diaId });
      alert('Inscrição realizada com sucesso!');
      carregarDias();
      if (diaSelecionado === diaId) {
        carregarInscritos(diaId);
      }
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao se inscrever');
    } finally {
      setLoading(false);
    }
  };

  const cancelarInscricao = async (diaId) => {
    if (!confirm('Deseja cancelar sua inscrição?')) return;

    setLoading(true);
    try {
      await api.delete(`/inscricoes/inscrever/${diaId}`);
      alert('Inscrição cancelada!');
      carregarDias();
      if (diaSelecionado === diaId) {
        carregarInscritos(diaId);
      }
    } catch (error) {
      alert('Erro ao cancelar inscrição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Inscrições para Jogos
          </h2>
          <p className="text-gray-600">
            Inscreva-se nos próximos jogos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Dias Disponíveis</h3>
            </div>
            <div className="p-6">
              {dias.length > 0 ? (
                <div className="space-y-4">
                  {dias.map(dia => (
                    <div
                      key={dia.id}
                      className="border rounded-lg p-4 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-lg">{dia.data}</p>
                          <p className="text-sm text-gray-600">
                            {dia.total_inscritos} inscritos
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          dia.status === 'aberto' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {dia.status}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => carregarInscritos(dia.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                          <Users size={18} />
                          Ver Inscritos
                        </button>

                        {dia.status === 'aberto' && (
                          <button
                            onClick={() => inscrever(dia.id)}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-adc-green text-white rounded hover:bg-adc-light transition disabled:opacity-50"
                          >
                            <UserPlus size={18} />
                            Inscrever-se
                          </button>
                        )}

                        <button
                          onClick={() => cancelarInscricao(dia.id)}
                          disabled={loading}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                        >
                          <X size={18} />
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Nenhum dia disponível
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold">Inscritos</h3>
            </div>
            <div className="p-6">
              {diaSelecionado ? (
                inscritos.length > 0 ? (
                  <div className="space-y-2">
                    {inscritos.map((inscrito, index) => (
                      <div
                        key={inscrito.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded"
                      >
                        <div className="w-8 h-8 bg-adc-green text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-semibold">{inscrito.nome}</p>
                          <p className="text-sm text-gray-600">{inscrito.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum inscrito ainda
                  </p>
                )
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Selecione um dia para ver os inscritos
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inscricoes;