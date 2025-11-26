import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import api from '../services/api';
import { Users, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [campos, setCampos] = useState([]);
  const [dias, setDias] = useState([]);
  const [abaAtiva, setAbaAtiva] = useState('usuarios');
  const [mostrarFormCampo, setMostrarFormCampo] = useState(false);
  const [mostrarFormDia, setMostrarFormDia] = useState(false);

  const [novoCampo, setNovoCampo] = useState({
    nome: '',
    localizacao: '',
    tipo: 'Society',
    valor_hora: ''
  });

  const [novoDia, setNovoDia] = useState({
    data: '',
    agendamento_id: ''
  });

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [usuariosRes, camposRes, diasRes] = await Promise.all([
        api.get('/users'),
        api.get('/campos'),
        api.get('/inscricoes/dias-jogo')
      ]);
      setUsuarios(usuariosRes.data);
      setCampos(camposRes.data);
      setDias(diasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const criarCampo = async (e) => {
    e.preventDefault();
    try {
      await api.post('/campos', novoCampo);
      alert('Campo criado com sucesso!');
      setMostrarFormCampo(false);
      setNovoCampo({ nome: '', localizacao: '', tipo: 'Society', valor_hora: '' });
      carregarDados();
    } catch (error) {
      alert('Erro ao criar campo');
    }
  };

  const criarDia = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inscricoes/dias-jogo', novoDia);
      alert('Dia de jogo criado!');
      setMostrarFormDia(false);
      setNovoDia({ data: '', agendamento_id: '' });
      carregarDados();
    } catch (error) {
      alert('Erro ao criar dia');
    }
  };

  const deletarCampo = async (id) => {
    if (!confirm('Deseja desativar este campo?')) return;
    try {
      await api.delete(`/campos/${id}`);
      alert('Campo desativado!');
      carregarDados();
    } catch (error) {
      alert('Erro ao desativar campo');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Painel Administrativo
          </h2>
          <p className="text-gray-600">
            Gerencie usuários, campos e dias de jogo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setAbaAtiva('usuarios')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                  abaAtiva === 'usuarios'
                    ? 'border-adc-green text-adc-green'
                    : 'border-transparent text-gray-600'
                }`}
              >
                <Users size={20} />
                Usuários
              </button>
              <button
                onClick={() => setAbaAtiva('campos')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                  abaAtiva === 'campos'
                    ? 'border-adc-green text-adc-green'
                    : 'border-transparent text-gray-600'
                }`}
              >
                <MapPin size={20} />
                Campos
              </button>
              <button
                onClick={() => setAbaAtiva('dias')}
                className={`flex items-center gap-2 px-6 py-3 border-b-2 transition ${
                  abaAtiva === 'dias'
                    ? 'border-adc-green text-adc-green'
                    : 'border-transparent text-gray-600'
                }`}
              >
                <Calendar size={20} />
                Dias de Jogo
              </button>
            </div>
          </div>

          <div className="p-6">
            {abaAtiva === 'usuarios' && (
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Usuários Cadastrados ({usuarios.length})
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left">Nome</th>
                        <th className="px-4 py-3 text-left">Email</th>
                        <th className="px-4 py-3 text-left">Telefone</th>
                        <th className="px-4 py-3 text-left">Tipo</th>
                        <th className="px-4 py-3 text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map(usuario => (
                        <tr key={usuario.id} className="border-t">
                          <td className="px-4 py-3">{usuario.nome}</td>
                          <td className="px-4 py-3">{usuario.email}</td>
                          <td className="px-4 py-3">{usuario.telefone || '-'}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              usuario.tipo === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {usuario.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-sm ${
                              usuario.ativo
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {usuario.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {abaAtiva === 'campos' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Campos Cadastrados ({campos.length})
                  </h3>
                  <button
                    onClick={() => setMostrarFormCampo(!mostrarFormCampo)}
                    className="flex items-center gap-2 px-4 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition"
                  >
                    <Plus size={20} />
                    Novo Campo
                  </button>
                </div>

                {mostrarFormCampo && (
                  <form onSubmit={criarCampo} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Nome do Campo"
                        value={novoCampo.nome}
                        onChange={(e) => setNovoCampo({...novoCampo, nome: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Localização"
                        value={novoCampo.localizacao}
                        onChange={(e) => setNovoCampo({...novoCampo, localizacao: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      />
                      <select
                        value={novoCampo.tipo}
                        onChange={(e) => setNovoCampo({...novoCampo, tipo: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                      >
                        <option>Society</option>
                        <option>Campo</option>
                        <option>Quadra</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Valor por Hora (R$)"
                        value={novoCampo.valor_hora}
                        onChange={(e) => setNovoCampo({...novoCampo, valor_hora: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                        step="0.01"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition"
                      >
                        Criar Campo
                      </button>
                      <button
                        type="button"
                        onClick={() => setMostrarFormCampo(false)}
                        className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campos.map(campo => (
                    <div key={campo.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-lg">{campo.nome}</h4>
                          <p className="text-sm text-gray-600">{campo.localizacao}</p>
                        </div>
                        <button
                          onClick={() => deletarCampo(campo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {campo.tipo}
                        </span>
                        <span className="font-bold text-adc-green">
                          R$ {campo.valor_hora}/h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {abaAtiva === 'dias' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">
                    Dias de Jogo ({dias.length})
                  </h3>
                  <button
                    onClick={() => setMostrarFormDia(!mostrarFormDia)}
                    className="flex items-center gap-2 px-4 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition"
                  >
                    <Plus size={20} />
                    Novo Dia
                  </button>
                </div>

                {mostrarFormDia && (
                  <form onSubmit={criarDia} className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="date"
                        value={novoDia.data}
                        onChange={(e) => setNovoDia({...novoDia, data: e.target.value})}
                        className="px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-adc-green text-white rounded-lg hover:bg-adc-light transition"
                      >
                        Criar Dia
                      </button>
                      <button
                        type="button"
                        onClick={() => setMostrarFormDia(false)}
                        className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-3">
                  {dias.map(dia => (
                    <div key={dia.id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <p className="font-bold">{dia.data}</p>
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;