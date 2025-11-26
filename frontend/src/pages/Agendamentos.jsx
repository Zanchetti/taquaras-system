import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Calendar, Clock, MapPin, Plus, X } from 'lucide-react';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [campos, setCampos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [novoAgendamento, setNovoAgendamento] = useState({
    campo_id: '',
    data: '',
    hora_inicio: '',
    hora_fim: '',
    observacoes: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [agendamentosRes, camposRes] = await Promise.all([
        api.get('/agendamentos'),
        api.get('/campos')
      ]);
      setAgendamentos(agendamentosRes.data);
      setCampos(camposRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/agendamentos', novoAgendamento);
      alert('Agendamento criado com sucesso!');
      setMostrarForm(false);
      setNovoAgendamento({
        campo_id: '',
        data: '',
        hora_inicio: '',
        hora_fim: '',
        observacoes: ''
      });
      carregarDados();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  const cancelarAgendamento = async (id) => {
    if (!confirm('Deseja cancelar este agendamento?')) return;

    try {
      await api.delete(`/agendamentos/${id}`);
      alert('Agendamento cancelado!');
      carregarDados();
    } catch (error) {
      alert('Erro ao cancelar agendamento');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Agendamentos de Campo
            </h2>
            <p className="text-gray-600">
              Gerencie os horários dos campos
            </p>
          </div>
          <button
            onClick={() => setMostrarForm(!mostrarForm)}
            className="flex items-center gap-2 px-4 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition"
          >
            <Plus size={20} />
            Novo Agendamento
          </button>
        </div>

        {mostrarForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold mb-4">Novo Agendamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Campo</label>
                  <select
                    value={novoAgendamento.campo_id}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      campo_id: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
                    required
                  >
                    <option value="">Selecione um campo</option>
                    {campos.map(campo => (
                      <option key={campo.id} value={campo.id}>
                        {campo.nome} - R$ {campo.valor_hora}/h
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Data</label>
                  <input
                    type="date"
                    value={novoAgendamento.data}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      data: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Hora Início</label>
                  <input
                    type="time"
                    value={novoAgendamento.hora_inicio}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      hora_inicio: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Hora Fim</label>
                  <input
                    type="time"
                    value={novoAgendamento.hora_fim}
                    onChange={(e) => setNovoAgendamento({
                      ...novoAgendamento,
                      hora_fim: e.target.value
                    })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Observações</label>
                <textarea
                  value={novoAgendamento.observacoes}
                  onChange={(e) => setNovoAgendamento({
                    ...novoAgendamento,
                    observacoes: e.target.value
                  })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-adc-green focus:outline-none"
                  rows="3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Agendamento'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarForm(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold">Agendamentos Confirmados</h3>
          </div>
          <div className="p-6">
            {agendamentos.length > 0 ? (
              <div className="space-y-4">
                {agendamentos.map(agendamento => (
                  <div
                    key={agendamento.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-bold text-lg text-adc-green">
                          {agendamento.campo_nome}
                        </h4>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={18} />
                          <span>{agendamento.data}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <Clock size={18} />
                          <span>
                            {agendamento.hora_inicio} - {agendamento.hora_fim}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin size={18} />
                          <span>Agendado por: {agendamento.usuario_nome}</span>
                        </div>

                        {agendamento.observacoes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Obs:</strong> {agendamento.observacoes}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => cancelarAgendamento(agendamento.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
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
                Nenhum agendamento encontrado
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Agendamentos;