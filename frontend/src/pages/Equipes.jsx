import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Shuffle, Users } from 'lucide-react';

const Equipes = () => {
  const [dias, setDias] = useState([]);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [equipes, setEquipes] = useState([]);
  const [numTimes, setNumTimes] = useState(2);
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

  const carregarEquipes = async (diaId) => {
    try {
      const response = await api.get(`/teams/${diaId}`);
      setEquipes(response.data);
      setDiaSelecionado(diaId);
    } catch (error) {
      console.error('Erro ao carregar equipes:', error);
    }
  };

  const gerarEquipes = async () => {
    if (!diaSelecionado) {
      alert('Selecione um dia primeiro');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/teams/gerar/${diaSelecionado}`, {
        quantidade_times: numTimes
      });
      setEquipes(response.data.equipes);
      alert('Equipes geradas com sucesso!');
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao gerar equipes');
    } finally {
      setLoading(false);
    }
  };

  const getCorTime = (cor) => {
    const cores = {
      'Azul': '#2563eb',
      'Vermelho': '#dc2626',
      'Verde': '#16a34a',
      'Amarelo': '#ca8a04',
      'Laranja': '#ea580c',
      'Roxo': '#9333ea'
    };
    return cores[cor] || '#1a5f3f';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Geração de Equipes
          </h2>
          <p className="text-gray-600">
            Gere equipes aleatórias para os jogos
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Configurar Equipes</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2">Dia do Jogo</label>
              <select
                value={diaSelecionado || ''}
                onChange={(e) => {
                  const id = e.target.value;
                  if (id) {
                    setDiaSelecionado(Number(id));
                    carregarEquipes(Number(id));
                  }
                }}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
              >
                <option value="">Selecione um dia</option>
                {dias.map(dia => (
                  <option key={dia.id} value={dia.id}>
                    {dia.data} - {dia.total_inscritos} inscritos
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Número de Times</label>
              <input
                type="number"
                min="2"
                max="6"
                value={numTimes}
                onChange={(e) => setNumTimes(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={gerarEquipes}
                disabled={loading || !diaSelecionado}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition disabled:opacity-50"
              >
                <Shuffle size={20} />
                {loading ? 'Gerando...' : 'Gerar Equipes'}
              </button>
            </div>
          </div>
        </div>

        {equipes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipes.map((equipe) => (
              <div
                key={equipe.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <div
                  className="p-4 text-white font-bold text-center"
                  style={{ backgroundColor: getCorTime(equipe.cor) }}
                >
                  <h3 className="text-xl">{equipe.nome}</h3>
                  <p className="text-sm opacity-90">
                    {equipe.jogadores?.length || 0} jogadores
                  </p>
                </div>
                <div className="p-4">
                  {equipe.jogadores && equipe.jogadores.length > 0 ? (
                    <ul className="space-y-2">
                      {equipe.jogadores.map((jogador, idx) => (
                        <li
                          key={jogador.id}
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                        >
                          <span className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span>{jogador.nome}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-center">Sem jogadores</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {diaSelecionado && equipes.length === 0 && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">
              Nenhuma equipe gerada ainda
            </p>
            <p className="text-sm text-gray-500">
              Clique em "Gerar Equipes" para criar times aleatórios
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Equipes;