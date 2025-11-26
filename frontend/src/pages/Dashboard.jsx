import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Calendar, Trophy } from 'lucide-react';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState({
    proximosJogos: [],
    totalInscritos: 0,
    proximosAgendamentos: []
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [diasRes, agendamentosRes] = await Promise.all([
        api.get('/inscricoes/dias-jogo'),
        api.get('/agendamentos')
      ]);

      setStats({
        proximosJogos: diasRes.data.slice(0, 3),
        totalInscritos: diasRes.data.reduce((acc, dia) => acc + dia.total_inscritos, 0),
        proximosAgendamentos: agendamentosRes.data.slice(0, 3)
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Bem-vindo, {usuario?.nome}!
          </h2>
          <p className="text-gray-600">
            Gerencie suas atividades no ADC Taquaras
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Próximos Jogos</p>
                <p className="text-3xl font-bold text-adc-green">
                  {stats.proximosJogos.length}
                </p>
              </div>
              <Trophy className="text-adc-green" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total de Inscritos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {stats.totalInscritos}
                </p>
              </div>
              <Users className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Agendamentos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {stats.proximosAgendamentos.length}
                </p>
              </div>
              <Calendar className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-800">Próximos Jogos</h3>
          </div>
          <div className="p-6">
            {stats.proximosJogos.length > 0 ? (
              <div className="space-y-4">
                {stats.proximosJogos.map(jogo => (
                  <div
                    key={jogo.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{jogo.data}</p>
                      <p className="text-sm text-gray-600">
                        {jogo.total_inscritos} inscritos
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      jogo.status === 'aberto' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {jogo.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Nenhum jogo agendado
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;